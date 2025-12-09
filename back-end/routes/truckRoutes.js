const express = require('express')
const router=express.Router();
const truckController=require('../controllers/truckController')
const {Authenticated} =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');



router.post('/',Authenticated,AuthorizedRole('Admin'),truckController.create);
router.get('/',Authenticated,AuthorizedRole('Admin'),truckController.getAll);
// router.get('/:id',Authenticated,AuthorizedRole('Admin'),truckController.getTruckById);
router.put('/:id',Authenticated,AuthorizedRole('Admin'),truckController.update);
router.delete("/:id", Authenticated, AuthorizedRole("Admin"), truckController.deleteTruck);

module.exports = router