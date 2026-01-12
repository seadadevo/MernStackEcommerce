import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import { Home } from 'lucide-react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Verify from '@/pages/auth/Verify'
import VerifyEmail from '@/pages/auth/VerifyEmail'

const AppRoutes = () => {
  return (
    <Routes>
        <Route element={<MainLayout/>}>
            <Route path='/' element={<Home/>}/>
        </Route>
        <Route element={<AuthLayout/>}>
            <Route path='/sign-up' element={<SignUp/>}/>
            <Route path='/verify' element={<Verify/>}/>
            <Route path='/verify/:token' element={<VerifyEmail/>}/>
            <Route path='/login' element={<Login/>}/>
        </Route>

        <Route path="*" element={<h1>Not Found</h1>}/>
    </Routes>

  )
}

export default AppRoutes