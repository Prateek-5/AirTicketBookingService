const express=require('express');
const bodyParser=require('body-parser');
const app=express();

const BookingRepository=require('./repository/booking-repo');
const {PORT,FLIGHT_SERVICE_PATH} =require('./config/serverConfig');
const db=require('./models/index');
const apiRoutes=require('./routes/index');

const setupAndStartServer =() =>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/api',apiRoutes)


    app.listen(PORT, async ()=>{
        console.log(`Server started at PORT ${PORT}`);
        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }
        //console.log("This is a test update");
        //console.log(FLIGHT_SERVICE_PATH,'this is the flight service path');
        // const booking=new BookingRepository();
        // const responce=await booking.create({
        //     id:2,
        //     flightId:2,
        //     userId:3,
        // });
        // console.log(responce);



    })
}

setupAndStartServer();