const express = require("express")
const { AppError } = require("../Utils/AppError")
const router = express.Router()
const{ User } = require("../Models/User.schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")


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

    const{name, email, role, isActive} = req.user



    res.json({
        message : "OK",
        data : {name, email, role, isActive}
    })
})


module.exports = {
    AuthRouter : router
}