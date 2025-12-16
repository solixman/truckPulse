const User = require("../models/User");

async function getDrivers() {
  try {
    const drivers = await User.find({ role: "Driver" }).select("_id username name email role");
    return drivers;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { getDrivers };
