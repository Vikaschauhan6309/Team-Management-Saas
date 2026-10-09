const express = require("express")
const { AppError } = require("../Utils/AppError")
const router = express.Router()
const{ User } = require("../Models/User.schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { Team } = require("../Models/Team.schema")


router.post("/login", async(req, res) => {
    
    const { email, password } = req.body
    if(!email || !password)
    {
        throw new AppError(400, "Email and password is required")
    }

    const foundUser = await User.findOne({email})
    if(!foundUser)
    {
        throw new AppError(404, "User does not exists")
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if(!isPasswordCorrect)
    {
        throw new AppError(400, "Invalid Credentials")
    }

    if(!foundUser.isActive)
    {
        throw new AppError(403, "Your account has been deactivated")
    }

    const token = jwt.sign({_id : foundUser._id}, process.env.JWT_SECRET, {
        expiresIn : "1d"
    })

    res
    .status(200)
    .cookie("token", token, {
        maxAge : 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "strict",
        // secure : true
    })
    .json({
        message : "User logged in"
    })

})


router.post("/logout", (req, res) => {
    res
    .status(200)
    .clearCookie("token")
    .json({
        message : "User logged out"
    })
})


router.get("/me", isLoggedIn ,async(req, res) => {

    const{_id, name, email, role, isActive, organizationId, teamId} = req.user

    const organization = organizationId ? {
        _id : organizationId._id,
        name : organizationId.name,
        isActive : organizationId.isActive
    } : null

    const foundTeam = teamId ? await Team.findById(teamId).select("name isActive") : null

    res.json({
        message : "OK",
        data : {_id, name, email, role, isActive, organization, team : foundTeam}
    })
})


module.exports = {
    AuthRouter : router
}