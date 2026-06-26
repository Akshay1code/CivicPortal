let express=require('express')
let complaintController=require('../controllers/complaint.controller.js')
const upload = require("../middlewares/upload");
let router=express.Router()

router.get('/get',complaintController.getComplaints)
router.post('/register',upload.single("image"),complaintController.registerComplaint)
router.post('/like/:id',complaintController.incrementLikes)

router.put('/update/:id', upload.single("image"), complaintController.updateComplaint)
router.put('/admins-update/:id', complaintController.adminUpdateComplaint)
router.delete('/delete/:id', complaintController.deleteComplaint)

module.exports=router;
