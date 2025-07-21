import React from 'react'
import * as yub from 'yup';
import { UserApi } from '../../Features/users/userAPI';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';

type VerifyInputs ={
    email: string;
    code: string;
}

const schema= yub.object({
    email: yub.string().email().required(),
    code: yub.string().required(),
})

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [verifyUser]= UserApi.useVerifyUserMutation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    }=useForm<VerifyInputs>({
        resolver:yupResolver(schema)
    })

    const onSubmit:SubmitHandler<VerifyInputs> =async (data) => {
        try {
            const response = await verifyUser(data).unwrap();
           console.log('Verification successful:', response);

           setTimeout(()=>{
            navigate('/login',{state:{email:data.email}})
           })
            
        } catch (error) {
            console.error('Verification failed:', error);
            
        }
        
    }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-8'>
            <h1>verify your account</h1>
            <form onSubmit={handleSubmit(onSubmit)} >
                <input 
                className='mt-4 mb-2 border border-gray-300 p-2 rounded w-full '
                type="email" 
                {...register('email')}
               
                name="email" 
                placeholder="Enter your email" 
                required 
                readOnly
                
                value={emailFromState}
                 />
              
                <input
                className='mt-4 mb-2 border border-gray-300 p-2 rounded w-full '
                type="text"
                {...register('code')}
             
                name="code"
                placeholder="Enter verification code"
                required
                />
              
                <button 
                
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                    disabled={isSubmitting}
                >
                    Verify
                    
                    </button>
               
            </form>
        </div>

      
    
  )
}

export default Verify
