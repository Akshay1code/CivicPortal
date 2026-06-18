let express=require('express')
let complaintController=require('../controllers/complaintController.js')
let router=express.Router()

router.get('/get',complaintController.getComplaints)
router.post('/register',complaintController.registerComplaint)
router.post('/like/:id/:userId',complaintController.incrementLikes)
module.exports=router;