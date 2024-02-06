const express =require('express');

const {BookingController}=require('../../controllers/index');

const bookingcontroller=new BookingController();
const router = express.Router();

router.post('/bookings',bookingcontroller.create);



module.exports=router;
   