let {MongoClient, ObjectId}=require('mongodb')
let middleware = require('../middlewares/jwt.auth.js')
let session = require('./session.model.js')
let jwt= require("../middlewares/jwt.auth.js")
const bcrypt = require('bcrypt');

let getConnection=async ()=>{
    let client=new MongoClient(process.env.MONGO_URL)
    await client.connect()
    let db=client.db("civicPortal")
    let coll=db.collection('user')
    return {client,coll}
}

let addUser=async(data,res)=>{
    let {client,coll}=await getConnection()
    let existingUser=await coll.findOne({username:data.username})
    if(existingUser){
        return res.status(404).json({message:"Username Already exists try diff combinations"})
    }
    data.password=await bcrypt.hash(data.password,10)
    let user=await coll.insertOne(data)
    res.status(200).json({message:"User created Successfully,Please login to continue"})
}

let isUser=async(data,ip,userAgent,res)=>{
    if(!data){
        res.status(401).json({message:"No Data Provided"})
        return
    }
    let {client,coll} = await getConnection()
    let user=await coll.findOne({username:data.username})
    if(!user || !bcrypt.compare(data.password,user.password)){
        client.close()
        return res.status(404).json({message:"Invalid username or password"})
    }

    let sessionId= await session.createSessionId(user._id,ip,userAgent,null)
    let {accessToken,refreshToken}=jwt.createTokens(user._id,sessionId,user.role)
    if(!session.updateSessionId(refreshToken,sessionId)){
        res.send(401).json({message:"Token didn'nt update"})
        return
    }

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:7*24*60*60*1000 //7Days
    })

    await client.close()
    res.status(200).json({message:"Login Successfull",accessToken,role:user.role})
}

let getProfile=async (accessToken,res)=>{
    let {userId,sessionId} = jwt.fetchTokenDetails(accessToken)
    let {client,coll}=await getConnection()
    coll.findOne({_id:new ObjectId(userId)})
    .then((payload)=>res.send(payload))
    .catch(()=>res.status(409).json({message:"Something Went Wrong"}))
    .finally(()=>client.close())
}

let updateDetails=async(accessToken,data,res)=>{
    try{
        let {userId}=jwt.fetchTokenDetails(accessToken)
        let {client,coll}=await getConnection()
        let existingUser=await coll.findOne({_id:new ObjectId(userId)})
        if(!existingUser){
            await client.close()
            return res.status(404).json({message:"User not found"})
        }

        let updateData={}
        if(data.fullName !== undefined && data.fullName.trim() !== ''){
            updateData.fullName=data.fullName.trim()
        }
        if(data.username !== undefined && data.username.trim() !== ''){
            let username=data.username.trim()
            if(username !== existingUser.username){
                let takenUser=await coll.findOne({username})
                if(takenUser){
                    await client.close()
                    return res.status(409).json({message:"Username already exists"})
                }
            }
            updateData.username=username
        }
        if(data.password !== undefined && data.password.trim() !== ''){
            updateData.password=await bcrypt.hash(data.password.trim(),10)
        }

        await coll.updateOne(
            {_id:new ObjectId(userId)},
            {$set:updateData}
        )
        let updatedUser=await coll.findOne({_id:new ObjectId(userId)},{projection:{password:0}})
        await client.close()
        return res.status(200).json({message:"Updated Successfully",user:updatedUser})
    }
    catch(err){
        console.log(err.stack)
        return res.status(500).json({message:"Couldnt update", err:err.stack})
    }
}

let deleteProfile=async (accessToken,res)=>{
    
    try{
        let {userId,sessionId} = jwt.fetchTokenDetails(accessToken)
        let {client,coll}=await getConnection()
        await coll.deleteOne({_id:new ObjectId(userId)})
        await session.deleteSessionId(sessionId)
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        res.status(200).json({message:"Deleted Successfully"})
        await client.close()
    }
    catch(err){
        res.status(409).json({message:"Something Went Wrong",err:err.stack})
    }
}

let isRefreshToken=(req,res)=>{
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        res.status(401).json({status:false,message:"Unauthorized Person"})
        return
    }
    let{userId,sessionId,role}=jwt.fetchTokenDetails(refreshToken)
    res.status(200).json({status:true,role})
}

let generatetokens=(req,res)=>{
    let refreshToken1=req.cookies.refreshToken
    let{userId,sessionId,role}=jwt.fetchTokenDetails(refreshToken1)
    let {accessToken,refreshToken}=jwt.createTokens(userId,sessionId,role)
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:7*24*60*60*1000
    })
    res.status(200).json({accessToken})
}

let checkActiveSession=async(sessionId,res)=>{
    let status = await session.checkIfExists(sessionId)
    res.status(200).json({status})
}
module.exports={addUser,isUser,getProfile,updateDetails,deleteProfile,isRefreshToken,generatetokens,checkActiveSession}
