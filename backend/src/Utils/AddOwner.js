const bcrypt = require("bcrypt")
const { User } = require("../Models/User.schema")



const addUser = (password, name, email, role) => {

    bcrypt.hash(password, 10)
    .then((data) => {
        User.create({
            name ,
            email ,
            password : data,
            role : role
        })
    })
}


module.exports = { addUser }