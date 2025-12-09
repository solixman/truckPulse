const TruckService = require('../services/truckService')


export async function create(req,res) {
  try {
   
    const truck = await TruckService.create(req.body);
    
    return res.status(200).json({truck});

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: err.message });
  }
}


export async function getAll(req,res){
try {

    const filters={
    licensePlate:req.query.licensePlate,
    model:req.query.model,
    mileage:req.query.mileage,
    status:req.query.status,
    }

   const trucks = await TruckService.getAll(filters,req.body)
  return res.status(200).json({trucks});
} catch (error) {
    console.log(error);
    res.status(400).json({ message: err.message });
}
}

//tzqting

export async function getAll(req,res){
try {

    const filters={
    licensePlate:req.query.licensePlate,
    model:req.query.model,
    mileage:req.query.mileage,
    status:req.query.status,
    }

   const trucks = await TruckService.getAll(filters,req.body)
  return res.status(200).json({trucks});
} catch (error) {
    console.log(error);
    res.status(400).json({ message: err.message });
}
}