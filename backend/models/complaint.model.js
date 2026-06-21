const { MongoClient, ObjectId } = require("mongodb")

let getConnection = () => {
    let client = new MongoClient(process.env.MONGO_URL)
    let db = client.db('civicPortal')
    let coll = db.collection('complaints')
    return { client, coll }
}
let getComplaints = (res) => {
    let { client, coll } = getConnection();
    coll.find().toArray()
        .then((payload) => res.send(payload))
        .catch((err) => res.status(409).json({ message: "Something Went Wrong" }))
        .finally(() => client.close())
}

let registerComplaint = (data, res) => {
    let { client, coll } = getConnection()
    coll.insertOne(data)
        .then(() => res.status(200).json({ message: "Complaint Registered Successfull" }))
        .catch((err) => res.status(409).json({ message: "Error in delivering Complaint" }))
        .finally(() => client.close())
}

let incrementLikes=(id,userId,res)=>{
    let {client,coll}=getConnection()
    let alreadySupported=""
    coll.findOne({_id:new ObjectId(id)})
    .then((complaint)=>{
            alreadySupported=complaint.supportedUsers.includes(userId);
            if(!alreadySupported){
                coll.findOneAndUpdate({_id:new ObjectId(id)},{$inc:{likes:1},$addToSet:{supportedUsers:userId}})
                .then(()=>res.send(true))
                .catch((err)=>res.send(err))
                return
            }
            coll.findOneAndUpdate({_id:new ObjectId(id)},{$inc:{likes:-1},$pull:{supportedUsers:userId}})
            .then(()=>res.send(false))
            .catch((err)=>res.send(err))
        })
    .catch((err)=>{res.send(err)})
    
    
}

module.exports = { getComplaints, registerComplaint ,incrementLikes}