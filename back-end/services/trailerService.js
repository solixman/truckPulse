

const Trailer = require("../models/Trailer");

async function create({
  licensePlate,
  model,
  status = "available",
  attachedTruck = null,
}) {
  const exists = await Trailer.findOne({ licensePlate });
  if (exists) throw new Error("License plate already exists");

  const trailer = await Trailer.create({
    licensePlate,
    model,
    status,
    attachedTruck,
  });
  return trailer;
}

async function getAll(filters = {}, skip = 0) {
  const query = {};
  if (filters.licensePlate) query.licensePlate = filters.licensePlate;
  if (filters.model) query.model = filters.model;
  if (filters.status) query.status = filters.status;
  if (filters.attachedTruck) query.attachedTruck = filters.attachedTruck;

  const trailers = await Trailer.find(query).limit(15).skip(skip);
  return trailers;
}

async function getOne(id) {
  const trailer = await Trailer.findById(id);
  if (!trailer) throw new Error("Trailer not found");
  return trailer;
}

async function update(id, data) {
  const trailer = await Trailer.findById(id);
  if (!trailer) throw new Error("Trailer not found");

  if (data.licensePlate && data.licensePlate !== trailer.licensePlate) {
    const exists = await Trailer.findOne({ licensePlate: data.licensePlate });
    if (exists) throw new Error("License plate already exists");
    trailer.licensePlate = data.licensePlate;
  }

  if (data.model) trailer.model = data.model;
  if (data.status) trailer.status = data.status;
  if (data.attachedTruck !== undefined)
    trailer.attachedTruck = data.attachedTruck;

  await trailer.save();
  return trailer;
}

async function deleteTrailer(id) {
  const trailer = await Trailer.findByIdAndDelete(id);
  if (!trailer) throw new Error("Trailer not found");
  return trailer;
}

module.exports = { create, getAll, getOne, update, deleteTrailer };
