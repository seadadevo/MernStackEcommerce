import NavBar from '@/components/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
        <NavBar/>
        <main className='container mx-auto px-4'>
            <Outlet/>
        </main>
    </>
  )
}

export default MainLayout