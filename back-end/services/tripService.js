const Trip = require("../models/Trip");
const truckService = require("../services/truckService");


async function create(data) {
  try {
    const trip = await Trip.create(data);
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAll(filters, skip = 0) {
  try {
    let query = {};

    if (filters.status) query.status = filters.status;
    if (filters.truck) query.truck = filters.truck;
    if (filters.trailer) query.trailer = filters.trailer;
    if (filters.startingPoint) query.startingPoint = filters.startingPoint;
    if (filters.destination) query.destination = filters.destination;

    const trips = await Trip.find(query)
      .populate("truck")
      .populate("trailer")
      .limit(15)
      .skip(skip);

    return trips; 
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOne(id) {
  try {
    const trip = await Trip.findById(id).populate("truck").populate("trailer");
    if (!trip) throw new Error("Trip not found");
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function update(id, data) {
  try {
    const trip = await Trip.findById(id);
    if (!trip) throw new Error("Trip not found");

    if (data.startingPoint) trip.startingPoint = data.startingPoint;
    if (data.destination) trip.destination = data.destination;
    if (data.startDate) trip.startDate = data.startDate;
    if (data.status) trip.status = data.status;
    if (data.startMileage) trip.startMileage = data.startMileage;
    if (data.endMileage) trip.endMileage = data.endMileage;
    if (data.consumedFuel) trip.consumedFuel = data.consumedFuel;
    if (data.notes) trip.notes = data.notes;
    if (data.truck) trip.truck = data.truck;
    if (data.trailer) trip.trailer = data.trailer;

    await trip.save();
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteTrip(id) {
  try {
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) throw new Error("Trip not found");
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function assignTruck(id,truckId){
    try {
        
        const trip = await getOne(id);
        const truck = await truckService.getOne(truckId);

       if (trip.truck) throw new Error("This trip already has a truck assigned");

       if(truck.status != "available") throw new Error(`can't sign this truck it's${truck.status}`);

        trip.truck = truck._id;
        truck.status="unavailable";
        await Promise.all([ truck.save(), trip.save()]);  
        return {trip,truck};

    } catch (error) {
         throw new Error(error.message);   
    }
}






module.exports = { create, getAll, getOne, update, deleteTrip, assignTruck };
