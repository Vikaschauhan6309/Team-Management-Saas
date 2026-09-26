const express = require("express")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { authorize } = require("../Middlewares/authorize")

const
{ 
    createOrg, 
    getAllOrgs, 
    getOrgsById, 
    deleteOrg, 
    updateOrg, 
    createAdmin, 
    getAllAdmins, 
    getAdminById,
    activateAdmin,
    deactivateAdmin
    
} = require('../Controllers/owner.controller')
const router = express.Router()



/*
*
*
    Owner APIs for Orgs
* 
* 
*/

router.post("/", isLoggedIn, authorize("owner"), createOrg)
router.get("/", isLoggedIn, authorize("owner"), getAllOrgs)
router.get("/:id", isLoggedIn, authorize("owner"), getOrgsById)
router.delete("/:id", isLoggedIn, authorize("owner"), deleteOrg)
router.patch("/:id", isLoggedIn, authorize("owner"), updateOrg)


/*
  - Owner APIs for Admin
  - Owner APIs for Admin
  - Owner APIs for Admin
  - Owner APIs for Admin
  - Owner APIs for Admin
*/

router.post("/organization/:id/admin", isLoggedIn, authorize("owner"), createAdmin)
router.get("/organization/:id/admin", isLoggedIn, authorize("owner"), getAllAdmins)
router.get("/admin/:id", isLoggedIn, authorize("owner"), getAdminById)
router.patch("/admin/:id", isLoggedIn, authorize("owner"), activateAdmin)
router.delete("/admin/:id", isLoggedIn, authorize("owner"), deactivateAdmin)


module.exports = {
    OwnerRouter : router
}