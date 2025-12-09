const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

const Authenticated =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.post("/", Authenticated(req,res,next), AuthorizedRole("Admin"), tripController.createTrip(req,res));
router.get("/", Authenticated(req,res,next), tripController.getAllTrips(req,res)); 
router.get("/:id", Authenticated(req,res,next), tripController.getTripById(req,res));

// Chauffeur 
router.put("/:id/status", Authenticated(req,res,next), AuthorizedRole("Chauffeur"), tripController.updateStatus(req,res));
router.put("/:id/progress", Authenticated(req,res,next), AuthorizedRole("Chauffeur"), tripController.updateProgress(req,res));

// Chauffeur  PDF
router.get("/:id/pdf", Authenticated(req,res,next), AuthorizedRole("Chauffeur"), tripController.downloadPDF(req,res));

router.delete("/:id", Authenticated(req,res,next), AuthorizedRole("Admin"), tripController.deleteTrip(req,res));

module.exports = router;
