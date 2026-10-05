import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { addUserData } from '../Utils/redux/userSlice';
import axios from 'axios';
import Loading from './Loading';

const ProtectedRoute = () => {

const userData=useSelector((store) => store.user);
const dispatch = useDispatch();

useEffect(() => {
   axios.get(import.meta.env.VITE_BACKEND_URL+"/api/auth/me", { withCredentials: true })
   .then((res) => {
     console.log("User Data:", res.data);
     // You can update your Redux store with the user data here if needed
     dispatch(addUserData(res.data.data)); // Assuming you have an action to add user data to the store
   })
}, []);



//   const isAuthenticated = false; // Replace with your authentication logic
if(!userData)
{
    return <Loading />;
}

  return <Outlet />;
}; 


export default ProtectedRoute
