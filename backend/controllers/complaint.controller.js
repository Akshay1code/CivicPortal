let jwt=require('../middlewares/jwt.auth.js')
let complaintModel=require('../models/complaint.model.js')
const cloudinary = require("cloudinary").v2;
let getComplaints=(req,res)=>{
    try{
        let isUser=jwt.verifyUser(req.headers.authorization.split(" ")[1])
        complaintModel.getComplaints(res);
    }
    catch(err){
        console.log(err.stack)
        res.status(401).json({message:"Unauthorised Person" , err:err.stack})
        return
    }
    
}

let registerComplaint=async(req,res)=>{
    let isUser=jwt.verifyUser(req.headers.authorization.split(" ")[1])
    if(!isUser){
        res.status(401).json({message:"Unauthorised Person"})
        return
    }
    let {userId,sessionId,role}=jwt.fetchTokenDetails(req.headers.authorization.split(" ")[1])
    const result = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: "civic-portal"
        }
        );
        console.log(userId)
        let data={
            ...req.body,
            userId:userId,
            likes:0,
            status:"PENDING",
            supportedUsers:[],
            image_url:result.secure_url,
            createdAt:Date.now()
        }
    complaintModel.registerComplaint(data,res)
}

let incrementLikes=(req,res)=>{
    let isUser=jwt.verifyUser(req.headers.authorization.split(" ")[1])
    if(!isUser){
        res.status(401).json({message:"Unauthorised Person"})
        return
    }
    let{userId,sessionId,role}=isUser
    complaintModel.incrementLikes(req.params.id,userId,res)
}

let updateComplaint = async (req, res) => {
    let isUser = jwt.verifyUser(req.headers.authorization.split(" ")[1])
    if (!isUser) {
        res.status(401).json({ message: "Unauthorised Person" })
        return
    }

    try {
        let dataToUpdate = { ...req.body }
        
        // If there's a new file, upload to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "civic-portal"
            });
            dataToUpdate.image_url = result.secure_url;
        }

        complaintModel.updateComplaint(req.params.id, dataToUpdate, res)
    } catch (err) {
        console.log(err.stack)
        res.status(400).json({ message: "Update processing error", err: err.stack })
    }
}

let adminUpdateComplaint = async (req, res) => {
    try {
        let isUser = jwt.verifyUser(req.headers.authorization.split(" ")[1])
        if (!isUser || isUser.role !== 'ADMIN') {
            return res.status(401).json({ message: "Unauthorised Person" })
        }

        const allowedStatuses = new Set(['open', 'in-review', 'in-progress', 'resolved', 'closed', 'fake'])
        const { status, adminComment } = req.body
        if (status === undefined && adminComment === undefined) {
            return res.status(400).json({ message: "No admin changes provided" })
        }

        if (status !== undefined && !allowedStatuses.has(String(status).trim().toLowerCase())) {
            return res.status(400).json({ message: "Invalid status provided" })
        }

        complaintModel.adminUpdateComplaint(req.params.id, {
            status: status !== undefined ? String(status).trim().toLowerCase() : undefined,
            adminComment
        }, res)
    } catch (err) {
        console.log(err.stack)
        res.status(400).json({ message: "Update processing error", err: err.stack })
    }
}

let deleteComplaint = async (req, res) => {
    let isUser = jwt.verifyUser(req.headers.authorization.split(" ")[1])
    if (!isUser) {
        res.status(401).json({ message: "Unauthorised Person" })
        return
    }

    try {
        complaintModel.deleteComplaint(req.params.id, res)
    } catch (err) {
        console.log(err.stack)
        res.status(400).json({ message: "Delete processing error", err: err.stack })
    }
}

module.exports={getComplaints,registerComplaint,incrementLikes, updateComplaint, adminUpdateComplaint, deleteComplaint}
