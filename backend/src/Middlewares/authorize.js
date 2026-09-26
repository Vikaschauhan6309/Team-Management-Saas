const { AppError } = require("../Utils/AppError")

const authorize = (...roles) => {


    return (req, res, next) => {

        if(!roles.includes(req.user.role))
        {
            throw new AppError(403, "Unauthorised Operation")
        }

        next()


    }


}

module.exports = {
    authorize
}