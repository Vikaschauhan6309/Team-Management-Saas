const { Organization } = require("../Models/Organization.schema")
const { User } = require("../Models/User.schema")

const getAnalytics = async(req, res) => {

    const totalAdmins = await User.countDocuments({
        role : "admin"
    })



    const demo = await Organization.aggregate([
        
         {
    $group: {
      _id: null,

      totalOrganizations: {
        $sum: 1,
      },

      activeOrganizations: {
        $sum: {
          $cond: [
            { $eq: ["$isActive", true] },
            1,
            0,
          ],
        },
      },

     
    },
  },
    ])



    res
    .status(200)
    .json({
       data : {
        ...demo[0],
        totalAdmins
       }
    })
}


const getAllOrgsData = async(req, res) => {
    const recentOrganizations = await Organization.aggregate([
    {
        $lookup: {
        from: "users",
        let: {
            organizationId: "$_id",
        },
        pipeline: [
            {
            $match: {
                $expr: {
                $and: [
                    {
                    $eq: [
                        "$organizationId",
                        "$$organizationId",
                    ],
                    },
                    {
                    $eq: ["$role", "admin"],
                    },
                ],
                },
            },
            },
            {
            $count: "count",
            },
        ],
        as: "adminData",
        },
    },

    {
        $addFields: {
        adminCount: {
            $ifNull: [
            {
                $arrayElemAt: ["$adminData.count", 0],
            },
            0,
            ],
        },
        },
    },

    {
        $project: {
        _id: 1,
        name: 1,
        isActive: 1,
        adminCount: 1,
        createdAt: 1,
        },
    },

    {
        $sort: {
        createdAt: -1,
        },
    },

    {
        $limit: 4,
    },
    ]);


    res
    .status(200)
    .json({
        data : recentOrganizations
    })
}



module.exports = {
    getAnalytics, getAllOrgsData
}