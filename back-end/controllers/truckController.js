


export async function create(req,res) {
  try {
   
    const truck = await TruckService.create(req.body);
    
    return res.status(200).json({truck});

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: err.message });
  }
}
