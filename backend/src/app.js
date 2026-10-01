
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const { AuthRouter } = require("./Routes/auth.routes")
const { OwnerRouter } = require("./Routes/owner.routes")
const { AdminRouter } = require("./Routes/admin.routes")
const { EmployeeRouter } = require("./Routes/employee.routes")
const cors = require("cors")
const cp = require("cookie-parser")
// const { addUser } = require("./Utils/AddOwner")
const { addOwner } = require("./Utils/AddOwner")

const app = express()

app.use(cors({
    credentials : true // allowing browser to request cookies
}))
app.use(cp())
app.use(express.json())
app.use("/api/auth", AuthRouter)
app.use("/api/owner", OwnerRouter)
app.use("/api/admin", AdminRouter)
app.use("/api/employee", EmployeeRouter)



mongoose.connect(process.env.DB_URL)
.then(() => {
    // addUser("Testing123!", "DemoUser", "demo@something.com", "admin")

//    addOwner("maisabkabhagwan", "neha", "neha@example.com")

    console.log("Database connected")

    const port = process.env.PORT || 8080

    app.listen(port, () => {
        console.log(`Server Running on port ${port}`)
    })
})
.catch((error) => {
    console.log(`DB Connection failed : ${error.message}`)
})



app.use((err, req, res, next) => {
    // console.log(err)
    res
    .status(err.status || 400)
    .json({
        message : err.message
    })
})
// will my error not be stuck on the upper app.use()?
