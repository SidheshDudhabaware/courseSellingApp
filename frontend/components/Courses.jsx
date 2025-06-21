import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser, FaDiscourse, FaDownload } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../public/logo.webp";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../src/utils";
function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md w-64 p-6 z-40 fixed md:static top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center mb-10">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full mr-3" />
          <span className="text-xl font-bold text-gray-800">CourseHub</span>
        </div>
        <nav>
          <ul className="space-y-5 text-gray-700">
            <li>
              <Link to="/" className="flex items-center hover:text-blue-600">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center text-blue-600 font-medium">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="flex items-center hover:text-blue-600">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center hover:text-blue-600">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center hover:text-blue-600">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white px-6 py-8 ml-0">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 w-full md:w-64 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center bg-gray-100">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
            <FaCircleUser className="text-3xl text-blue-600" />
          </div>
        </header>

        {/* Courses Grid */}
        <section className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">No course posted yet by admin.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="rounded mb-4 h-40 w-full object-cover"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl text-blue-700">₹{course.price}</span>
                    <span className="text-green-600 text-sm">20% off</span>
                  </div>
                  <Link
                    to={`/buy/${course._id}`}
                    className="bg-orange-500 w-full text-white px-4 py-2  rounded-lg block text-center hover:bg-blue-900 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-3xl text-gray-700"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>
    </div>
  );
}

export default Courses;
