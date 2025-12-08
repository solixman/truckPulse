const {Schema,model}=require('mongoose');

const truckSchema = new Schema(
  {
    licensePlate: { type: String, required: true, unique: true },
    model: { type: String },
    status:{type:string},
    mileage: { type: Number, default: 0 },
    fuelConsumed: { type: Number, default: 0 },
    tires: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tire" }],
  },
  { timestamps: true }
);

module.exports = model("Truck", truckSchema);
