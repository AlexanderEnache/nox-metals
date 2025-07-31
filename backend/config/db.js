import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.MONGO_URI);

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connection : ${conn.connection.host}`);
    }catch(error)
    {
        console.error("Error Message " + error.message);
        process.exit(1);
    }
}