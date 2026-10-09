import axios from "axios"

// Single axios instance so every request carries the auth cookie
const api = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_URL,
    withCredentials : true
})

export default api