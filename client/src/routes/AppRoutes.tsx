import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Verify from '@/pages/auth/Verify'
import VerifyEmail from '@/pages/auth/VerifyEmail'
import Home from '@/pages/Home/Home'
import Profile from '@/pages/Home/Profile'
import Products from '@/pages/Products/Products'
import ProductsLayout from '@/layouts/ProductsLayout'
import Cart from '@/pages/Cart'
import DashboardLayout from '@/layouts/DashboardLayout'
import DashboardOverview from '@/pages/dashboard/DashboardOverview'
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
        <Route element={<MainLayout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/profile/:userId' element={<Profile/>}/>
        </Route>
        <Route element={<ProductsLayout/>}>
            <Route path='/products' element={<Products/>}/>
            <Route path='/cart' element={<Cart/>}/>
        </Route>
        <Route element={<AuthLayout/>}>
            <Route path='/sign-up' element={<SignUp/>}/>
            <Route path='/verify' element={<Verify/>}/>
            <Route path='/verify/:token' element={<VerifyEmail/>}/>
            <Route path='/login' element={<Login/>}/>
        </Route>
        
        {/* Dashboard */}

        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
          <Route path='dashboard' element={<DashboardLayout/>}>
            <Route index element={<DashboardOverview/>}/>
            <Route path='products' element={<h1>hello to products</h1>}/>
            <Route path='users' element={<h1>hello to users</h1>}/>
            <Route path='orders' element={<h1>hello to orders</h1>}/>
          </Route>
        </Route>

        <Route path="*" element={<h1>Not Found</h1>}/>
    </Routes>

  )
}

export default AppRoutes