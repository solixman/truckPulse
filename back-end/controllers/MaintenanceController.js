const maintenanceServie = require('../services/maintenanceServie')


async function getAll(req,res){
try {
    
 const rules = maintenanceServie.getAll();

 return res.status(200).json({rules});

} catch (error) {
 console.log(error);
 return res.status(400).json({error:error.message})   
}
}

async function create(res,req){
try {
    
    const rule = await maintenanceServie.create(req.body)

    res.status(201).json({
        message:'rule created succesfully',
        rule
    }) 

} catch (error) {
    console.log(error);
    res.status(400).json({message:error.message})
}

}



module.exports = {getAll}