//create server
import express from 'express'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import cors from 'cors';

dotenv.config();
const app=express();

const PORT=process.env.PORT || 3000;


//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
const corsOptions={
    origin:'http://localhost:5173',
    credential: true
}
app.use(cors(corsOptions));

//api
app.get('/home', (req,res)=>{
    return res.status(200).json({
        message:'Hey ',
        success: true
    })
})
app.listen(()=>{
    connectDB();
    console.log(`server is running at port ${PORT}`)
})




