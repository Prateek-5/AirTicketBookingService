const axios =require('axios');

const { BookingRepository} =require('../repository/index');
const {FLIGHT_SERVICE_PATH}=require('../config/serverConfig');
const { SericeError } = require('../utils/errors/index');

class BookingService{
    constructor(){
        //this.bookingrepository=new BookingRepository();
        
    }
    async createBooking(data){
        try {
            console.log("This message is from the service layer");

            const flightId=data.flightId;
            let getFLightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            console.log(getFLightRequestURL)
            const flight=await axios.get(getFLightRequestURL);
            console.log(flight);

            return flight.data;
        } catch (error) {
            throw new SericeError();
            

        }
    }




}

module.exports=BookingService;
