const MaintenanceRules = require("../models/MaintenanceRules");



async function getAll(){
try {

    const rules = await MaintenanceRules.find();
    if(!rules||rules.length<0) throw new Error ('there are no rules ');
    return rules;

} catch (error) {
    throw new Error (error.message);
}
}


module.exports = {getAll}