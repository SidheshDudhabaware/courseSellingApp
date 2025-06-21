import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils';

const OurCourses = () => {

    const [courses,setCourses]=useState([])
    const [isLoggedIn,setIsLoggedIn]=useState(false)
    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()

    const token=localStorage.getItem("admin");
    console.log(token)

    if(!token) {
        toast.error("Please Log In First")
        navigate("/admin/login")
    }

    useEffect(()=>{
        const fetchCourses=async()=>{
            try {
                const response=await axios.get(`${BACKEND_URL}/course/courses`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    },
                    withCredentials:true
                })
                console.log(response.data.courses);
                setCourses(response.data.courses)
            } catch (error) {
                console.log("Error in fetching courses");
            }
        }
        fetchCourses()
    },[])

    //delete courses code
    const handleDeleteCourse=async(id)=>{
        try {
            const response=await axios.delete(`${BACKEND_URL}/course/delete/${id}`,{
                withCredentials:true
            })
            toast.success("Course Deleted Successfully")
            const updatedCourse=courses.filter((course)=> course.id!==id)
            setCourses(updatedCourse)
        } catch (error) {
            toast.error("Internal Server Error")
        }
    }

  return (
    <div>
      <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-40 w-full object-cover rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="line-through text-gray-500">₹3000</span>
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDeleteCourse(course._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default OurCourses
