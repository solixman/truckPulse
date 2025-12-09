const truckService = require("../services/truckService");

async function create(req, res) {
  try {
    const truck = await truckService.create(req.body);

    return res.status(200).json({ truck });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

async function getAll(req, res) {
  try {
    const filters = {
      licensePlate: req.query.licensePlate,
      model: req.query.model,
      mileage: req.query.mileage,
      status: req.query.status,
    };

    const trucks = await truckService.getAll(filters, parseInt(req.query.skip));

    return res.status(200).json({ trucks });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const truckId = req.params.id;

    const truck = await truckService.update(truckId, req.body);

    return res.status(200).json({
      message: "truck updated succesfully",
      truck,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: err.message });
  }
}

async function deleteTruck(req,res) {
  try {
    const truckId = req.params.id;
    const truck = await truckService.deleteTruck(truckId);
   
    return res
      .status(200)
      .json({ truck, message: "truck deleted successfully" });

  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
}

module.exports = { create, getAll, update, deleteTruck };
