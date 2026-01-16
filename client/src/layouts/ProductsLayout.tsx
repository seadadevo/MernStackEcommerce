import Footer from '@/components/shared/Footer'
import NavBar from '@/components/shared/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const ProductsLayout = () => {
  return (
    <div className=' '>
         <NavBar/>
        <main className='flex-1 max-w-7xl mx-auto w-full px-4 pt-20 pb-8'> 
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default ProductsLayout