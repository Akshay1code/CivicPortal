let express=require('express')
let complaintController=require('../controllers/complaint.controller.js')
let router=express.Router()

router.get('/get',complaintController.getComplaints)
router.post('/register',complaintController.registerComplaint)
router.post('/like/:id',complaintController.incrementLikes)

module.exports=router;