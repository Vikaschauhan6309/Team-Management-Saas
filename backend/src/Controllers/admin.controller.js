const mongoose = require("mongoose")
const { Team } = require("../Models/Team.schema")
const { AppError } = require("../Utils/AppError")
const { User } = require("../Models/User.schema")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { Task } = require("../Models/Task.schema")


const addTeam = async(req, res) => {


    const{ name }  = req.body

    if(!name.trim() || name.trim().length > 50)
    {
        throw new AppError(400, "Name is invalid")
    }

    const createdTeam = await Team.create(
        {
            name,
            adminId : req.user._id,
            organizationId : req.user.organizationId._id
        }
    )

    res
    .status(200)
    .json({
        message : "Team created successfully",
        data : createdTeam
    })


}

const getAllTeams = async(req, res) => {


    const organizationId = req.user.organizationId._id
    const foundTeams = await Team.find({organizationId})

    res
    .status(200)
    .json({
        data : foundTeams
    })
}

const getTeamById = async(req, res) => {
    const{ id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundTeam = await Team.findOne({
        _id : id,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "Team does not exists")
    }

    res
    .status(200)
    .json({
        data : foundTeam
    })
}

const deleteTeam = async(req, res) => {

    const{ id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }


    const foundTeam = await Team.findOne({
        _id : id,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "Team does not exists")
    }

    foundTeam.isActive = false
    await foundTeam.save()

    res
    .status(200)
    .json({
        message : "Team deleted successfully",
        // data : foundTeam
    })



}

const updateTeam = async(req, res) => {
    const{ name, isActive } = req.body
    const{ id } = req.params

    if(!name.trim() || name.trim().length > 50)
    {
        throw new AppError(400, "Invalid name")
    }

    const foundTeam = await Team.findOne({
        _id : id,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "team does not exists")
    }

    foundTeam.isActive = true
    foundTeam.name = name

    await foundTeam.save()


    res
    .status(200)
    .json({
        message : "Team updated",
        data : foundTeam
    })
}


//---------------------------Make Employee and Task related functions in separate controller file----------------------------



const createEmployee = async(req, res) => {
    
    const{ teamId } = req.params

    if(!mongoose.Types.ObjectId.isValid(teamId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundTeam = await Team.findOne({
        _id : teamId,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "Team does not exists")
    }

    const{ name, password, email } = req.body

    if(!name || !name.trim() || name.trim().length > 20 || name.trim().length < 2)
    {
        throw new AppError(400, "Invalid name")
    }

    if(!validator.isEmail(email))
    {
        throw new AppError(400, "Invalid Email")
    }

    if(!validator.isStrongPassword(password))
    {
        throw new AppError(400, "Please enter a strong password")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await User.create({
        password : hashedPassword,
        name, 
        email, 
        role : "employee",
        organizationId : req.user.organizationId._id,
        teamId : teamId
    })

    res
    .status(201)
    .json({
        message :  `Employee (${name}) created successfully`,
        data : createEmployee
    })


}



const getAllEmployeesByTeamId = async(req, res) => {
    const{ teamId } = req.params

    if(!mongoose.Types.ObjectId.isValid(teamId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const allEmployees = await User.find({
        teamdId : teamId,
        organizationId : req.user.organizationId._id
    })


    res
    .status(200)
    .json({
        data : allEmployees
    })

}


const deleteEmployee = async(req, res) => {
    const{ employeeId } = req.params

    if(!mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundEmployee = await User.findOne({
        _id : employeeId,
        organizationId : req.user.organizationId._id
    })


    if(!foundEmployee)
    {
        throw new AppError(404, "User does not exists")
    }

    foundEmployee.isActive = false
    await foundEmployee.save()

    res
    .status(200)
    .json({
        message : "User deleted"
    })
}

const updateEmployee = async(req, res) => {
    const{ employeeId } = req.params

    if(!mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError(400, "Invalid ID")
    }

    
    

    const{teamId, isActive} = req.body
   

    const foundEmployee = await User.findOneAndUpdate({_id : employeeId, organizationId : req.user.organizationId._id}, {teamId : teamId, isActive}, {
        runValidators : true,
        returnDocument : "after"
    })
 


   

    res
    .status(200)
    .json({
        message : "User Updated",
        data : foundEmployee
    })

}






//---------------------------Make Employee and Task related functions in separate controller file----------------------------

const createTask = async (req, res) => {

    const{ employeeId } = req.params

    if(!mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundEmployee = await User.findOne({
        _id : employeeId,
        organizationId : req.user.organizationId._id
    })

    if(!foundEmployee)
    {
        throw new AppError(404, "Employee does not exists")
    }

    const{title, description, status, priority } = req.body

    if(!title || !title.trim() || title.trim().length > 100)
    {
        throw new AppError(400, "Invalid title")
    }


    if(!description || !description.trim() || description.trim().length > 300)
    {
        throw new AppError(400, "Invalid description")
    }


    if(!status || !status.trim() || !["todo", "in-progress", "completed"].includes(status.trim()))
    {
        throw new AppError(400, "Invalid status")
    }


    if(!priority || !priority.trim() || !["low", "medium", "high"].includes(priority.trim()))
    {
        throw new AppError(400, "Invalid priority")
    }




    const createdTask = await Task.create({
        title, 
        description,
        status, 
        priority,
        organizationId : req.user.organizationId._id,
        teamId : foundEmployee.teamId,
        assignedTo : employeeId,
        createdBy : req.user._id
    })
    
    res
    .status(201)
    .json({
        message : "Task created",
        data : createdTask
    })


}

const getAllTasks = async(req, res) => {


    const allTasks = await Task.find({
        organizationId : req.user.organizationId._id
    })

    res
    .status(200)
    .json({
        data : allTasks
    })
}


const getTaskById = async(req, res) => {
    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundTask = await Task.findOne({
        _id : taskId,
        organizationId : req.user.organizationId._id
    })


    res
    .status(200)
    .json({
        data : foundTask
    })

    

}


const deleteTask = async(req, res) => {

    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const data = await Task.findOneAndDelete({
        _id : taskId,
        organizationId : req.user.organizationId._id
    })

     

    res
    .status(200)
    .json({
        message : "Done"
    })

}


const updateTask = async(req, res) => {

    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError(400, "Invalid Task ID")
    }

    const{title, description, status, priority, assignedTo,teamId} = req.body

    if(!title || !title.trim() || title.trim().length > 100)
    {
        throw new AppError(400, "Invalid title")
    }


    if(!description || !description.trim() || description.trim().length > 300)
    {
        throw new AppError(400, "Invalid description")
    }


    if(!status || !status.trim() || !["todo", "in-progress", "completed"].includes(status.trim()))
    {
        throw new AppError(400, "Invalid status")
    }


    if(!priority || !priority.trim() || !["low", "medium", "high"].includes(priority.trim()))
    {
        throw new AppError(400, "Invalid priority")
    }


    if(!teamId || !mongoose.Types.ObjectId.isValid(teamId))
    {
        throw new AppError(400, "Invalid TeamId")
    }


    if(!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo))
    {
        throw new AppError(400, "Invalid EmployeeId")
    }

    const foundEmployee = await User.findById(assignedTo)

    if(!foundEmployee)
    {
        throw new AppError(404, "User not found")
    }


    const updatedTask = await Task.findOneAndUpdate({
        _id : taskId,
        organizationId : req.user.organizationId._id
    }, {
        title,
        description,
        status,
        priority,
        teamId : foundEmployee.teamdId,
        assignedTo
    }, {
        runValidators : true,
        returnDocument : "after"
    })

    if(!updatedTask)
    {
        throw new AppError(404, "Task not found")
    }

    res
    .status(200)
    .json({
        message : "Task updated",
        data : updatedTask
    })

}



module.exports = {
    addTeam, 
    getAllTeams,
    getTeamById,
    deleteTeam,
    updateTeam,
    createEmployee,
    getAllEmployeesByTeamId,
    deleteEmployee,
    updateEmployee,
    createTask,
    getAllTasks,
    getTaskById,
    deleteTask,
    updateTask
}