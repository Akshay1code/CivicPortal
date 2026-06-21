let authModel=require('../models/auth.model.js')
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
    console.log(req.body)
    authModel.isUser(req.body,req.ip,req.headers['user-agent'],res)
}

let getProfile=(req,res)=>{
     console.log("PROFILE HIT");
    authModel.getProfile(req.headers.authorization.split(" ")[1],res)
}

let deleteProfile=(req,res)=>{
    authModel.deleteProfile(req.headers.authorization.split(" ")[1],res)
}

let isRefreshToken=(req,res)=>{
    authModel.isRefreshToken(req,res)
}

let generatetokens=(req,res)=>{
    authModel.generatetokens(req,res)
}
module.exports={addUser,isUser,getProfile,deleteProfile,isRefreshToken,generatetokens}