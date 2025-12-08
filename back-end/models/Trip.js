const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    startingPoint: { type: String, required: true },
    destination: { type: String, required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    trailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
    status: { type: String, enum: ['à faire', 'en cours', 'terminé'], default: 'à faire' },
    startMileage: { type: Number },
    endMileage: { type: Number },
    fuel: { type: Number },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
