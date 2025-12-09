import Truck from "../models/Truck"



export async function create({licensePlate,model,mileage,currentFuel=0,tiers=null}){

    try {
        const truck = await Truck.create({licensePlate,model,mileage,currentFuel});

        if(tiers=!null){
            console.log("assign tiers");
        }
          return truck  
    } catch (error) {
        throw new Error(error.message)
    }

}