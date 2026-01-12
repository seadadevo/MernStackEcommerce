
import NavBar from '@/components/shared/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
        <NavBar/>
        <main className=''>
            <Outlet/>
        </main>
    </>
  )
}

export default MainLayout