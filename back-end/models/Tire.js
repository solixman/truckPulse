const mongoose = require('mongoose');

const tireSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    size: { type: String },
    wearLevel: { type: Number, default: 0 },
    status:{type:string},
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    lastReplacedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Tire', tireSchema);
