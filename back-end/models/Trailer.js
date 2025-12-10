const mongoose = require("mongoose");

const STATUS = ["available", "OnTrip", "inMaintenance", "unavailable"];

const trailerSchema = new mongoose.Schema(
  {
    licensePlate: { type: String, required: true, unique: true },
    model: { type: String },
    status: {
      type: String,
      enum: STATUS,
    },
    tiers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tier" }],
    lastMaintenanceDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trailer", trailerSchema);
