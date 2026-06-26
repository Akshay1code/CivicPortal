import { useEffect, useState } from 'react'
import { Routes, BrowserRouter, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import Landing from './pages/Landing'
import LoginPortal from './pages/LoginPortal'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ComplaintPortal from './pages/ComplaintPortal'
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
          <Route path="/admin-dashboard" element={<AdminComplaints />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  let setAccessToken = useAuthStore((state) => state.setAccessToken);
  let refreshTokens=async()=>{
    try{
      let res = await axios.get(`https://civicportal.onrender.com/auth/refreshtoken`,{
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

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const isRefreshRequest = originalRequest?.url?.includes('/auth/refreshtoken');

        if (isUnauthorized && originalRequest && !originalRequest._retry && !isRefreshRequest) {
          originalRequest._retry = true;
          try {
            const refreshed = await axios.get('https://civicportal.onrender.com/auth/refreshtoken', {
              withCredentials: true
            });
            setAccessToken(refreshed.data.accessToken);
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${refreshed.data.accessToken}`
            };
            return axios(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [setAccessToken]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        className="civic-toast-container"
        toastClassName="civic-toast"
        progressClassName="civic-toast-progress"
        bodyClassName="civic-toast-body"
      />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
