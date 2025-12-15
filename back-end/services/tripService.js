const Trip = require("../models/Trip");
const truckService = require("../services/truckService");
const trailerService = require("../services/trailerService");
const maintenanceService = require("../services/maintenanceServie");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Truck = require("../models/Truck");
const mongoose = require("mongoose");

async function create(data) {
  try {
    if (data.status) data.status = undefined;
    const trip = await Trip.create(data);
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAll(user, filters, skip = 0) {
  try {
    if (user.role === "Driver") {
      // Find all trucks assigned to this driver
      const trucks = await Truck.find({ driver: user.id }).select("_id");

      if (!trucks.length) return [];

      const truckIds = trucks.map((t) => t._id);

      // Get trips for these trucks with toDo or inProgress
      const trips = await Trip.find({
        truck: { $in: truckIds },
        status: { $in: ["toDo", "inProgress"] },
      })
        .populate({
          path: "truck",
          populate: { path: "driver", select: "name email _id" },
        })
        .populate("trailer")
        .limit(15)
        .skip(skip);

      return trips;
    } else {
      // Admin: apply filters if provided
      const query = {};
      if (filters.trailer) query.trailer = filters.trailer;
      if (filters.startingPoint) query.startingPoint = filters.startingPoint;
      if (filters.destination) query.destination = filters.destination;
      if (filters.status) query.status = filters.status;

      const trips = await Trip.find(query)
        .populate({
          path: "truck",
          populate: { path: "driver", select: "name email _id" },
        })
        .populate("trailer")
        .limit(15)
        .skip(skip);

      return trips;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}





async function getOne(id) {
  try {
    const trip = await Trip.findById(id).populate("truck").populate("trailer");
    console.log(trip);
    if (!trip) throw new Error("Trip not found");
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function update(user, id, data) {
  try {
    let trip = await getOne(id);

    if (data.startingPoint) trip.startingPoint = data.startingPoint;
    if (data.destination) trip.destination = data.destination;
    if (data.startDate) trip.startDate = data.startDate;
    if (data.startMileage) trip.startMileage = data.startMileage;
    if (data.notes) trip.notes = data.notes;
    if (data.hasOwnProperty("truck")) trip.truck = data.truck;
    if (data.hasOwnProperty("trailer")) trip.trailer = data.trailer;

    if (data.status) trip = await changeStatus(user, data.status, trip);

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
    trip.startMileage = truck.mileage;
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

          return trip;

        case "done":
          if (trip.status != "inProgress")
            throw new Error(
              `can't change trip status from ${trip.status} to ${status}`
            );

          trip.status = status;
          trip.truck.status = "unavailable";
          trip.trailer.status = "unavailable";

          return trip;

        case "inProgress":
          if (trip.status != "toDo")
            throw new Error(
              `can't change trip status from ${trip.status} to ${status}`
            );

          trip.status = status;
          trip.truck.status = "OnTrip";
          trip.trailer.status = "OnTrip";

          await Promise.all([trip.truck.save(), trip.trailer.save()]);

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

          return trip;

        default:
          throw new Error(`Unknown status: ${status}`);
          break;
      }
    } else {
      return trip;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

async function assignTrailer(id, trailerId) {
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
  { startMileage, endMileage, consumedFuel, notes, status }
) {
  try {
    let trip = await getOne(id);
   
    if (trip.truck.driver.toString() !== user.id) throw new Error("this trip is not assign to you, you can't update it");


    if (startMileage) trip.startMileage = startMileage;
    if (endMileage) trip.endMileage = endMileage;
    if (consumedFuel) trip.consumedFuel = consumedFuel;
    if (notes) trip.notes = notes;
    if (status) trip = await changeStatus(user, status, trip);

    if (endMileage && status === "done") {
      await maintenanceService.applyMaintenance(trip.truck, trip.trailer, trip);
    }

    await trip.save();
    return trip;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function generatePDF(user, tripId) {
  try {
    const trip = await getOne(tripId);

    if (!trip.truck || trip.truck.driver.toString() !== user.id) {
      throw new Error("This trip is not assigned to you");
    }

    const pdfDir = path.join(__dirname, "../pdfs");

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const filePath = path.join(pdfDir, `trip_${tripId}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Trip Details", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Trip ID: ${trip._id}`);
    doc.text(`Starting Point: ${trip.startingPoint}`);
    doc.text(`Destination: ${trip.destination}`);
    doc.text(`Start Date: ${trip.startDate}`);
    doc.text(`Start Mileage: ${trip.startMileage}`);
    doc.text(`Truck: ${trip.truck.model || trip.truck._id}`);
    doc.text(
      `Trailer: ${
        trip.trailer ? trip.trailer.model || trip.trailer._id : "N/A"
      }`
    );
    doc.text(`Status: ${trip.status}`);
    doc.text(`Notes: ${trip.notes || "None"}`);

    doc.end();

    return filePath;
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
  assignTrailer,
  updateByDriver,
  changeStatus,
  generatePDF,
};
