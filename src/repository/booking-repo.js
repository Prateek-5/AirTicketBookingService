const {Booking}=require('../models/index');
const {StatusCodes}=require('http-status-codes')

const {ValidationError,ServiceError, AppError}=require('../utils/errors/index');

class BookingRepository{

    async create(data){
        try {
            console.log(data);
            const booking=await Booking.create(data);
            return booking;

        } catch (error) {
            console.log('Something went wrong in the book repos');
            if(error.name=='SequelizeValidationError'){
                throw new ValidationError(error);
            }
            

            else{
                throw new AppError(
                'RepositoryError', 
                'Cannot create Booking', 
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);  
            }
        }
    }
    async update(bookingId, data) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status) {
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError', 
                'Cannot update Booking', 
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
            
    }    




module.exports=BookingRepository;

