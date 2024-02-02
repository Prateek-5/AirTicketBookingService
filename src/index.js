const express=require('express');
const bodyParser=require('body-parser');
const app=express();


const {PORT} =require('./config/serverConfig');

const setupAndStartServer =() =>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));



    app.listen(PORT,()=>{
        console.log(`Server started at PORT ${PORT}`);
        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }
    })
}

setupAndStartServer();