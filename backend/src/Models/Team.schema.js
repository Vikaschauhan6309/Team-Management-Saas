const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength : 50,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
      immutable : true

    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable : true
    },
    isActive : {
      type : Boolean,
      default : true
    }
  },
  {
    timestamps: true,
  }
);

teamSchema.index(
  { organizationId: 1, name: 1 },
  { unique: true }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = { Team };