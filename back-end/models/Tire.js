const mongoose = require("mongoose");


const STATUS = ["mounted", "inStorage", "needToBeReplaced", "replaced"];
const tireSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    wearLevel: { type: Number, default: 0 },
    status: {
      type: String,
      enum: STATUS,
    },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    lastReplacedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tire", tireSchema);
