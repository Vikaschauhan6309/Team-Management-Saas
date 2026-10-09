const mongoose = require("mongoose")
const { Team } = require("../Models/Team.schema")
const { AppError } = require("../Utils/AppError")
const { User } = require("../Models/User.schema")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { Task } = require("../Models/Task.schema")


const TASK_STATUSES = ["todo", "in-progress", "completed"]
const TASK_PRIORITIES = ["low", "medium", "high"]


const addTeam = async(req, res) => {


    const{ name }  = req.body

    if(!name || !name.trim() || name.trim().length > 50)
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
    .status(201)
    .json({
        message : "Team created successfully",
        data : createdTeam
    })


}

const getAllTeams = async(req, res) => {


    const organizationId = req.user.organizationId._id
    const foundTeams = await Team.find({organizationId}).sort({createdAt : -1})

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
        data : foundTeam
    })



}

const updateTeam = async(req, res) => {
    const{ name, isActive } = req.body
    const{ id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    if(!name || !name.trim() || name.trim().length > 50)
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

    // only touch isActive when the client explicitly sends it
    if(typeof isActive == "boolean")
    {
        foundTeam.isActive = isActive
    }
    foundTeam.name = name

    await foundTeam.save()


    res
    .status(200)
    .json({
        message : "Team updated",
        data : foundTeam
    })
}

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

    if(!foundTeam.isActive)
    {
        throw new AppError(400, "Cannot add employees to an inactive team")
    }

    const{ name, password, email } = req.body

    if(!name || !name.trim() || name.trim().length > 20 || name.trim().length < 2)
    {
        throw new AppError(400, "Invalid name")
    }

    if(!email || !validator.isEmail(email))
    {
        throw new AppError(400, "Invalid Email")
    }

    if(!password || !validator.isStrongPassword(password))
    {
        throw new AppError(400, "Password must be at least 8 characters with uppercase, lowercase, number and symbol")
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
        data : createdUser
    })


}

const getAllEmployeesByTeamId = async(req, res) => {
    const{ teamId } = req.params

    if(!mongoose.Types.ObjectId.isValid(teamId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const allEmployees = await User.find({
        teamId : teamId,
        role : "employee",
        organizationId : req.user.organizationId._id
    }).sort({createdAt : -1})


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
        role : "employee",
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
        message : "User deleted",
        data : foundEmployee
    })
}

const updateEmployee = async(req, res) => {
    const{ employeeId } = req.params

    if(!mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError(400, "Invalid ID")
    }

    const{teamId, isActive} = req.body
    const update = {}

    if(teamId !== undefined)
    {
        if(!mongoose.Types.ObjectId.isValid(teamId))
        {
            throw new AppError(400, "Invalid Team ID")
        }

        // the new team must belong to this admin's organization
        const foundTeam = await Team.findOne({
            _id : teamId,
            organizationId : req.user.organizationId._id,
            isActive : true
        })

        if(!foundTeam)
        {
            throw new AppError(404, "Team does not exists")
        }

        update.teamId = teamId
    }

    if(isActive !== undefined)
    {
        if(typeof isActive != "boolean")
        {
            throw new AppError(400, "Invalid isActive value")
        }

        update.isActive = isActive
    }

    const foundEmployee = await User.findOneAndUpdate({
        _id : employeeId,
        role : "employee",
        organizationId : req.user.organizationId._id
    }, update, {
        runValidators : true,
        returnDocument : "after"
    })

    if(!foundEmployee)
    {
        throw new AppError(404, "User does not exists")
    }

    // tasks follow their assignee's team (same rule as createTask/updateTask)
    if(update.teamId)
    {
        await Task.updateMany({
            assignedTo : employeeId,
            organizationId : req.user.organizationId._id
        }, {
            teamId : update.teamId
        })
    }

    res
    .status(200)
    .json({
        message : "User Updated",
        data : foundEmployee
    })

}


const validateTaskBody = (body) => {
    const{title, description, status, priority, dueDate } = body

    if(!title || !title.trim() || title.trim().length > 100)
    {
        throw new AppError(400, "Invalid title")
    }


    if(!description || !description.trim() || description.trim().length > 300)
    {
        throw new AppError(400, "Invalid description")
    }


    if(!status || !status.trim() || !TASK_STATUSES.includes(status.trim()))
    {
        throw new AppError(400, "Invalid status")
    }


    if(!priority || !priority.trim() || !TASK_PRIORITIES.includes(priority.trim()))
    {
        throw new AppError(400, "Invalid priority")
    }

    if(dueDate && isNaN(new Date(dueDate).getTime()))
    {
        throw new AppError(400, "Invalid due date")
    }

    return {
        title,
        description,
        status,
        priority,
        dueDate : dueDate || null
    }
}


// assignee must be an active employee of the admin's organization with a team
const findAssignableEmployee = async(employeeId, organizationId) => {
    if(!employeeId || !mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError(400, "Invalid EmployeeId")
    }

    const foundEmployee = await User.findOne({
        _id : employeeId,
        role : "employee",
        organizationId
    })

    if(!foundEmployee)
    {
        throw new AppError(404, "Employee does not exists")
    }

    if(!foundEmployee.isActive)
    {
        throw new AppError(400, "Employee is inactive")
    }

    if(!foundEmployee.teamId)
    {
        throw new AppError(400, "Employee is not part of any team")
    }

    return foundEmployee
}


const populateTask = (query) => {
    return query
    .populate("assignedTo", "name email isActive")
    .populate("teamId", "name isActive")
    .populate("createdBy", "name")
}


const createTask = async (req, res) => {

    const{ employeeId } = req.params

    const foundEmployee = await findAssignableEmployee(employeeId, req.user.organizationId._id)

    const taskData = validateTaskBody(req.body)


    const createdTask = await Task.create({
        ...taskData,
        organizationId : req.user.organizationId._id,
        teamId : foundEmployee.teamId,
        assignedTo : employeeId,
        createdBy : req.user._id
    })

    const data = await populateTask(Task.findById(createdTask._id))

    res
    .status(201)
    .json({
        message : "Task created",
        data
    })


}

const getAllTasks = async(req, res) => {


    const allTasks = await populateTask(Task.find({
        organizationId : req.user.organizationId._id
    })).sort({createdAt : -1})

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

    const foundTask = await populateTask(Task.findOne({
        _id : taskId,
        organizationId : req.user.organizationId._id
    }))

    if(!foundTask)
    {
        throw new AppError(404, "Task not found")
    }


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

    if(!data)
    {
        throw new AppError(404, "Task not found")
    }

    res
    .status(200)
    .json({
        message : "Task deleted"
    })

}


const updateTask = async(req, res) => {

    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError(400, "Invalid Task ID")
    }

    const taskData = validateTaskBody(req.body)

    const foundEmployee = await findAssignableEmployee(req.body.assignedTo, req.user.organizationId._id)


    const updatedTask = await populateTask(Task.findOneAndUpdate({
        _id : taskId,
        organizationId : req.user.organizationId._id
    }, {
        ...taskData,
        teamId : foundEmployee.teamId,
        assignedTo : foundEmployee._id
    }, {
        runValidators : true,
        returnDocument : "after"
    }))

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