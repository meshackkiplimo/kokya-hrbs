import React from 'react'
import * as yup from 'yup'



type LoginInputs = {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Login = () => {
  return (
     <div>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
                </h2>
            </div>
            <form className="mt-8 space-y-6" >
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                  
                    type="email"
                    id="email"
                 
                 // Make input read-only if email is provided from state
                />
              
                </div>
    
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                   
                    type="password"
                    id="password"

                />
               
                </div>
    
                <div>
                    
              
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-400 hover:bg-green-800 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign In
                </button>
                          
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
