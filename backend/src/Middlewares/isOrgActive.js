const { AppError } = require("../Utils/AppError")

const isOrganizationActive = (req, res, next) => {
    if(req.user.role == "owner")
    {
        next()
    }
    else
    {
        if(!req.user.organizationId.isActive)
        {
            throw new AppError(403, "Organization Inactive")
        }
        next()
    }
}



module.exports = {
    isOrganizationActive
}