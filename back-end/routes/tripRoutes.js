const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

const {Authenticated} =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.post("/", Authenticated, AuthorizedRole("Admin"), tripController.create);

router.get("/", Authenticated, tripController.getAll); 

router.get("/:id", Authenticated, tripController.getById);


router.put("/:id", Authenticated, tripController.update);


// router.get("/:id/pdf", Authenticated, AuthorizedRole("Driver"), tripController.downloadPDF);

router.delete("/:id", Authenticated, AuthorizedRole("Admin"), tripController.deleteTrip);

module.exports = router;
