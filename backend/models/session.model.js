const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

let getConnection=async()=>{
    let client=new MongoClient(process.env.MONGO_URL)
    await client.connect()
    let db = client.db('civicPortal')
    let coll = db.collection('sessionStorage')
    return {client,coll}
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
        return session._id
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
        await deleteOne(sessionId)
        return true
    }
    catch(err){
        return false
    }
}

module.exports={createSessionId,updateSessionId,deleteSessionId}