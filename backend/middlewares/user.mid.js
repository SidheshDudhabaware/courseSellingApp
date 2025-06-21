import jwt from "jsonwebtoken"
import config from "../config.js";

export const userMiddleware=async(req,res,next)=>{
    // const authHeader=req.headers.authorization
    // if(!authHeader) {
    //     return res.status(401).json({error:"No token Provided"})
    // }
    // const token=authHeader.split(" ")[1];
    // console.log(token)
    const token=req.cookies.jwt;
    try {
        const decoded=jwt.verify(token,"user123")
        req.userId=decoded.id
        next()
    } catch (error) {
        return res.status(401).json({error:"Invalid Token or expired"})
        console.log("Invalid Token")
    }
}