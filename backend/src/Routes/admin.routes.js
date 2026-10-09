const express = require("express")
const router = express.Router()
const{ authorize, isLoggedIn, isOrganizationActive} = require("../Middlewares/index")
const { deleteTask, getTaskById, getAllTasks, addTeam, getAllTeams, getTeamById, deleteTeam, updateTeam, createEmployee, getAllEmployeesByTeamId, updateEmployee, deleteEmployee, createTask, updateTask } = require("../Controllers/admin.controller")

router.post(
    "/teams", 
    isLoggedIn, 
    isOrganizationActive,
    authorize("admin"), 
    addTeam
)

router.get(
    "/teams",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    getAllTeams
)

router.get(
    "/teams/:id",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    getTeamById
)

router.delete(
    "/teams/:id",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    deleteTeam
)


router.patch(
    "/teams/:id",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    updateTeam
)




/*
    - Admin's APIs for employees
*/



router.post(
    "/teams/:teamId/employees",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    createEmployee
)

router.get(
    "/teams/:teamId/employees",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    getAllEmployeesByTeamId
)



// router.get(
//     "/teams/:teamId/employees",
//     isLoggedIn,
//     isOrganizationActive,
//     authorize("admin"),
//     getAllEmployeesByTeamId
// )



// router.get(
//     "/teams/:teamId/employees",
//     isLoggedIn,
//     isOrganizationActive,
//     authorize("admin"),
//     getAllEmployeesByTeamId
// )



router.patch(
    "/employees/:employeeId",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    updateEmployee
)



router.delete(
    "/employees/:employeeId",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    deleteEmployee
)

/*
    - Admin's Task APIs
*/


router.post(
    "/tasks/employee/:employeeId",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    createTask
)

router.get(
    "/tasks",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    getAllTasks
)


router.get(
    "/tasks/:taskId",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    getTaskById
)



router.delete(
    "/tasks/:taskId",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    deleteTask
)


router.patch(
    "/tasks/:taskId",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin"),
    updateTask
)








module.exports = {
    AdminRouter : router
}