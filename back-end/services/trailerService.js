const Tire = require("../models/Tire");
const Trailer = require("../models/Trailer");
const { removeDuplicates } = require("../utils/tireUtils");


async function create({
  licensePlate,
  model,
  status = "available",
  tires = [],
  lastMaintenanceDate = null,
}) {
  try {
    const exists = await Trailer.findOne({ licensePlate });
    if (exists) throw new Error("License plate already exists");

    const trailer = await Trailer.create({
      licensePlate,
      model,
      status,
      tires,
      lastMaintenanceDate,
    });

    return trailer;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAll(filters = {}, skip = 0) {
  try {
    const query = makeQuery(filters);

    const trailers = await Trailer.find(query).limit(15).skip(skip);

    return trailers;
  } catch (error) {
    throw new Error(error.message);
  }
}

function makeQuery(filters) {
  try {
    const query = {};

    if (filters.licensePlate) query.licensePlate = filters.licensePlate;
    if (filters.model) query.model = filters.model;
    if (filters.status) query.status = filters.status;
    if (filters.lastMaintenanceDate)
      query.lastMaintenanceDate = filters.lastMaintenanceDate;

    return query;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOne(id) {
  try {
    const trailer = await Trailer.findById(id);
    if (!trailer) throw new Error("Trailer not found");
    return trailer;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function update(id, data) {
  try {
    const trailer = await Trailer.findById(id);
    if (!trailer) throw new Error("Trailer not found");

    if (data.licensePlate && data.licensePlate !== trailer.licensePlate) {
      const exists = await Trailer.findOne({ licensePlate: data.licensePlate });
      if (exists) throw new Error("License plate already exists");
      trailer.licensePlate = data.licensePlate;
    }

    if (data.model) trailer.model = data.model;
    if (data.status) trailer.status = data.status;
    if (data.tires) trailer.tires = data.tires;
    if (data.lastMaintenanceDate)
      trailer.lastMaintenanceDate = data.lastMaintenanceDate;

    await trailer.save();
    return trailer;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteTrailer(id) {
  try {
    const trailer = await Trailer.findByIdAndDelete(id);
    if (!trailer) throw new Error("Trailer not found");
    return trailer;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function attachTires(trailerId, tireIds) {
  try {
    const trailer = await Trailer.findById(trailerId);
    if (!trailer) throw new Error("trailer not found");

    const tires = await Tire.find({ _id: { $in: tireIds } });
    if (tires.length !== tireIds.length)
      throw new Error("Some tires were not found");

    const alreadyMounted = tires.filter((t) => t.status === "mounted");
    if (alreadyMounted.length > 0)
      throw new Error("Some tires are already mounted");

    tires = removeDuplicates();

    const MAX_TIRES = 8;
    const totalAfterAdd = trailer.tires.length + tires.length;

    if (totalAfterAdd > MAX_TIRES) {
      throw new Error(
        `Trailer tire limit exceeded (${MAX_TIRES} max). Current: ${trailer.tires.length},adding: ${tires.length},please detach some and retry`
      );
    }

    tires.forEach((t) => {
      if (!trailer.tires.includes(t._id)) {
        trailer.tires.push(t._id);
      }
      t.status = "mounted";
    });

    await Promise.all([trailer.save(), ...tires.map((t) => t.save())]);

    return trailer;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function detachTire(trailerId, tireId) {
  try {
    const trailer = await Trailer.findById(trailerId);
    if (!trailer) throw new Error("Trailer not found");

    const tire = await Tire.findById(tireId);
    if (!tire) throw new Error("Tire not found");

    trailer.tires = trailer.tires.filter((id) => id.toString() !== tireId);
    tire.status = "inStorage";

    await Promise.all([trailer.save(), tire.save()]);

    return { trailer, tire };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteTrailer,
  detachTire,
  attachTires,
};
