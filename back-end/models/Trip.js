const mongoose = require("mongoose");

const STATUS = ["draft","toDo", "done", "canceled", "inProgress"];

const tripSchema = new mongoose.Schema(
  {
    startingPoint: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date},
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    trailer: { type: mongoose.Schema.Types.ObjectId, ref: "Trailer" },
    status: {
      type: String,
      enum: STATUS,
      default:"draft"
    },
    startMileage: { type: Number },
    endMileage: { type: Number },
    consumedFuel: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
