import Truck from "../models/Truck"



export async function create({licensePlate,model,mileage,status="available",currentFuel=0,tiers=null}){

    try {
        const truck = await Truck.create(filters,{licensePlate,model,mileage,status,currentFuel});
        
        const query = this.makeQuery(filters);

        if(tiers=!null){
            console.log("assign tiers");
        }
          return truck  
    } catch (error) {
        throw new Error(error.message)
    }
}


export async function getAll(){
try {

    const trucks = await Truck.getAll()


} catch (error) {
            throw new Error(error.message)
}

}



export function makeQuery(filters){
    try {
      let query;

        if(filters.licensePlate){
            return query.licensePlate=filters.licensePlate;
        }

        if(filters.model) query.model=filters.model
        if(filters.mileage) query.mileage=filters.mileage
        if(filters.currentFuel) query.currentFuel=filters.currentFuel
        if(filters.status) query.status=filters.status
        0
        return query;

    } catch (error) {
        throw new Error(error.message)
    }

}