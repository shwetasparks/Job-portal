import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({})





const app=express();




//middlware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());



//api
app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"hello world",
        success:true
    })
})

const corsOptions={
    origin:'http//localhost:5173',
    credentials:true
}

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    connectDB()
    console.log(`port is running at ${PORT}`);


})
