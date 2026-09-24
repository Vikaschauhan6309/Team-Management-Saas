const bcrypt = require("bcrypt")
const { User } = require("../Models/User.schema")



const addOwner = (password, name, email) => {

    

    bcrypt.hash("maisabkabhagwan", 10)
    .then((data) => {
        User.create({
            name ,
            email ,
            password : data,
            role : "owner"
        })
    })
}


module.exports = { addOwner }