import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const MONGO_URI = process.env.MONGO_URI !
const connectionDatabase = async()=>{
try {
  await mongoose.connect(MONGO_URI, {
   serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if the server is not available
   socketTimeoutMS: 45000, // Set socket timeout to 45 seconds
   connectTimeoutMS: 10000, // Set connection timeout to 10 seconds
  });
  console.log("Database connected successfully");
  
} catch (error) {
  console.error("Database connection error:", error);
  process.exit(1); // Exit the process if the connection fails
}
}
export default connectionDatabase;