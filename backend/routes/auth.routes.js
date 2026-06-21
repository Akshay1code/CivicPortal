let authController=require('../controllers/auth.controller.js')
let express=require('express')
let auth=express.Router()

auth.post('/signup',authController.addUser)
auth.post('/signin',authController.isUser)
auth.get('/profile',authController.getProfile)
auth.delete('/delete',authController.deleteProfile)
auth.get('/is-refresh',authController.isRefreshToken)
auth.get('/refreshtoken',authController.generatetokens)

module.exports=auth;