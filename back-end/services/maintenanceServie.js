const MaintenanceRules = require("../models/MaintenanceRules");

async function getAll() {
  try {
    const rules = await MaintenanceRules.find();
    if (!rules || rules.length < 0) throw new Error("there are no rules ");
    return rules;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function create({ type, kms, days, description }) {
  try {
    let rule = new MaintenanceRules();

    if (type) rule.type = type;
    if (kms) rule.kms = kms;
    if (days) rule.days = days;
    if (description) rule.description = description;

    await rule.save();

    return rule;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error(`Rule with this type already exists`);
    }
    throw error;
  }
}



async function update(id,{ type, kms, days, description }) {
  try {

    let rule = await MaintenanceRules.findById(id);
    if(!rule) throw new Error("rule don't exist"); 

     if (type) rule.type = type;
    if (kms) rule.kms = kms;
    if (days) rule.days = days;
    if (description) rule.description = description;

    await rule.save();

    return rule

  } catch (error) {
    if (error.code === 11000) {
      throw new Error(`Rule with this type already exists`);
    }
    throw error;
  }
}

async function applyMaintenance(truck, trailer, trip) {
  try {

   const truckRule = await MaintenanceRules.findOne({ type: "truck" });
   const trailerRule = await MaintenanceRules.findOne({ type: "trailer" });


    const mileageDiff = trip.endMileage - trip.startMileage
      

    if (truck && truckRule && mileageDiff >= truckRule.kms) {
      truck.status = "inMaintenance";
    }

    
    if (trailer && trailerRule && mileageDiff >= trailerRule.kms) {
      trailer.status = "inMaintenance";
    }

    await Promise.all([truck.save(), trailer.save()]);

    return { truck, trailer };
  } catch (error) {
    throw new Error("Error checking maintenance:" + error.message);
  }
}



module.exports = { getAll, update, create ,applyMaintenance,applyMaintenance};