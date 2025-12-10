const Trailer = require("../models/Trailer");

async function create({
  licensePlate,
  model,
  status = "available",
  tiers = [],
  lastMaintenanceDate = null,
}) {
  try {
    const exists = await Trailer.findOne({ licensePlate });
    if (exists) throw new Error("License plate already exists");

    const trailer = await Trailer.create({
      licensePlate,
      model,
      status,
      tiers,
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
    if (data.tiers) trailer.tiers = data.tiers;
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

module.exports = { create, getAll, getOne, update, deleteTrailer };
