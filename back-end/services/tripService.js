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

async function assignTruck(id, truckId) {
  try {
    const trip = await getOne(id);
    const truck = await truckService.getOne(truckId);

    if (trip.truck) throw new Error("This trip already has a truck assigned");

    if (truck.status != "available")
      throw new Error(`can't sign this truck it's${truck.status}`);

    trip.truck = truck._id;
    truck.status = "unavailable";
    await Promise.all([truck.save(), trip.save()]);
    return { trip, truck };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function changeStatus(id, status) {
  try {
    let trip = await getOne(id);


    if (trip.status !== status) {
      //todo
      switch (status) {
  case "toDo":
    if (trip.status != "draft")
      throw new Error(`can't change trip status from ${trip.status} to ${status}`);

    const result = isReady(trip);
    if (!result.ok) throw new Error(result.error);

    trip.status = status;
    await trip.save();

    return { message: `trip is ${status}`, trip };

  case "done":
    if (trip.status != "inProgress")
      throw new Error(`can't change trip status from ${trip.status} to ${status}`);

    trip.status = status;
    trip.truck.status = "unavailable";
    trip.trailer.status = "unavailable";

    await Promise.all([trip.save(), trip.truck.save(), trip.trailer.save()]);

    return { message: `trip is succesfully ${status}`, trip };

  case "inProgress":
    if (trip.status != "toDo")
      throw new Error(`can't change trip status from ${trip.status} to ${status}`);

    trip.status = status;
    trip.truck.status = "OnTrip";
    trip.trailer.status = "OnTrip";

    await Promise.all([trip.save(), trip.truck.save(), trip.trailer.save()]);

    return { message: `trip is now  ${status}`, trip };

  case "canceled":
    if (trip.status == "inProgress" || trip.status == "done")
      throw new Error(`can't change trip status from ${trip.status} to ${status}`);

    if (trip.truck) {
      trip.truck.status = "available";
      trip.truck = null;
      await trip.truck.save();
    }

    if (trip.trailer) {
      trip.trailer.status = "available";
      trip.trailer = null;
      await trip.trailer.save();
    }

    trip.status = status;
    await trip.save();
    return { message: `trip is now  ${status}`, trip };

  default:
    break;
}


      return {message: `something went wrong `,trip};

    } else {
      return {message: `trip already ${status}`,trip};
    }

  } catch (error) {
    throw new Error(error.message);
  }
}

function isReady(trip) {

  

  if (trip.truck == null || trip.trailer == null) {

    return {
     ok:false,
     error: "to change a trip to toDo a trailer and truck that should be asssigned to it"
    }
    
  }else {

    const truckStatus = trip.truck.status;
    const trailerStatus = trip.trailer.status;
    
    if (truckStatus == "inMaintenance") {

      return {ok:false,
     error: "this trip's truck is in maintenance"}

    } else if (trailerStatus == "inMaintenance") {

      return {ok:false,
     error: "this trip's trailer is in maintenance"}

    }
  }
  return {ok:true};
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteTrip,
  assignTruck,
  changeStatus,
};
