import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
const app=express();
dotenv.config()
import courseRoute from "./routes/course.route.js"
import userRoute from "./routes/user.route.js"
import adminRoute from "./routes/admin.routes.js"
import fileUpload from "express-fileupload";
import {v2 as cloudinary} from "cloudinary"
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config()

const port=process.env.port || 3000
const DB_URI=process.env.MONGO_URI


//middlewares
// console.log("FRONTEND ",process.env.FRONTEND_URL)
app.use(express.json())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
}))

try {
    await mongoose.connect(DB_URI)
    console.log("Connected to MongoDB Database")
} catch (error) {
    console.log(error)
}


// Routes
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin",adminRoute)




//Cloudinary Configuration Code
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})


app.listen(port,()=>{
    console.log(`Server listening on port ${port}`)
})