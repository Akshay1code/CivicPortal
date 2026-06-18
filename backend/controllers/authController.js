let authModel=require('../models/authModel.js')
let middleware=require('../middlewares/authValidation.js')
let addUser=(req,res)=>{
    console.log(req.body)
    let {status,message}=middleware.validateUser(req.body)
    if(!status){
        return res.status(404).json({message:message})
    }
    authModel.addUser(req.body,res)
}
let isUser=(req,res)=>{
    authModel.isUser(req.body,res)
}

let getProfile=(req,res)=>{
    authModel.getProfile(req.params.id,res)
}

let deleteProfile=(req,res)=>{
    authModel.deleteProfile(req.params.id,res)
}

    module.exports={addUser,isUser,getProfile,deleteProfile}