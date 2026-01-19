import Sidebar from '@/components/Home/admin/Sidebar'
import Footer from '@/components/shared/Footer'
import NavBar from '@/components/shared/NavBar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50/50'>
      <NavBar />
      <div className='flex flex-1 pt-16'> 
        <Sidebar />
        <main className='flex-1 p-6 lg:p-10 transition-all duration-300'>  
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardLayout