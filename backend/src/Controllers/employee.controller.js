const mongoose = require("mongoose")
const { Task } = require("../Models/Task.schema")
const { AppError } = require("../Utils/AppError")

const populateTask = (query) => {
    return query
    .populate("teamId", "name")
    .populate("createdBy", "name")
}

const getAllTasks = async(req, res) => {
    
    const id = req.user._id

    const allTasks = await populateTask(Task.find({
        assignedTo : id
    })).sort({createdAt : -1})

    res
    .status(200)
    .json({
        data : allTasks
    })


}

const getTaskById = async(req, res) => {

    const{ taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError(400, "Invalid Task ID")
    }

    const data = await populateTask(Task.findOne({
        _id : taskId,
        assignedTo : req.user._id
    }))

    if(!data)
    {
        throw new AppError(404, "Task not found")
    }

    res
    .status(200)
    .json({
        data
    })

}


const updateTaskEmployee = async(req, res) => {

    const{ status } = req.body
    const{ taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError(400, "Invalid Task ID")
    }

    if(!status || !["todo", "in-progress", "completed"].includes(status))
    {
        throw new AppError(400, "Invalid Status")
    }

    const data = await populateTask(Task.findOneAndUpdate({
        _id : taskId,
        assignedTo : req.user._id
    }, {
        status
    },{
        runValidators : true,
        returnDocument : "after"
    }))


    if(!data){throw new AppError(404, "Task not found")}

    res
    .status(200)
    .json({
        message : 'Task updated',
        data
    })

}

module.exports = {
    getAllTasks,
    getTaskById,
    updateTaskEmployee
}