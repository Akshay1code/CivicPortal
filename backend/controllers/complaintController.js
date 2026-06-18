let complaintModel=require('../models/complaintModel.js')
let getComplaints=(req,res)=>{
    complaintModel.getComplaints(res);
}

let registerComplaint=(req,res)=>{
    complaintModel.registerComplaint(req.body,res)
}

let incrementLikes=(req,res)=>{
    complaintModel.incrementLikes(req.params.id,req.params.userId,res)
}
module.exports={getComplaints,registerComplaint,incrementLikes}