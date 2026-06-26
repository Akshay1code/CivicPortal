let authController=require('../controllers/auth.controller.js')
let express=require('express')
let auth=express.Router()

auth.post('/signup',authController.addUser)
auth.post('/signin',authController.isUser)
auth.get('/profile',authController.getProfile)
auth.put('/update-details',authController.updateDetails)
auth.delete('/delete',authController.deleteProfile)
auth.get('/is-refresh',authController.isRefreshToken)
auth.get('/refreshtoken',authController.generatetokens)
auth.get('/session-active',authController.checkActiveSession)
auth.get('/logout',authController.logout)
module.exports=auth;
