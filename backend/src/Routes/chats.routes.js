const express = require("express")
const { isLoggedIn, authorize, isOrganizationActive } = require("../Middlewares")
const { getChatsInfo, getChats } = require("../Controllers/chatsController")
const router = express.Router()

router.get(
    "/",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin", "employee"),
    getChatsInfo
)

router.get(
    "/:id",
    isLoggedIn,
    isOrganizationActive,
    authorize("admin", "employee"),
    getChats
)




module.exports = {
    ChatRouter : router
}