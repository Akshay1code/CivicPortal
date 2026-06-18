let express=require('express')
let authController=require('../controllers/authController')
let auth=express.Router()
auth.post('/signup',authController.addUser)
auth.post('/signin',authController.isUser)
auth.get('/profile/:id',authController.getProfile)
auth.delete('/delete/:id',authController.deleteProfile)
module.exports=auth;