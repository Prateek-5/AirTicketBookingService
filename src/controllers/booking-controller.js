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
        const data={
            subject:"Ticket 4",
            content:"Content 4",
            recepientEmail:"This is th receipent email",
            notificationTime:"2024-02-06T06:20:35.000Z",
            service:"CREATE_TICKET"
        };

        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        console.log("Hi this is fromt he senMessagetoQueue service");

        return res.status(200).json({
            subject:"Ticket 4",
            content:"Content 4",
            recepientEmail:"This is th receipent email",
            notificationTime:"2024-02-06T06:20:35.000Z",
            service:"CREATE_TICKET"
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
