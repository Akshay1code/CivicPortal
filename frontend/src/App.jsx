import { useState } from 'react'
import { Routes, BrowserRouter, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Landing from './pages/Landing'
import LoginPortal from './pages/LoginPortal'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ComplaintPortal from './pages/ComplaintPortal'
import AdminDashboard from './pages/AdminDashboard'
import AdminComplaints from './pages/AdminComplaints'
import Profile from './pages/Profile'
import { toast, ToastContainer } from 'react-toastify'

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPortal />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complaint-portal" element={<ComplaintPortal />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-complaints" element={<AdminComplaints />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
