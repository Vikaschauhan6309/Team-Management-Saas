require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const { addOwner } = require("./Utils/AddOwner")

const app = express()



mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log("Database connected")
    
    // addOwner("maisabkabhagwan", "ajit", "ajit@example.com")
    const port = process.env.PORT || 8080

    app.listen(port, () => {
        console.log(`Server Running on port ${port}`)
    })
})
.catch((error) => {
    console.log(`DB Connection failed : ${error.message}`)
})



