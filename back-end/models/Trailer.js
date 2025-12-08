const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true },
    model: { type: String },
    status:{type:string},
    attachedTruck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' }
}, { timestamps: true });

module.exports = mongoose.model('Trailer', trailerSchema);
