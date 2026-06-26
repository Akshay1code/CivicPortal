let authModel=require('../models/auth.model.js')
let middleware=require('../middlewares/authValidation.js')
let jwt= require("../middlewares/jwt.auth.js")
let session = require('../models/session.model.js')
let addUser=(req,res)=>{
    let {status,message}=middleware.validateUser(req.body)
    if(!status){
        return res.status(404).json({message:message})
    }
    authModel.addUser(req.body,res)
}
let isUser=(req,res)=>{
    authModel.isUser(req.body,req.ip,req.headers['user-agent'],res)
}

let getProfile=(req,res)=>{
    try{
        let isUser=jwt.verifyUser(req.headers.authorization.split(" ")[1])
        authModel.getProfile(req.headers.authorization.split(" ")[1],res)
    }
    catch(err){
        res.status(401).json({message:"Unauthorised Person"})
        return
    }    
}

let deleteProfile=(req,res)=>{
    authModel.deleteProfile(req.headers.authorization.split(" ")[1],res)
}

let updateDetails=(req,res)=>{
    try{
        let isUser=jwt.verifyUser(req.headers.authorization.split(" ")[1])
        if(!isUser){
            return res.status(401).json({message:"Unauthorised Person"})
        }
        let {status,message}=middleware.validateUpdateUser(req.body)
        if(!status){
            return res.status(400).json({message})
        }
        authModel.updateDetails(req.headers.authorization.split(" ")[1],req.body,res)
    }
    catch(err){
        console.log(err.stack)
        res.status(401).json({message:"Unauthorised Person",err:err.stack})
    }
}

let isRefreshToken=(req,res)=>{
    authModel.isRefreshToken(req,res)
}

let generatetokens=(req,res)=>{
    if(!req.cookies.refreshToken){
        return
    }
    authModel.generatetokens(req,res)
}

let checkActiveSession=(req,res)=>{
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        return
    }
    let {userId,sessionId,role}=jwt.fetchTokenDetails(refreshToken)
    
    authModel.checkActiveSession(sessionId,res)
}

let logout=(req,res)=>{
    let {userId,sessionId,role}=jwt.verifyUser(req.cookies.refreshToken)
    if(jwt.deleteTokens(res) && session.deleteSessionId(sessionId)){
        res.status(200).json({status:true})
        return
    }
    res.status(304).json({status:false})
}
    
module.exports={addUser,isUser,getProfile,deleteProfile,updateDetails,isRefreshToken,generatetokens,checkActiveSession,logout}
