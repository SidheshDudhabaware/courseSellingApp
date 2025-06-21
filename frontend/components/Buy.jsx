import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { BACKEND_URL } from '../src/utils'
const Buy = () => {
    const {courseId}=useParams()
    console.log("Course Id: ",courseId)
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const token=localStorage.getItem("user")
    // const token=user.token
    console.log("token: ",token)
    const handlePurchase=async()=>{
        if(!token) {
            toast.error("Please Log In to Purchase the Courses")
            return
        }

        try {
            setLoading(true);
            const response=await axios.post(`${BACKEND_URL}/course/buy/${courseId}`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                },
                withCredentials:true
            })
            toast.success("Course Purchased Successfully")
            navigate("/purchases")
            setLoading(false)
        } catch (error) {
            setLoading(false)
            // if(error.response?.status===400) {
            //     toast.error("You have already Purchased the course")
            // }else {
            //     toast.error(error?.response?.data?.errors)
            // }
            toast.error("You have already Purchased the course Or Internal Server Error")
        }
    }

return (
  <div className="flex h-screen items-center justify-center bg-gradient-to-r from-black to-blue-950">
    <button
      className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden text-white font-semibold transition duration-300 ease-out border border-blue-700 rounded-xl shadow-lg group disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950"
      onClick={handlePurchase}
      disabled={loading}
    >
      <span className="absolute inset-0 transition duration-300 ease-in-out bg-white opacity-0 group-hover:opacity-10" />
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <span className="relative z-10">🚀 Buy Now</span>
      )}
    </button>
  </div>
);


}

export default Buy
