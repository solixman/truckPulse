const tireService = require("../services/tireService");

async function create(req, res) {
  try {
    const tire = await tireService.create(req.body);
    return res.status(200).json({ tire });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function getAll(req, res) {
  try {
    const filters = {
      brand: req.query.brand,
      size: req.query.size,
      status: req.query.status,
      wearLevel: req.query.wearLevel ? parseInt(req.query.wearLevel) : undefined,
    };

    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    const tires = await tireService.getAll(filters, skip);

    return res.status(200).json({ tires });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const tire = await tireService.getOne(id);

    return res.status(200).json(tire);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const tire = await tireService.update(id, req.body);

    return res.status(200).json({ message: "Tire updated successfully", tire });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteTire(req, res) {
  try {
    const id = req.params.id;
    const tire = await tireService.deleteTire(id);

    return res.status(200).json({ message: "Tire deleted successfully", tire });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { create, getAll, getById, update, deleteTire };
