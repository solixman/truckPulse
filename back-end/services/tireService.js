const Tire = require("../models/Tire");
const Truck = require("../models/Truck");
const Trailer = require("../models/Trailer");

async function create(data) {
  const tire = await Tire.create(data);
  return tire;
}

async function getAll(filters = {}) {
  const query = {};
  if (filters.brand) query.brand = filters.brand;
  if (filters.size) query.size = filters.size;
  if (filters.status) query.status = filters.status;

  const tires = await Tire.find(query);
  return tires;
}

async function getOne(id) {
  const tire = await Tire.findById(id);
  if (!tire) throw new Error("Tire not found");
  return tire;
}

async function update(id, data) {
  const tire = await Tire.findById(id);
  if (!tire) throw new Error("Tire not found");

  if (data.brand) tire.brand = data.brand;
  if (data.size) tire.size = data.size;
  if (data.status && !["mounted", "inStorage", "needToBeReplaced", "replaced"].includes(data.status)) {
    throw new Error("Invalid status");
  }
  if (data.status) tire.status = data.status;
  if (data.wearLevel != null) tire.wearLevel = data.wearLevel;

  await tire.save();
  return tire;
}

async function deleteTire(id) {
  const tire = await Tire.findByIdAndDelete(id);
  if (!tire) throw new Error("Tire not found");
  return tire;
}



module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteTire,
  // attachTireToTruck,
  // detachTireFromTruck,
  // attachTireToTrailer,
  // detachTireFromTrailer,
};
