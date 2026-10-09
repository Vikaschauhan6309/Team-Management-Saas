import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "./api"
import { getErrorMessage } from "./helpers"

const fetchWorkspace = async () => {
    const [teamsRes, tasksRes] = await Promise.all([
        api.get("/api/admin/teams"),
        api.get("/api/admin/tasks"),
    ])

    const teams = teamsRes.data.data

    // backend only lists employees per team, so gather them across all teams
    const employeeLists = await Promise.all(
        teams.map((team) => api.get(`/api/admin/teams/${team._id}/employees`).then((res) => res.data.data))
    )

    return {
        teams,
        employees : employeeLists.flat(),
        tasks : tasksRes.data.data
    }
}

// Loads everything an admin works with: teams, employees and tasks of their organization
const useAdminWorkspace = () => {
    const [data, setData] = useState(null)

    const reload = useCallback(() => {
        return fetchWorkspace()
        .then(setData)
        .catch((error) => {
            toast.error(getErrorMessage(error, "Could not load workspace"))
            setData({ teams : [], employees : [], tasks : [] })
        })
    }, [])

    useEffect(() => {
        reload()
    }, [reload])

    // insert or replace an item by _id in one of the lists
    const upsert = useCallback((key, item) => {
        setData((prev) => {
            const exists = prev[key].some((x) => x._id == item._id)
            return {
                ...prev,
                [key] : exists ? prev[key].map((x) => (x._id == item._id ? item : x)) : [item, ...prev[key]]
            }
        })
    }, [])

    const remove = useCallback((key, id) => {
        setData((prev) => ({ ...prev, [key] : prev[key].filter((x) => x._id != id) }))
    }, [])

    return { data, reload, upsert, remove }
}

export default useAdminWorkspace