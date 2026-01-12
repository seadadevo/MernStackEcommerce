import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Verify from '@/pages/auth/Verify'
import VerifyEmail from '@/pages/auth/VerifyEmail'
import Home from '@/pages/Home/Home'
import Profile from '@/pages/Home/Profile'

const AppRoutes = () => {
  return (
    <Routes>
        <Route element={<MainLayout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/profile' element={<Profile/>}/>
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