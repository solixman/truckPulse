const tripService = require("../services/tripService");

async function create(req, res) {
  try {
    const trip = await tripService.create(req.body);
    return res.status(200).json({ trip });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function getAll(req, res) {
  try {
    const filters = {
      status: req.query.status,
      truck: req.query.truck,
      trailer: req.query.trailer,
      startingPoint: req.query.startingPoint,
      destination: req.query.destination,
    };
    
    const skip = parseInt(req.query.skip) || 0;
    const trips = await tripService.getAll(filters, skip);
    return res.status(200).json({ trips });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const trip = await tripService.getOne(id);
    return res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const trip = await tripService.update(id, req.body);
    return res.status(200).json({ message: "Trip updated successfully", trip });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteTrip(req, res) {
  try {
    const id = req.params.id;
    const trip = await tripService.deleteTrip(id);
    return res.status(200).json({ message: "Trip deleted successfully", trip });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}


async function assignTruck(req, res) {
  try {
    const id = req.params.id;
    const truckId = req.body.truckId;

    const result = await tripService.assignTruck(id, truckId);

    return res.status(200).json({
      trip: result.trip,
      truck: result.truck,
      message: "Truck assigned successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}



module.exports = { create, getAll, getById, update, deleteTrip,assignTruck};
