import React from 'react'
import * as yup from 'yup';


type RegisterInputs = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  
}
const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),

})
const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and start your journey
          </p>
        </div>
       
        
        <form className="mt-8 space-y-6" >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="text"
            
                placeholder="First Name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              
            </div>

            <div>
              <input 
                type="text"
             
                placeholder="Last Name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              
            
            </div>

            <div>
              <input
                type="email"
            
                placeholder="Email address"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
            
            </div>

            <div>
              <input
                type="password"
                
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              
            </div>

           
          </div>
         
          <div>
           
           
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-950  hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-amber-800"
            >
              Sign up
            </button>
           
            <div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account? 
                <a href="/login" className="text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </form>
        
      </div>
    </div>
  )
}

export default Register
