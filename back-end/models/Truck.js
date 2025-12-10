const { Schema, model } = require("mongoose");

const STATUS = ["available", "OnTrip", "inMaintenance", "unavailable"];

const truckSchema = new Schema(
  {
    licensePlate: { type: String, required: true, unique: true },
    model: { type: String },
    mileage: { type: Number, default: 0 },
    currentFuel: { type: Number, default: 0 },
    tires: [{ type: Schema.Types.ObjectId, ref: "Tire" }],
    status: {
      type: String,
      enum: STATUS,
    },
    driver:{type:Schema.Types.ObjectId,ref:"User"},
    lastMaintenanceDate:{type:Date}
  },
  { timestamps: true }
);

module.exports = model("Truck", truckSchema);
