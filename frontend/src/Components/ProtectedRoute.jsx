import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import api from "../Utils/api"
import { addUserData } from "../Utils/redux/userSlice"
import Loading from "./Loading"


const ProtectedRoutes = () => {

    const userData = useSelector(store => store.user)
    const dispatch = useDispatch()
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if(userData) return

        api.get("/api/auth/me")
        .then((res) => {
            dispatch(addUserData(res.data.data))
        })
        .catch(() => {
            setFailed(true)
        })
    }, [userData, dispatch])


    if(failed)
    {
        return <Navigate to="/login" replace />
    }

    if(!userData)
    {
        return <Loading />
    }

    return <Outlet />

}

export default ProtectedRoutes