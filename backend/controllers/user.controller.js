import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../config.js"
import dotenv from "dotenv"
import { Purchase } from "../models/purchase.model.js"
import { Course } from "../models/course.model.js"
dotenv.config()
export const signup=async(req,res)=>{
    const {firstName,lastName,email,password}=req.body

    try {
        const existingUser=await User.findOne({email:email})
        if(existingUser) {
            return res.status(400).json({errors:"User already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser={
            firstName,lastName,email,password:hashedPassword
        }
        const user=await User.create(newUser)
        res.status(201).json({
            message: "Sign Up Successful",
            user
        })
    } catch (error) {
        res.status(500).json({
            error: "Error in signup"
        })
        console.log("Error Sign Up ",error)
    }
}

// process env check
export const login=async(req,res)=>{
    const {email,password}=req.body

    try {
        const user=await User.findOne({email:email})
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!user || !isPasswordCorrect) {
            return res.status(403).json({
                errors: "Invalid credentials"
            })
        }

        //jwt code
        const token=jwt.sign({
            id:user._id
            },"user123",{expiresIn:"1d"}
        )

        const cookieOptions={
            expires: new Date(Date.now()+24*60*60*1000),
            httpOnly: true,
            secure: process.env.NODE_ENV==="production",
            sameSite:"Strict"
        }

        res.cookie("jwt",token,cookieOptions)
        res.status(201).json({
            message: "Login Successful",
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            error: "Error in login"
        })
        console.log("Error in login ",error);
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie("jwt");
        res.status(200).json({message:"Logged Out successfully"})
    } catch (error) {
        res.status(500).json({errors: "Error in logout"})
        console.log("Error in logout ",error)
    }
}

export const purchases=async(req,res)=>{
    const userId=req.userId
    try {
        const purchased=await Purchase.find({userId:userId})

        let purchasedCourseId=[]

        for(let i=0;i<purchased.length;i++) {
            purchasedCourseId.push(purchased[i].courseId)

        }
        const courseData=await Course.find(
            {
                _id:{$in:purchasedCourseId}
            }
        )

        res.status(200).json({purchased,courseData})
    } catch (error) {
        res.status(500).json({errors: "Error in purchase"})
        console.log("Error in purchase ",error)
    }
}