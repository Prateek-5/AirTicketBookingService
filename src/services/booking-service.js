const axios =require('axios');

const { BookingRepository} =require('../repository/index');
const {FLIGHT_SERVICE_PATH,REMINDER_BINDING_KEY}=require('../config/serverConfig');
const { SericeError } = require('../utils/errors/index');
const ServiceError = require('../utils/errors/service-error');
const {publishMessage,createChannel}=require('../utils/messageQueue');
const { DATE } = require('sequelize');
const {StatusCodes}=require('http-status-codes')


class BookingService{
    constructor(){
        this.bookingrepository=new BookingRepository();
        
        
    }
    async createBooking(data){
        try {
            console.log("This message is from the service layer");

            const flightId=data.flightId;
            //communicate between 2 services

            const getFLightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            //console.log(getFLightRequestURL)
            const flight=await axios.get(getFLightRequestURL);
            console.log(flight.data.data.flight);

            let flightData=flight.data.data.flight;
            let priceOfTheFLight=flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process','Insufficient seats in the flight');

            }
            const totalCost= priceOfTheFLight * data.noOfSeats;
            const bookingPayload={...data,totalCost};
            console.log(bookingPayload);
            const booking=await this.bookingrepository.create(bookingPayload);
            const updatedFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            console.log(updatedFlightRequestURL);

            await axios.patch(updatedFlightRequestURL,{totalSeats: flightData.totalSeats-booking.noOfSeats});
            const finalBooking = await this.bookingrepository.update(booking.id, {status: "Booked"});
            const channel=await createChannel();
           
            const data1={
                subject:`Booking confirmed for userId ${finalBooking.id}`,
                content:`The booking amounts for total ${finalBooking.totalCost}`,
                recepientEmail:"narayansingh@gamil.com",
                notificationTime:new Date(),
                service:"CREATE_TICKET"
            };
    
            publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data1));
            console.log("Hi this is fromt he senMessagetoQueue service");
            
            
            
            return finalBooking;
        } catch (error) {

            if(error.name == 'RepositoryError' || 'SequelizeValidationError'){
                throw error;
            }
            console.log(error);

            throw new SericeError();
            

        }
    }




}

module.exports=BookingService;
