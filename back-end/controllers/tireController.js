// controllers/tireController.js
const tireService = require("../services/tireService");

async function create(req, res) {
  try {
    const tire = await tireService.create(req.body);
    return res.status(200).json({ tire });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

async function getAll(req, res) {
  try {
    const tires = await tireService.getAll(req.query);
    return res.status(200).json({ tires });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const tire = await tireService.getOne(req.params.id);
    return res.status(200).json(tire);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const tire = await tireService.update(req.params.id, req.body);
    return res.status(200).json({ message: "Tire updated successfully", tire });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

async function deleteTire(req, res) {
  try {
    const tire = await tireService.deleteTire(req.params.id);
    return res.status(200).json({ message: "Tire deleted successfully", tire });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteTire,
  // attachToTruck,
  // detachFromTruck,
  // attachToTrailer,
  // detachFromTrailer,
};
