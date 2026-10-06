const express = require('express')
const router = express.Router()
const{ isLoggedIn, authorize } = require("../Middlewares/index")
const { getAnalytics, getAllOrgsData } = require('../Controllers/analytics.controller')


router.get(
    "/",
    isLoggedIn,
    authorize("owner"),
    getAnalytics
)

router.get(
    "/get-all-orgs-data",
    isLoggedIn,
    authorize("owner"),
    getAllOrgsData
)





module.exports = {
    AnalyticsRouter : router
}