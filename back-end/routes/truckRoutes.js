const express = require('express')
const router=express.Router();
const truckController=require('../controllers/truckController')
const Authenticated =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');



router.post('/',Authenticated(req,res,next),AuthorizedRole('Admin'),truckController.create(req,res));
router.get('/',Authenticated(req,res,next),AuthorizedRole('Admin'),truckController.getAll(req,res));
router.get('/:id',Authenticated(req,res,next),AuthorizedRole('Admin'),truckController.getTruckById(req,res));
router.put('/:id',Authenticated(req,res,next),AuthorizedRole('Admin'),truckController.update(req,res));
router.delete("/:id", Authenticated(req,res,next), AuthorizedRole("Admin"), truckController.delete(req,res));
