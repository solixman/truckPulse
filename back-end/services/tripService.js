const Trip = require("../models/Trip");
const truckService = require("../services/truckService");
const trailerService = require("../services/trailerService");

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

async function update(user,id, data) {
  try {
    const trip = await getOne(id);

    if (data.startingPoint) trip.startingPoint = data.startingPoint;
    if (data.destination) trip.destination = data.destination;
    if (data.startDate) trip.startDate = data.startDate;  
    if (data.startMileage) trip.startMileage = data.startMileage;
    if (data.notes) trip.notes = data.notes;
    if (data.truck) trip.truck = data.truck;
    if (data.trailer) trip.trailer = data.trailer;
    if (data.status) trip = await changeStatus(user,data.status,trip);

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

async function changeStatus(user, status, trip) {
  try {
    if (user.role == "Driver" && status != "done" && status != "inProgress")
      throw new Error("as a driver you can't change status to " + status);

    if (trip.status !== status) {
      //todo
      switch (status) {
        case "toDo":
          if (trip.status != "draft")
            throw new Error(
              `can't change trip status from ${trip.status} to ${status}`
            );

          const result = isReady(trip);
          if (!result.ok) throw new Error(result.error);

          trip.status = status;
          await trip.save();

          return trip;

        case "done":
          if (trip.status != "inProgress")
            throw new Error(
              `can't change trip status from ${trip.status} to ${status}`
            );

          trip.status = status;
          trip.truck.status = "unavailable";
          trip.trailer.status = "unavailable";

          await Promise.all([
            trip.save(),
            trip.truck.save(),
            trip.trailer.save(),
          ]);

          return trip;

        case "inProgress":
          if (trip.status != "toDo")
            throw new Error(
              `can't change trip status from ${trip.status} to ${status}`
            );

          trip.status = status;
          trip.truck.status = "OnTrip";
          trip.trailer.status = "OnTrip";

          await Promise.all([
            trip.save(),
            trip.truck.save(),
            trip.trailer.save(),
          ]);

          return trip;

        case "canceled":
          if (trip.status == "inProgress" || trip.status == "done")
            throw new Error(
              `can't change trip status from ${trip.status} to ${status}`
            );

          if (trip.truck) {
            trip.truck.status = "available";
            await trip.truck.save();
            trip.truck = null;
          }

          if (trip.trailer) {
            trip.trailer.status = "available";
            await trip.trailer.save();
            trip.trailer = null;
          }

          trip.status = status;
          await trip.save();
          return trip;

        default:
          break;
      }

      await trip.save();

      return trip;
    } else {
      return trip;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

async function assigntrailer(id, trailerId) {
  try {
    const trip = await getOne(id);
    const trailer = await trailerService.getOne(trailerId);

    if (trip.trailer)
      throw new Error("This trip already has a trailer assigned");

    if (trailer.status != "available")
      throw new Error(`can't sign this trailer it's${trailer.status}`);

    trip.trailer = trailer._id;
    trailer.status = "unavailable";
    await Promise.all([trailer.save(), trip.save()]);
    return { trip, trailer };
  } catch (error) {
    throw new Error(error.message);
  }
}

function isReady(trip) {
  if (trip.truck == null || trip.trailer == null) {
    return {
      ok: false,
      error:
        "to change a trip to toDo a trailer and truck that should be asssigned to it",
    };
  } else {
    const truckStatus = trip.truck.status;
    const trailerStatus = trip.trailer.status;

    if (truckStatus == "inMaintenance") {
      return { ok: false, error: "this trip's truck is in maintenance" };
    } else if (trailerStatus == "inMaintenance") {
      return { ok: false, error: "this trip's trailer is in maintenance" };
    }
  }
  return { ok: true };
}

async function updateByDriver(
  user,
  id,
  { startMileage, endMileage, consumedFuel, notes,status }
) {
  try {
    let trip = await getOne(id);

    if (trip.truck.driver !== user.id)
      throw new Error("this trip is not assign to you, you can't update it");

    if (startMileage) trip.startMileage = startMileage;
    if (endMileage) trip.endMileage = endMileage;
    if (consumedFuel) trip.consumedFuel = consumedFuel;
    if (notes) trip.notes = notes;
    if (status) trip = await  changeStatus(user,status,trip);;

    return trip;
    
  } catch (error) {

  throw new Error(error.message);
  }

}


module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteTrip,
  assignTruck,
  assigntrailer,
  updateByDriver,
  changeStatus,
};
