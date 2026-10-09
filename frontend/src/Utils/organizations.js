import toast from "react-hot-toast"
import api from "./api"
import { getErrorMessage } from "./helpers"

// DELETE soft-deactivates an organization; reactivation goes through PATCH
export const toggleOrganization = (organization) => {
    const request = organization.isActive
        ? api.delete(`/api/owner/${organization._id}`)
        : api.patch(`/api/owner/${organization._id}`, { name : organization.name, isActive : true })

    return request
    .then((res) => {
        toast.success(organization.isActive ? "Organization deactivated" : "Organization reactivated")
        return res.data.data
    })
    .catch((error) => {
        toast.error(getErrorMessage(error))
        throw error
    })
}