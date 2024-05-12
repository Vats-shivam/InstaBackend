import mongoose from "mongoose";

export const connectDB = (MONGO_URL)=>{
    console.log(MONGO_URL);
    mongoose.connect(MONGO_URL)
.then(console.log("DB Connected Succesfully...."))
.catch((err)=>{
    console.log("DB Connection Failed!")
    console.log(err)
    process.exit(1)
});}

export default connectDB;
