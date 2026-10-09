const { AppError } = require("../Utils/AppError")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const { User } = require("../Models/User.schema")

const isLoggedIn = async(req, res, next) => {
    const{ token } = req.cookies

    if(!token)
    {
        throw new AppError(401, "Please log in")
    }

    if(!validator.isJWT(token))
    {
        throw new AppError(401, "Please provide a valid token")
    }

    const originalObject = jwt.verify(token, process.env.JWT_SECRET)
    const foundUser = await User.findById(originalObject._id).populate("organizationId")

    if(!foundUser)
    {
        throw new AppError(401, "User not found")
    }

    if(!foundUser.isActive)
    {
        throw new AppError(403, "Your account has been deactivated")
    }

    req.user = foundUser

    next()
}


module.exports = {
    isLoggedIn
}