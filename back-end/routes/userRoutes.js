const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {Authenticated} =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.get("/drivers", Authenticated, AuthorizedRole("Admin"), userController.getDrivers);


module.exports = router;
