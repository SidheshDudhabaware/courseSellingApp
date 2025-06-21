import React, { useEffect, useState } from 'react'
import logo from "../public/logo.webp"
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa"
import { FaTwitter } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import axios from "axios"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../src/utils'
function Home() {

    const [courses,setCourses]=useState([])
    const [isLoggedIn,setIsLoggedIn]=useState(false)

    useEffect(()=>{
        const token=localStorage.getItem("user")
        if(token) {
            setIsLoggedIn(true)
        }else {
            setIsLoggedIn(false)
        }
    },[])

    const handleLogOut=async()=>{
        try {
            const response=await axios.get(`${BACKEND_URL}/user/logout`,{
                withCredentials:true
            })
            toast.success(response.data.message)
            setIsLoggedIn(false)
        } catch (error) {
            console.log("Error in logging Out ",error)
            toast.error("Error in logging Out")
        }
    }
    
    console.log("Courses: ",courses)
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`,{
                    withCredentials:true
                })
                console.log(response.data.courses)
                setCourses(response.data.courses)
            } catch (error) {
                console.log("Error in fetch Courses ", error)
            }
        }
        fetchCourses()
    }, [])

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        autoplay:true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return (
        <div className='bg-gradient-to-r from-black to-blue-950 min-h-screen' >
            <div className='min-h-screen text-white px-32' >
                {/* Header */}
                <header className='flex items-center justify-between container mx-auto p-6' >
                    <div className='flex items-center space-x-2' >
                        <img src={logo} alt="" className='w-10 h-10 rounded-full ' />
                        <h1 className='text-2xl text-orange-500 font-bold' >LearnHaven</h1>
                    </div>
                    <div className='space-x-4' >

                        {isLoggedIn ? (<button onClick={handleLogOut} to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Logout</button>) : (
                            <>
                                <Link to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Login</Link>
                                <Link to={"/signup"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Signup</Link>
                            </>
                        )}


                        
                    </div>
                </header>

                {/* Main Section */}
                <section className='text-center py-20' >
                    <h1 className='text-4xl font-semibold text-orange-500' >LearnHaven</h1>
                    <br />
                    <p className='text-gray-500' >Sharpen your skills with courses crafted by experts</p>
                    <div className='space-x-2 mt-8' >
                        <Link to={"/courses"} className='bg-green-500 py-3 px-6 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black' >Explore Courses</Link>
                        <Link to={"/"} className='bg-white py-3 px-6 text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-white' >Courses Video</Link>
                    </div>
                </section>



                <section className="">
                    <Slider {...settings}>
                        {courses.map((course) => (
                        <div key={course._id} className="p-4">
                            <div className="relative w-full max-w-xs mx-auto h-[350px] flex flex-col justify-between rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 bg-gradient-to-r from-black to-blue-950">
                            
                            <div className="h-[160px] bg-gray-800 flex items-center justify-center">
                                <img
                                className="h-28 object-contain"
                                src={course?.image?.url}
                                alt={course.title}
                                />
                            </div>
                            
                            <div className="p-4 text-white flex flex-col justify-between flex-grow">
                                <h2 className="text-lg font-semibold mb-2 text-center">{course.title}</h2>
                                <div className="mt-auto">
                                <p className="text-md font-bold text-yellow-400 mb-4 text-center">₹{course.price}</p>
                                <button className="w-full py-2 px-4 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors">
                                    Enroll Now
                                </button>
                                </div>
                            </div>

                            </div>
                        </div>
                        ))}
                    </Slider>
                    </section>





                <hr />
                {/* Footer */}
                <footer className='mt-8' >
                    <div className='grid grid-cols-1 md:grid-cols-3' >
                        <div className='flex flex-col items-center md:items-start' >
                            <div className='flex items-center space-x-2' >
                                <img src={logo} alt="" className='w-10 h-10 rounded-full ' />
                                <h1 className='text-2xl text-orange-500 font-bold' >LearnHaven</h1>
                            </div>
                            <div className='mt-3 ml-2 md:ml-8 ' >
                                <p className='mb-2 ' >Follow us</p>
                                <div className='flex space-x-4' >
                                    <a href=""><FaFacebook className=' text-2xl hover:text-blue-600 duration-300 ' /></a>
                                    <a href=""><FaTwitter className=' text-2xl hover:text-blue-600 duration-300 ' /></a>
                                    <a href=""><FaInstagram className=' text-2xl hover:text-blue-600 duration-300 ' /></a>
                                </div>
                            </div>
                        </div>


                        <div className='items-center flex flex-col ' >
                            <h3 className='text-lg font-semibold mb-4' >connects</h3>
                            <ul className='space-y-2 text-gray-400 ' >
                                <li className='hover:text-white cursor-pointer duration-300 ' >youtube</li>
                                <li className='hover:text-white cursor-pointer duration-300 ' >telegram</li>
                                <li className='hover:text-white cursor-pointer duration-300 ' >GitHub</li>
                            </ul>
                        </div>



                        <div className='items-center flex flex-col ' >
                            <h3 className='text-lg font-semibold mb-4' >copyrights &#169; 2025</h3>
                            <ul className='space-y-2 text-gray-400 ' >
                                <li className='hover:text-white cursor-pointer duration-300 ' >Terms & Conditions</li>
                                <li className='hover:text-white cursor-pointer duration-300 ' >Privacy Policy</li>
                                <li className='hover:text-white cursor-pointer duration-300 ' >Refund & Cancellation</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home
