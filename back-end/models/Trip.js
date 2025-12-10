const mongoose = require("mongoose");

const STATUS = ["toDo", "done", "canceled", "inProgress"];

const tripSchema = new mongoose.Schema(
  {
    startingPoint: { type: String, required: true },
    destination: { type: String, required: true },
   
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    status: {
      type: String,
      enum: STATUS,
    },
    startMileage: { type: Number },
    endMileage: { type: Number },
    fconsumedFuel: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
