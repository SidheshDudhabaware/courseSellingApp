import { Course } from "../models/course.model.js"
import {v2 as cloudinary} from "cloudinary"
import { Purchase } from "../models/purchase.model.js"

export const createCourse=async(req,res)=>{
    const {title,description,price}=req.body
    const adminId=req.adminId
    try {

        
        if(!title || !description || !price) {
            return res.status(400).json({
                errors:"All field are required"
            })
        }

        const {image}=req.files
        if(!req.files || Object.keys(req.files).length===0) {
            return res.status(400).json({
                errors:"No image Uploaded"
            })
        }

        const allowedFormats=["image/png","image/jpeg","image/jpg"]
        
        if(!allowedFormats.includes(image.mimetype)) {
            return res.status(400).json({
                errors:"Invalid file format"
            })
        }

        //Cloudinary Upload
        const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloud_response || cloud_response.error) {
            return res.status(400).json({errors:"Error File Uploading to Cloudinary"})
        }
        
        const courseData={
            title,description,price,image:{
                public_id:cloud_response.public_id,
                url:cloud_response.secure_url
            },
            creatorId:adminId
        }

        const course=await Course.create(courseData)
        res.json({
            message:"Course created successfully",
            course
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error while creating course"})
    }

}

export const updateCourse=async(req,res)=>{
    const {courseId}=req.params
    const adminId=req.adminId
    const {title,description,price,image}=req.body
    try {
        const courseSearch=await Course.findById(courseId)
        if(!courseSearch) {
            return res.status(404).json({errors: "Course not found"})
        }
        const course=await Course.updateOne({
            _id:courseId,
            creatorId:adminId
        },{
            title,
            description,
            price,
            image: {
                public_id:image?.public_id,
                url:image?.url
            }
        })
        res.status(201).json({message:"Course updated successfully",course})
    } catch (error) {
        res.status(500).json({error:"Error in course updation"})
        console.log("Error in course updation ",error)
    }
}

export const deleteCourse=async(req,res)=>{
    const {courseId}=req.params
    const adminId=req.adminId
    try {
        const course=await Course.findOneAndDelete({
            _id:courseId,
            creatorId:adminId
        })
        if(!course) {
            return res.status(404).json({error:"Course Not Found"})
        }
        return res.status(200).json({message:"Course Deleted Successfully"})
    } catch (error) {
        return res.status(404).json({errors:"Error in course Deletion"})
        console.log("Error in course Deletion ",error)
    }
}

export const getCourses=async(req,res)=>{
    try {
        const courses=await Course.find()
        res.status(201).json({courses})
    } catch (error) {
        res.status(500).json({errors: "Error in getting all the courses"})
        console.log("Error getting All Courses ",error)
    }
}

export const courseDetails=async(req,res)=>{
    const {courseId}=req.params
    try {
        const course=await Course.findById(courseId)
        if(!course) {
            res.status(401).json({errors: "Course not found"})
        }
        res.status(201).json({course})
    } catch (error) {
        res.status(500).json({errors: "Error in getting the course"})
        console.log("Error while getting Course ",error)
    }
}

export const buyCourse=async(req,res)=>{
    const {userId}=req
    const {courseId}=req.params

    try {
        const course=await Course.findById(courseId)
        if(!course) {
            res.status(404).json({error: "No course found"})
        }
        const existingPurchase=await Purchase.findOne({userId,courseId})
        if(existingPurchase) {
            res.status(404).json({error: "Course is already purchased"})
        }
        const newPurchase={
            userId,
            courseId
        }
        await Purchase.create(newPurchase)
        res.status(201).json({message:"Course purchased successfully",newPurchase})
    } catch (error) {
        res.status(500).json({error: "Error in buying course"})
        console.log("Error in course buying ",error)
    }
}