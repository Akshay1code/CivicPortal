let jwt=require('../middlewares/jwt.auth.js')
let complaintModel=require('../models/complaint.model.js')
let getComplaints=(req,res)=>{
    complaintModel.getComplaints(res);
}

let registerComplaint=(req,res)=>{
    complaintModel.registerComplaint(req.body,res)
}

let incrementLikes=(req,res)=>{
    let{userId,sessionId,role}=jwt.fetchTokenDetails(req.headers.authorization.split(" ")[1])
    complaintModel.incrementLikes(req.params.id,userId,res)
}

module.exports={getComplaints,registerComplaint,incrementLikes}