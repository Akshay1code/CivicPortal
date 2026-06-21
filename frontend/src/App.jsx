import { useEffect, useState } from 'react'
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
import ErrorPage from './pages/ErrorPage'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import useAuthStore from './store/auth.token';
import AuthGuard from './components/AuthGuard';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/*yaha pe authGuard aayega */ }
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPortal />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/error' element={<ErrorPage/>}/>
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/complaint-portal" element={<ComplaintPortal />} />
        </Route>
        <Route element={<AuthGuard roles={['ADMIN']}/>}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-complaints" element={<AdminComplaints />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  let setAccessToken = useAuthStore((state) => state.setAccessToken);
  let refreshTokens=async()=>{
    try{
      let res = await axios.get(`http://localhost:3000/auth/refreshtoken`,{
          withCredentials: true
        })
      setAccessToken(res.data.accessToken);
    }
    catch(err){
      console.log(err.stack);
    }
  }
  useEffect(()=>{
    refreshTokens()
  },[])
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
