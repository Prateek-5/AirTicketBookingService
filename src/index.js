const express=require('express');
const bodyParser=require('body-parser');
const app=express();

const BookingRepository=require('./repository/booking-repo');
const {PORT} =require('./config/serverConfig');

const setupAndStartServer =() =>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));



    app.listen(PORT, async ()=>{
        console.log(`Server started at PORT ${PORT}`);
        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }

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