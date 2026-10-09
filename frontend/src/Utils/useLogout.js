import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "./api"
import { removeUserData } from "./redux/userSlice"
import { getErrorMessage } from "./helpers"

const useLogout = () => {
    const dispatch = useDispatch()
    const nav = useNavigate()

    return () => {
        api.post("/api/auth/logout")
        .then(() => {
            dispatch(removeUserData())
            toast.success("User logged out")
            nav("/login")
        })
        .catch((error) => toast.error(getErrorMessage(error, "Logout failed")))
    }
}

export default useLogout