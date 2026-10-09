const { AppError } = require("../Utils/AppError")
const { Organization } = require("../Models/Organization.schema")
const mongoose = require("mongoose")
const { User } = require("../Models/User.schema")
const validator = require("validator")
const bcrypt = require("bcrypt")


const createOrg = async(req, res) => {


    const { name, isActive } = req.body

    if(!name || !name.trim() || name.trim().length > 100)
    {
        throw new AppError(400, "Invalid Name")
    }


    const createdOrg = await Organization.create({
        name,
        isActive,
        createdBy : req.user._id
    })


    res
    .status(201)
    .json({
        message : "Organization Created",
        data : createdOrg
    })

}


const getAllOrgs = async(req, res) => {

    // skip = page index (0-based), limit = page size
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100)
    const skip = Math.max(parseInt(req.query.skip) || 0, 0)

    const data = await Organization.find().sort({createdAt : -1}).limit(limit).skip(skip * limit)

    res
    .status(200)
    .json({
        data
    })
}



const getOrgsById =  async(req, res) => {
    const{ id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }
    
    const data = await Organization.findById(id)

    if(!data)
    {
        throw new AppError(404, "Organization not found")
    }

    res
    .status(200)
    .json({
        data
    })
}


const deleteOrg = async(req, res) => {
    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const data = await Organization.findByIdAndUpdate(id, {isActive : false}, {returnDocument : "after"}) // soft deletion hard delete


    if(!data)
    {
        throw new AppError(404, "Organization does not exists")
    }

    res
    .status(200)
    .json({
        message : "Organization Deleted",
        data
    })
}

const updateOrg =  async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const{name, isActive} = req.body

    if(!name || !name.trim() || name.trim().length > 100)
    {
        throw new AppError(400, "Invalid Name")
    }

    const updatedOrg = await Organization.findByIdAndUpdate(id, {name, isActive}, {runValidators : true, returnDocument : "after"})

    if(!updatedOrg)
    {
        throw new AppError(404, "Organization does not exists")
    }


    res
    .status(200)
    .json({
        message : "Organization Updated",
        data : updatedOrg
    })


}

const createAdmin = async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400,"Invalid ID")
    }

    const{ email, password, name} = req.body

    if(!email || !validator.isEmail(email))
    {
        throw new AppError(400, `${email} is not a valid email`)
    }

    if(!password || !validator.isStrongPassword(password))
    {
        throw new AppError(400, "Password must be at least 8 characters with uppercase, lowercase, number and symbol")
    }

    if(!name || !name.trim() || name.trim().length > 20 || name.trim().length < 2)
    {
        throw new AppError(400, "Invalid name")
    }

    const foundOrg = await Organization.findById(id)

    if(!foundOrg)
    {
        throw new AppError(404, "Organization does not exists")
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const createdAdmin = await User.create({
        name,
        password : hashedPassword,
        email,
        role : "admin",
        organizationId : id,
        isActive : foundOrg.isActive
    })

    // if(!foundOrg.isActive)
    // {
    //     throw new AppError(400, "Organization Inactive")
    // }
    

    res
    .status(201)
    .json({
        data : createdAdmin,
        message : foundOrg.isActive ?  
        `Admin created under org ${foundOrg.name}` : 
        `Admin created under org ${foundOrg.name} which is currently INACTIVE`
    })

}

const getAllAdmins = async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400,"Invalid ID")
    }

    const foundOrg = await Organization.findById(id)

    if(!foundOrg)
    {
        throw new AppError(404, "Organization does not exists")
    }

    const foundAdmins = await User.find({
        organizationId : foundOrg._id,
        role : "admin"
    })


    res
    .status(200)
    .json({
        data : foundAdmins,
        message : foundOrg.isActive ?  
        `Organization ACTIVE` : 
        `Organization INACTIVE`
    })


}


const getAdminById = async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400,"Invalid ID")
    }

    const foundUser = await User.findOne({_id : id, role : "admin"})

    if(!foundUser)
    {
        throw new AppError(404, "Admin does not exists")
    }

    const foundOrg = await Organization.findById(foundUser.organizationId)

    res
    .status(200)
    .json({
        data : foundUser,
        message : foundOrg.isActive ?  
        `Organization ACTIVE` : 
        `Organization INACTIVE`
    })




}


const activateAdmin = async(req, res) => {
    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400,"Invalid ID")
    }

    const foundUser = await User.findOne({_id : id, role : "admin"})

    if(!foundUser)
    {
        throw new AppError(404, "Admin does not exists")
    }

    foundUser.isActive = true


    await foundUser.save()

    res
    .status(200)
    .json({
        message : `${foundUser.name} activated successfully`,
        data : foundUser
    })
}

const deactivateAdmin = async(req, res) => {
      const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400,"Invalid ID")
    }

    const foundUser = await User.findOne({_id : id, role : "admin"})

    if(!foundUser)
    {
        throw new AppError(404, "Admin does not exists")
    }

    foundUser.isActive = false


    await foundUser.save()

    res
    .status(200)
    .json({
        message : `${foundUser.name} deactivated successfully`,
        data : foundUser
    })
}



module.exports = {
    deactivateAdmin ,createOrg, getAllOrgs, getOrgsById, deleteOrg, updateOrg, createAdmin, getAllAdmins, getAdminById, activateAdmin
}