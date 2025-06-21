import jwt from "jsonwebtoken"

export const adminMiddleware=async(req,res,next)=>{
    // const authHeader=req.headers.authorization
    // if(!authHeader) {
    //     return res.status(401).json({error:"No token Provided"})
    // }
    // const token=authHeader.split(" ")[1];
    // console.log(token)
    const token=req.cookies.jwt;
    console.log("token",token)
    try {
        const decoded=jwt.verify(token,"admin123")
        req.adminId=decoded.id
        
        next()
    } catch (error) {
        return res.status(401).json({error:"Invalid Token or expired"})
        console.log("Invalid Token")
    }
}

export default adminMiddleware