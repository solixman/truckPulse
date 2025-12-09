const TruckService = require('../services/truckService')


 async function create(req,res) {
  try {
   
    const truck = await TruckService.create(req.body);
    
    return res.status(200).json({truck});

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}


async function getAll(req,res){
try {

    const filters={
    licensePlate:req.query.licensePlate,
    model:req.query.model,
    mileage:req.query.mileage,
    status:req.query.status,
    }

   const trucks = await TruckService.getAll(filters,parseInt(req.query.skip))

  return res.status(200).json({trucks});
} catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
}
}

module.exports = {create,getAll};