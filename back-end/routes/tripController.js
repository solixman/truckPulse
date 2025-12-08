const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

const Authenticated =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.post("/", Authenticated, AuthorizedRole("Admin"), tripController.createTrip);
router.get("/", Authenticated, tripController.getAllTrips); 
router.get("/:id", Authenticated, tripController.getTripById);

// Chauffeur 
router.put("/:id/status", Authenticated, AuthorizedRole("Chauffeur"), tripController.updateStatus);
router.put("/:id/progress", Authenticated, AuthorizedRole("Chauffeur"), tripController.updateProgress);

// Chauffeur  PDF
router.get("/:id/pdf", Authenticated, AuthorizedRole("Chauffeur"), tripController.downloadPDF);

router.delete("/:id", Authenticated, AuthorizedRole("Admin"), tripController.deleteTrip);

module.exports = router;
