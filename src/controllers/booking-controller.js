const {BookingService}=require('../services/index');
const {StatusCodes}=require('http-status-codes')
const {createChannel,publishMessage}=require('../utils/messageQueue')
const { REMINDER_BINDING_KEY} =require('../config/serverConfig')

const bookingservice=new BookingService();
class BookingController{
    constructor(){
        

    }
    async sendMessageToQueue(req,res){
        
        const channel=await createChannel();
        const data={message: 'Success'};

        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        return res.status(200).json({
            message:'Successfully published the event'
        })
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
