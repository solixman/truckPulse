const { Schema, model } = require("mongoose");

const STATUS = ["available", "OnTrip", "inMaintenance", "unavailable"];

const truckSchema = new Schema(
  {
    licensePlate: { type: String, required: true, unique: true },
    model: { type: String },
    status: {
      type: String,
      enum: STATUS,
    },
    mileage: { type: Number, default: 0 },
    currentFuel: { type: Number, default: 0 },
    tires: [{ type: Schema.Types.ObjectId, ref: "Tire" }],
  },
  { timestamps: true }
);

module.exports = model("Truck", truckSchema);
