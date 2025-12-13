const maintenanceServie = require("../services/maintenanceServie");

async function getAll(req, res) {
  try {
    const rules = await maintenanceServie.getAll();

    return res.status(200).json({ rules });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function create(req, res) {
  try {
    const rule = await maintenanceServie.create(req.body);

    res.status(201).json({
      message: "rule created succesfully",
      rule,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const rule = await maintenanceServie.update(id, req.body);

    return res.status(201).json({
      rule,
      message: "Maintenance rule updated succesfully",
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getAll,update,create };
