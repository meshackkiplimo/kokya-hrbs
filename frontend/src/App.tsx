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

function App() {
  const [count, setCount] = useState(0)

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



      </Routes>
      <Footer/>


    </Router>
 </>
  )
}

export default App
