import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({allowedRoles}: {allowedRoles?: string[]}) => {
    const {user, isAuthenticated} = useSelector((state:any) => state.user)
    if(!isAuthenticated) {
        return <Navigate to={'/login'} replace/>
    }
    
    if(allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to={'/'} replace />
    }

    return <Outlet/>
}
export default ProtectedRoute;