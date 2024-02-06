const {BookingService}=require('../services/index');
const {StatusCodes}=require('http-status-codes')
const bookingservice=new BookingService();


class BookingController{
    constructor(){

    }


    async create(req,res){
        try {
            const response=await bookingservice.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message:'Successfully completed booking',
                success:true,
                error:{},
                data:response
            })
        } catch (error) {
            return res.status(error.statusCodes).json({
                message:error.message,
                success:false,
                error:error.explinations,
                data:{}
            });
        }
    }
}


module.exports=BookingController;
