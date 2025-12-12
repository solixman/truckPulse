const MaintenanceRules = require("../models/MaintenanceRules");



async function getAll(req,res){
try {
    
 const rules = maintenanceServie.getAll();

 return res.status(200).json({rules});

} catch (error) {
 console.log(error);
 return res.status(400).json({error:error.message})   
}
}



module.exports = {getAll}