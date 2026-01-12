import React from 'react'

const Verify = () => {
  return (
    <div className='p-2 border '>
        <div className='flex items-center justify-center min-h-screen  '>
            <div className='rounded-md shadow-md p-6 max-w-md w-full bg-white'>
                <h2 className='text-center text-2xl font-medium text-green-500 mb-4'>✅ Verify Your Account</h2>
                <p className='text-center text-gray-700'>We have sent a verification link to your email. Please check your inbox and follow the instructions to verify your account.</p>
            </div>
        </div>
    </div>
  )
}

export default Verify