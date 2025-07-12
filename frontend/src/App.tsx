import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Footer from './components/Footer'
import RegisterPage from './pages/RegisterPage'
import Login from './components/auth/Login'
import Verify from './components/auth/Verify'
import AdminDashboard from './dashboard/adminDashboard/AdminDashboard'
import ManageUsers from './dashboard/adminDashboard/users/ManageUsers'
import ManageBookings from './dashboard/adminDashboard/bookings/ManageBookings'
import ManagePayment from './dashboard/adminDashboard/payments/ManagePayment'

function App() {
  

  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
          <Route path="/" element={<Hero />} />
           <Route path="/about" element={<AboutPage />} />
               <Route path="/contact" element={<ContactPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                       <Route path="/login" element={<Login />} />
                            <Route path="/verify" element={<Verify />} />
                           <Route path="/admin-dashboard" element={<AdminDashboard />  }>
                 
                 
              <Route path="users" element={<ManageUsers />} />
                <Route path="bookings" element={<ManageBookings />} />
                   <Route path="payments" element={<ManagePayment />} />
          
            </Route>


      </Routes>
      <Footer/>


    </Router>
 </>
  )
}

export default App
