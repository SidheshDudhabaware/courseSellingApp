import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login'
import Signup from '../components/Signup'
import {Toaster} from 'react-hot-toast'
import Courses from '../components/Courses'
import Buy from '../components/Buy'
import Purchases from '../components/Purchases'
import AdminSignUp from './admin/AdminSignUp'
import AdminLogin from './admin/AdminLogin'
import DashBoard from './admin/DashBoard'
import CourseCreate from './admin/CourseCreate'
import UpdateCourse from './admin/UpdateCourse'
import OurCourses from './admin/OurCourses'
const App = () => {

  const user=localStorage.getItem("user")
  const admin=localStorage.getItem("admin")

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />

        <Route path='/courses' element={<Courses/>} />
        <Route path='/buy/:courseId' element={<Buy/>} />
        <Route path='/purchases' element={user? <Purchases/> : <Navigate to={"/login"} /> } />

        {/* Admin Routes */}
        <Route path='/admin/signup' element={<AdminSignUp/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/admin/dashboard' element={admin ? <DashBoard/> : <Navigate to={"/admin/login"}/> } />
        <Route path='/admin/create-course' element={<CourseCreate/>} />
        <Route path='/admin/update-course/:id' element={<UpdateCourse/>} />
        <Route path='/admin/our-courses' element={<OurCourses/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
