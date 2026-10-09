require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const { AuthRouter } = require("./Routes/auth.routes")
const { OwnerRouter } = require("./Routes/owner.routes")
const { AdminRouter } = require("./Routes/admin.routes")
const { EmployeeRouter } = require("./Routes/employee.routes")
const { AnalyticsRouter } = require("./Routes/analytics.routes")
const { ChatRouter } = require("./Routes/chats.routes")
const cors = require("cors")
const cp = require("cookie-parser")
const http = require("http")
const { Server } = require("socket.io")
const { Chat } = require("./Models/Chat.Schema")

// const { addUser } = require("./Utils/AddOwner")

const app = express()
const server = http.createServer(app)



const io = new Server(server, {
    cors : {
        origin : ["http://localhost:5173"]
    }
})

io.on("connection", (socket) => {
    // console.log("Socket connected")


    socket.on("join-room", (data) => {
        let roomId = [data.sender, data.receiver].sort().join("")
        socket.join(roomId)
    })

    socket.on("send-msg", async(data) => {
        
        // let roomId = [data.sender, data.receiver].sort().join("")
        // socket.join(roomId)
        let roomId = [data.sender, data.receiver].sort().join("")
        io.to(roomId).emit("rec-msg", data)

        await Chat.create({
            text : data.msg,
            sender : data.sender,
            receiver : data.receiver
        })


    })


})




app.use(cors({
    origin : ["deployedUrl", "http://localhost:5173"],
    credentials : true // allowing browser to request cookies
}))

app.use(cp())
app.use(express.json())
app.use("/api/auth", AuthRouter)
app.use("/api/owner", OwnerRouter)
app.use("/api/admin", AdminRouter)
app.use("/api/employee", EmployeeRouter)
app.use("/api/analytics", AnalyticsRouter)
app.use("/api/chats", ChatRouter)



mongoose.connect(process.env.DB_URL)
.then(() => {
    // addUser("Testing123!", "DemoUser", "demo@something.com", "admin")
    console.log("Database connected")

    const port = process.env.PORT || 8080

    server.listen(port, () => {
        console.log(`Server Running on port ${port}`)
    })
})
.catch((error) => {
    console.log(`DB Connection failed : ${error.message}`)
})



// Registered synchronously at startup, so it runs after every router above.
// Express 5 forwards errors thrown in async handlers here automatically.
app.use((err, req, res, next) => {

    let status = err.status || 400
    let message = err.message

    if(err.code == 11000)
    {
        const field = Object.keys(err.keyValue || {})[0] || "value"
        status = 409
        message = `${field} already exists`
    }
    else if(err.name == "JsonWebTokenError" || err.name == "TokenExpiredError")
    {
        status = 401
        message = "Session expired, please log in again"
    }
    else if(err.name == "CastError")
    {
        status = 400
        message = "Invalid ID"
    }

    res
    .status(status)
    .json({
        message
    })
})