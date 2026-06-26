const { MongoClient, ObjectId } = require("mongodb")

let getConnection = async() => {
    let client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    let db = client.db('civicPortal')
    let coll = db.collection('complaints')
    return { client, coll }
}

const getComplaintFilters = (id) => {
    const filters = [{ _id: id }]
    if (ObjectId.isValid(id)) {
        filters.unshift({ _id: new ObjectId(id) })
    }
    return filters
}
let getComplaints = async (res) => {
    
    try{
        let { client, coll } = await getConnection();
        let payload = await coll.find().sort({ likes: -1, createdAt: -1 }).toArray()
        await client.close()
        res.send(payload)
    }
    catch(err){
        res.status(409).json({ message: "Something Went Wrong" ,error:err.stack})
    }
}

let registerComplaint = async(data, res) => {
    try{
        let { client, coll } = await getConnection()
        await coll.insertOne(data)
        res.status(200).json({ message: "Complaint Registered Successfull" })
        await client.close()
    }
    catch(err){
        console.log(err)
        res.status(409).json({ message: "Error in delivering Complaint" })
        return
    }
}

let incrementLikes=async (id,userId,res)=>{

    try{
        let {client,coll}=await getConnection()
        let complaint =await coll.findOne({_id:new ObjectId(id)})
        let alreadySupported = complaint.supportedUsers.includes(userId);
        if(!alreadySupported){
            let result = await coll.findOneAndUpdate({_id:new ObjectId(id)},{$inc:{likes:1},$addToSet:{supportedUsers:userId}})
            console.log(result)
            await client.close()
            res.send(true)
            return
        }
        await coll.findOneAndUpdate({_id:new ObjectId(id)},{$inc:{likes:-1},$pull:{supportedUsers:userId}})
        await client.close()
        res.send(false)
    }
    catch(err){
        console.log(err.stack)
        res.send(err)
    }
}

let updateComplaint = async (id, data, res) => {
    try {
        let { client, coll } = await getConnection()
        let matchedFilter = null
        for (const filter of getComplaintFilters(id)) {
            const result = await coll.updateOne(filter, { $set: data })
            if (result.matchedCount > 0) {
                matchedFilter = filter
                break
            }
        }
        if (!matchedFilter) {
            await client.close()
            return res.status(404).json({ message: "Complaint not found" })
        }
        const updatedComplaint = await coll.findOne(matchedFilter)
        res.status(200).json({ message: "updated", complaint: updatedComplaint })
        await client.close()
    } catch(err) {
        console.log(err)
        res.status(400).json({ message: "Error updating complaint" })
    }
}

let adminUpdateComplaint = async (id, data, res) => {
    let client
    try {
        let connection = await getConnection()
        client = connection.client
        let coll = connection.coll
        let updateData = {}

        if (data.status !== undefined) {
            updateData.status = data.status
        }

        if (data.adminComment !== undefined) {
            updateData.adminComment = data.adminComment.trim()
        }

        let matchedFilter = null
        for (const filter of getComplaintFilters(id)) {
            const result = await coll.updateOne(filter, { $set: updateData })
            if (result.matchedCount > 0) {
                matchedFilter = filter
                break
            }
        }

        if (!matchedFilter) {
            await client.close()
            return res.status(404).json({ message: "Complaint not found" })
        }

        const updatedComplaint = await coll.findOne(matchedFilter)
        await client.close()
        res.status(200).json({ message: "updated", complaint: updatedComplaint })
    } catch(err) {
        console.log(err)
        if (client) {
            await client.close()
        }
        res.status(400).json({ message: "Error updating admin complaint" })
    }
}

let deleteComplaint = async (id, res) => {
    try {
        let { client, coll } = await getConnection()
        let deleted = false
        for (const filter of getComplaintFilters(id)) {
            const result = await coll.deleteOne(filter)
            if (result.deletedCount > 0) {
                deleted = true
                break
            }
        }
        if (!deleted) {
            await client.close()
            return res.status(404).json({ message: "Complaint not found" })
        }
        res.status(200).json({ message: "deleted" })
        await client.close()
    } catch(err) {
        console.log(err)
        res.status(400).json({ message: "Error deleting complaint" })
    }
}

module.exports = { getComplaints, registerComplaint ,incrementLikes, updateComplaint, adminUpdateComplaint, deleteComplaint }
