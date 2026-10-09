import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

// Must be nested inside ProtectedRoutes, so the user is always loaded here
const RoleRoute = ({ roles }) => {
    const user = useSelector(store => store.user)

    if(!roles.includes(user.role))
    {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default RoleRoute