import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '@core/store/Auth/auth';
import { notification } from 'antd';
import axios from 'axios';
import api from '../../config/axios';

const AuthCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    localStorage.setItem("token", token); // Store token in localStorage
    useEffect(() => {
        // Define a function to call the backend's google-response endpoint
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/Google/google-response`, { withCredentials: true });
                
                const { token, fullName, email, role } = response.data;
                
                // Save the token and user info in Redux
                dispatch(setToken({ token, fullName, email, role }));
                
                // Redirect to the homepage or dashboard after successful login
                navigate("/");

        
             
            } catch (error) {
                console.error("Error during Google login:", error);
                notification.error({
                    message: "Sign in failed",
                    description: "An error occurred during Google login.",
                    duration: 5,
                });
                // Redirect to the login page on error
                navigate("/login");
            }
        };

        // Call the function to fetch user data
        fetchUserData();
    }, [dispatch, navigate]);

    return (
        <div>
            Processing Google login...
        </div>
    );
};

export default AuthCallback;
