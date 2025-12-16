const userService = require("../services/userService");

async function getDrivers(req, res) {
  try {
    const drivers = await userService.getDrivers();
    return res.status(200).json({ users: drivers });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getDrivers };
