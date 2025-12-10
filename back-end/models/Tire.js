const mongoose = require("mongoose");


const STATUS = ["mounted", "inStorage", "ToBeReplaced", "replaced"];
const tireSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    wearLevel: { type: Number, default: 0 },
    status: {
      type: String,
      enum: STATUS,
    },
    lastReplacedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tire", tireSchema);
