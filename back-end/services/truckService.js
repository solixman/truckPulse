const Truck= require('../models/Truck')


async function create({licensePlate,model,mileage,status="available",currentFuel=0,tiers=null}){
    try {
        const truck = await Truck.create({licensePlate,model,mileage,status,currentFuel});

      if (tiers !== null) {
    console.log("assign tires");
}

        return truck  
    } catch (error) {
        throw new Error(error.message)
    }
}


async function getAll(filters,skip){
    try {

    const query = makeQuery(filters);

    const trucks = await Truck.find(query).limit(15).skip(skip);;
    
 return trucks 
} catch (error) {
            throw new Error(error.message)
}

}



function makeQuery(filters){
    try {
      let query={};

        if(filters.licensePlate){
            query.licensePlate=filters.licensePlate;
            return query ;
        }

        if(filters.model) query.model=filters.model
        if(filters.mileage) query.mileage=filters.mileage
        if(filters.currentFuel) query.currentFuel=filters.currentFuel
        if(filters.status) query.status=filters.status;
        
        return query;

    } catch (error) {
        throw new Error(error.message);
    }

}


module.exports= {create,getAll}