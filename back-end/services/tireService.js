const Tire = require("../models/Tire");

async function create({ brand, size, wearLevel = 0, status = "inStorage", lastReplacedAt = null }) {
  try {
    const tire = await Tire.create({
      brand,
      size,
      wearLevel,
      status,
      lastReplacedAt,
    });

    return tire;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAll(filters, skip = 0) {
  try {
    const query = makeQuery(filters);

    const tires = await Tire.find(query).limit(15).skip(skip);

    return tires;
  } catch (error) {
    throw new Error(error.message);
  }
}

function makeQuery(filters) {
  try {
    let query = {};

    if (filters.brand) query.brand = filters.brand;
    if (filters.size) query.size = filters.size;
    if (filters.status) query.status = filters.status;
    if (filters.wearLevel != null) query.wearLevel = filters.wearLevel;

    return query;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function update(id, data) {
  try {
    let tire = await Tire.findById(id);

    if (!tire) throw new Error("Tire not found");

    if (data.brand) tire.brand = data.brand;
    if (data.size) tire.size = data.size;
    if (data.status && !["mounted", "inStorage", "ToBeReplaced", "replaced"].includes(data.status)) {
      throw new Error("Invalid status");
    }
    if (data.status) tire.status = data.status;
    if (data.wearLevel != null) tire.wearLevel = data.wearLevel;
    if (data.lastReplacedAt) tire.lastReplacedAt = data.lastReplacedAt;

    tire = await tire.save();

    return tire;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteTire(id) {
  try {
    const tire = await Tire.findByIdAndDelete(id);

    if (!tire) throw new Error("Tire not found");

    return tire;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOne(id) {
  try {
    const tire = await Tire.findById(id);

    if (!tire) throw new Error("Tire not found");

    return tire;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { create, getAll, update, deleteTire, getOne };
