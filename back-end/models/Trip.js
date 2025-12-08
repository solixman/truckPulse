const mongoose = require("mongoose");

const STATUS = ["toDo", "done", "canceled", "inProgress"];

const tripSchema = new mongoose.Schema(
  {
    startingPoint: { type: String, required: true },
    destination: { type: String, required: true },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    trailer: { type: mongoose.Schema.Types.ObjectId, ref: "Trailer" },
    status: {
      type: String,
      enum: STATUS,
    },
    startMileage: { type: Number },
    endMileage: { type: Number },
    fuel: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
