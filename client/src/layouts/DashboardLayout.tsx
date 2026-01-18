import Footer from '@/components/shared/Footer'
import NavBar from '@/components/shared/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className=''>
        <NavBar/>
        <main className='px-4 flex flex-col min-h-screen pt-20 '>
        <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default DashboardLayout