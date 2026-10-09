import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "./api"
import { getErrorMessage } from "./helpers"

// Employee's own tasks plus a status updater (the only field employees may change)
const useMyTasks = () => {
    const [tasks, setTasks] = useState(null)

    useEffect(() => {
        api.get("/api/employee/tasks")
        .then((res) => setTasks(res.data.data))
        .catch((error) => {
            toast.error(getErrorMessage(error, "Could not load tasks"))
            setTasks([])
        })
    }, [])

    const updateStatus = useCallback((taskId, status) => {
        return api.patch(`/api/employee/tasks/${taskId}`, { status })
        .then((res) => {
            setTasks((prev) => prev.map((task) => (task._id == taskId ? res.data.data : task)))
            toast.success("Status updated")
            return res.data.data
        })
        .catch((error) => {
            toast.error(getErrorMessage(error))
            throw error
        })
    }, [])

    return { tasks, updateStatus }
}

export default useMyTasks