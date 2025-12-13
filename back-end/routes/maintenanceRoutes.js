const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();

const maintenanceController = require("../controllers/MaintenanceController");


router.get("/", maintenanceController.getAll);


router.post(
  "/",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("kms").isNumeric().withMessage("KMS must be a number"),
    body("days").optional().isNumeric().withMessage("Days must be a number"),
    body("description").optional().isString().withMessage("Description must be a string"),
  ],
  maintenanceController.create
);


router.put(
  "/:id",
  [
    param("id").notEmpty().withMessage("Rule ID is required"),
    body("type").optional().notEmpty(),
    body("kms").optional().isNumeric(),
    body("days").optional().isNumeric(),
    body("description").optional().isString(),
  ],
  maintenanceController.update
);

module.exports = router;
