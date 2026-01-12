import NavBar from '@/components/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
        <NavBar/>
        <main className=' px-4  bg-pink-200'>
            <Outlet/>
        </main>
    </>
  )
}

export default AuthLayout