import NavBar from '@/components/shared/NavBar'
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