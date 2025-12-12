const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

const {Authenticated} =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.post("/", Authenticated, AuthorizedRole("Admin"), tripController.create);

router.get("/", Authenticated, tripController.getAll); 

router.get("/:id", Authenticated, tripController.getById);

router.patch("/:id/status",  Authenticated, tripController.changeStatus);

router.put("/:id", Authenticated, tripController.update);

// Driver  PDF

// router.get("/:id/pdf", Authenticated, AuthorizedRole("Driver"), tripController.downloadPDF);

router.delete("/:id", Authenticated, AuthorizedRole("Admin"), tripController.deleteTrip);

module.exports = router;
