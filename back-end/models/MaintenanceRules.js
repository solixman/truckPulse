const mongoose = require("mongoose");

const TYPES = ["truck", "trailer"];

const maintenanceRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: TYPES,
      required: true,
      unique: true, 
    },
    kms: {
      type: Number,
      required: true,
      min: 0,
    },
    days: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("MaintenanceRule", maintenanceRuleSchema);
