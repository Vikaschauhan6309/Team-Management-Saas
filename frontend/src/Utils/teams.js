import toast from "react-hot-toast"
import api from "./api"
import { getErrorMessage } from "./helpers"

// DELETE soft-deactivates a team; reactivation goes through PATCH
export const toggleTeam = (team) => {
    const request = team.isActive
        ? api.delete(`/api/admin/teams/${team._id}`)
        : api.patch(`/api/admin/teams/${team._id}`, { name : team.name, isActive : true })

    return request
    .then((res) => {
        toast.success(team.isActive ? "Team deactivated" : "Team reactivated")
        return res.data.data
    })
    .catch((error) => {
        toast.error(getErrorMessage(error))
        throw error
    })
}