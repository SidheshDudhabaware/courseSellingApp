import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        // select: false
    }
})

export const Admin=mongoose.model("Admin",adminSchema)