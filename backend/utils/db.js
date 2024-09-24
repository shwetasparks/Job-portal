//donnect database

import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

// connection to a MongoDB database using Mongoose

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("error conecting mongodb",error);
    }
}
export default connectDB;
