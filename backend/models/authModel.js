let {MongoClient, ObjectId}=require('mongodb')

let getConnection=()=>{
    let client=new MongoClient(process.env.MONGO_URL)
    let db=client.db("civicPortal")
    let coll=db.collection('user')
    return {client,coll}
}
let addUser=async(data,res)=>{
    let {client,coll}=getConnection()
    let existingUser=await coll.findOne({username:data.username})
    if(existingUser){
        return res.status(404).json({message:"Username Already exists try diff combinations"})
    }
    coll.insertOne(data)
    .then(()=>res.status(200).json({message:"Successfully Added in to DB"}))
    .catch((err)=>res.status(500).send(err))
    .finally(()=>client.close())
}

let isUser=async(data,res)=>{
    let {client,coll}=await getConnection()
    let existingUser=await coll.findOne({username:data.username,password:data.password})
    if(!existingUser){
        client.close()
        return res.status(404).json({message:"Invalid username or password"})
    }
    client.close()
    res.status(200).json({message:"Login Successfull",userId:existingUser._id,role:existingUser.role})
}

let getProfile=(id,res)=>{
    let {client,coll}=getConnection()
    coll.findOne({_id:new ObjectId(id)})
    .then((payload)=>res.send(payload))
    .catch(()=>res.status(409).json({message:"Something Went Wrong"}))
    .finally(()=>client.close())
}

let deleteProfile=(id,res)=>{
    let {client,coll}=getConnection()
    coll.deleteOne({_id:new ObjectId(id)})
    .then((payload)=>res.json({message:"Deleted Successfully"}))
    .catch(()=>res.status(409).json({message:"Something Went Wrong"}))
    .finally(()=>client.close())
}
module.exports={addUser,isUser,getProfile,deleteProfile}