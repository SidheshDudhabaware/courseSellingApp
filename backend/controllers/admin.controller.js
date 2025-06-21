import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js"
import bcrypt from "bcryptjs"

export const signup=async(req,res)=>{
    const {firstName,lastName,email,password}=req.body

    try {
        const existingAdmin=await Admin.findOne({email:email})
        if(existingAdmin) {
            return res.status(400).json({errors:"Admin already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newAdmin={
            firstName,lastName,email,password:hashedPassword
        }
        const admin=await Admin.create(newAdmin)
        res.status(201).json({
            message: "Sign Up Successful",
            admin
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
        const admin=await Admin.findOne({email:email})
        const isPasswordCorrect=await bcrypt.compare(password,admin.password)
        if(!admin || !isPasswordCorrect) {
            return res.status(403).json({
                errors: "Invalid credentials"
            })
        }

        //jwt code
        const token=jwt.sign({
            id:admin._id
            },"admin123",{expiresIn:"1d"}
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
            admin,
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
        if(!req.cookies.jwt) {
            return res.status(401).json({errors: "Login First"})
        }
        res.clearCookie("jwt");
        res.status(200).json({message:"Logged Out successfully"})
    } catch (error) {
        res.status(500).json({errors: "Error in logout"})
        console.log("Error in logout ",error)
    }
}