import React, { useState } from 'react'
import * as yup from 'yup'
import { loginAPI } from '../../Features/users/loginAPI';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Features/login/userSlice';
import { useToast } from '../toaster/ToasterContext';
import Spinner from '../spinner/Spinner';



type LoginInputs = {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || ''; // Get email from state if available
    const [isLoading, setIsLoading] = useState(false);
    const {showToast} = useToast();
    const dispatch = useDispatch();

    

    const [LoginUser]= loginAPI.useLoginUserMutation();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInputs>({
        resolver: yupResolver(schema)
    });
    const onSubmit = async (data: LoginInputs) => {
        setIsLoading(true);
        try {
            const response = await LoginUser(data).unwrap();
            dispatch(loginSuccess(response)); // Dispatch login success action
            showToast("Login successful! Redirecting...", "success");
            console.log('Login successful:', response);
          
            setTimeout(() => {
                navigate('/', {
                    state: { email: data.email }
                });
            }, 3000);
        } catch (error) {
            console.error('Login failed:', error);
            showToast("Login failed. Please check your credentials.", "error");
        } finally {
            setIsLoading(false);
        }
    }
    
  return (
     <div>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} >
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  
                    type="email"
                    id="email"
                    {...register('email')}
                 
                 // Make input read-only if email is provided from state
                />
              
                </div>
    
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   
                    placeholder="Enter your password"
                    required
                   
                    type="password"
                    id="password"
                    {...register('password')}

                />
               
                </div>
    
                <div>
                    
              
               {
                isLoading ?(
                    <Spinner />
                ):(
                     <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-400 hover:bg-green-800 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign In
                </button>
                )
               }
                          
                <div>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account? <a href="/signup" className="text-indigo-600 hover:text-indigo-500">Register</a>
                    </p>
                </div>
                </div>
            </form>
            </div>
        </div>
      
    </div>
  )
}

export default Login
