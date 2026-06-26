import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

const AuthGuard = ({ roles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (roles) {
        try {
          const response = await axios.get('https://civicportal.onrender.com/auth/is-refresh', {
            withCredentials: true // To ensure cookies are sent if any
          });
          console.log("ROLES:", roles);
          console.log("API:", response.data);
          if (response.data.status === true && response.data.role === roles[0]) {
            setIsAuthenticated(true);
            return
          }
          else {
            setIsAuthenticated(false)
            navigate('/error', {
              state: { errorMessage: 'Unauthorised Person Detected' },
              replace: true
            });
          }
        }
        catch (err) {
          console.error(err.stack)
        }

      }
      try {
        const response = await axios.get('https://civicportal.onrender.com/auth/is-refresh', {
          withCredentials: true
        });

        if (response.data.status === true) {
          setIsAuthenticated(true);
        }
        else {
          setIsAuthenticated(false)
          navigate('/error', {
            state: { errorMessage: response.data.message || 'Unauthorized Access' },
            replace: true
          });
        }
      }
      catch (error) {
        setIsAuthenticated(false)
        console.error(error.stack)
        navigate('/error', {
          state: { errorMessage: error.response?.data?.message || 'Server error occurred during authentication.' },
          replace: true
        });
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <Loading />
    );
  }

  return <Outlet />;
};

export default AuthGuard;
