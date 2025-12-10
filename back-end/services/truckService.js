const Truck = require("../models/Truck");

async function create({
  licensePlate,
  model,
  mileage,
  status = "available",
  currentFuel = 0,
  tiers = null,
}) {
  try {
    const exists = await checkPlate(licensePlate);
    if (exists) {
      throw new Error("License plate already exists");
    }

    const truck = await Truck.create({
      licensePlate,
      model,
      mileage,
      status,
      currentFuel,
    });

    if (tiers !== null) {
      console.log("assign tires");
    }

    return truck;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAll(filters, skip) {
  try {
    const query = makeQuery(filters);

    const trucks = await Truck.find(query).limit(15).skip(skip);

    return trucks;
  } catch (error) {
    throw new Error(error.message);
  }
}

function makeQuery(filters) {
  try {
    let query = {};

    if (filters.licensePlate) {
      query.licensePlate = filters.licensePlate;
      return query;
    }

    if (filters.model) query.model = filters.model;
    if (filters.mileage) query.mileage = filters.mileage;
    if (filters.currentFuel) query.currentFuel = filters.currentFuel;
    if (filters.status) query.status = filters.status;

    return query;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function update(id, data) {
  try {
    let truck = await Truck.findById(id);

    if (data.licensePlate != truck.licensePlate) {
      const exists = await checkPlate(data.licensePlate);
      if (exists) {
        throw new Error("License plate already exists");
      }
    }

    if (!truck)
      throw new Error("something went wrong, this truck doesn't exist");

    if (truck.status === "completed")
      throw new Error(" this truck has already been completed");

    if (data.licensePlate) truck.licensePlate = data.licensePlate;
    if (data.model) truck.model = data.model;
    if (data.status) truck.status = data.status;
    if (data.currentFuel) truck.currentFuel = data.currentFuel;

    truck = await truck.save();

    return truck;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function checkPlate(licensePlate) {
  try {
    const existingTruck = await Truck.findOne({ licensePlate });
    if (existingTruck) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteTruck(id) {
  try {
    const truck = await Truck.findByIdAndDelete(id);

    if (!truck) {
      throw new Error("Truck not found");
    }

   return truck;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOne(id){
try {
  
   const truck = await Truck.findById(id);

    if (!truck) {
      throw new Error("Truck not found");
    }

  return truck;

} catch (error) {
  throw new Error(error.message)
}

}

module.exports = { create, getAll, update, deleteTruck,getOne };
