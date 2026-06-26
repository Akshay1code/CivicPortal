const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const { checkActiveSession } = require('../controllers/auth.controller');

let getConnection=async()=>{
    let client=new MongoClient(process.env.MONGO_URL)
    await client.connect()
    let db = client.db('civicPortal')
    let coll = db.collection('sessionStorage')
    return {client,coll}
}
let checkIfExists=async(sessionId)=>{
    console.log(sessionId)
    let {client,coll} = await getConnection()
    let isSession = await coll.findOne({_id:new ObjectId(sessionId)})
    if(!isSession){
        return false
    }
    return true
}
let createSessionId=async(userId,ip,userAgent,refreshToken)=>{
    try{
        let refreshTokenHash=""
        if(refreshToken){
            refreshTokenHash=await bcrypt.hash(data.password,10);
        }
        let {client,coll} = await getConnection();
        
        let session=await coll.insertOne({
            userId:userId,
            ip:ip,
            userAgent:userAgent,
            refreshTokenHash:refreshTokenHash,
            revoked:false,
            createdAt:new Date(),
            updatedAt:new Date()
        })

        await client.close()
        return session.insertedId
    }
    catch(err){
        return err.stack
    }
}

let updateSessionId=async (refreshToken,sessionId)=>{

    if(!refreshToken){
        throw new Error("Refresh Tokens Doesnot exists")
        return false
    }
    let refreshTokenHash=await bcrypt.hash(refreshToken,10)
    let {client,coll} = await getConnection()
    await coll.updateOne({_id:sessionId},{$set:{refreshTokenHash:refreshTokenHash}})
    await client.close()
    return true
}

let deleteSessionId=async (sessionId)=>{
    try{
        let {client,coll} = await getConnection()
        await coll.deleteOne({_id:new ObjectId(sessionId)})
        await client.close()
        return true
    }
    catch(err){
        return false
    }
}

module.exports={createSessionId,updateSessionId,deleteSessionId,checkIfExists}