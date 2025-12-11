const Truck = require("../models/Truck");
const Tire = require("../models/Tire");
const { removeDuplicates } = require("../utils/tireUtils");

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


async function attachTires(truckId, tireIds) {
  try {
    const truck = await Truck.findById(truckId);
    if (!truck) throw new Error("Truck not found");

    let tires = await Tire.find({ _id: { $in: tireIds } });
    if (tires.length !== tireIds.length) throw new Error("Some tires were not found");

    const alreadyMounted = tires.filter((t) => t.status === "mounted");
    if (alreadyMounted.length > 0) throw new Error("Some tires are already mounted");

    tires = removeDuplicates(tires);

    const MAX_TIRES = 6; 
    const some = truck.tires.length + tires.length;
    if (some > MAX_TIRES)
      throw new Error(
        `Truck tire limit exceeded (${MAX_TIRES} max). Current: ${truck.tires.length}, adding: ${tires.length}`
      );

    tires.forEach((t) => {
      if (!truck.tires.includes(t._id)) truck.tires.push(t._id);
      t.status = "mounted";
    });

    await Promise.all([truck.save(), ...tires.map((t) => t.save())]);

    return truck;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function detachTire(truckId, tireId) {
  try {
    const truck = await Truck.findById(truckId);
    if (!truck) throw new Error("Truck not found");

    const tire = await Tire.findById(tireId);
    if (!tire) throw new Error("Tire not found");

    truck.tires = truck.tires.filter((id) => id.toString() !== tireId);
    tire.status = "inStorage";

    await Promise.all([truck.save(), tire.save()]);

    return { truck, tire };
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = { create, getAll, update, deleteTruck,getOne, attachTires, detachTire };
