const express = require("express");
const router = express.Router();
const tireController = require("../controllers/tireController");
const { Authenticated } = require("../middlewares/Authenticated");
const AuthorizedRole = require("../middlewares/AuthorizedRole");
const { body, param, query, validationResult } = require("express-validator");


const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

router.post(
  "/",
  Authenticated,
  AuthorizedRole("Admin"),
  validate([
    body("brand").notEmpty().withMessage("Brand is required"),
    body("size").notEmpty().withMessage("Size is required"),
    body("status")
      .optional()
      .isIn(["mounted", "inStorage", "needToBeReplaced", "replaced"])
      .withMessage("Invalid status"),
    body("wearLevel")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Wear level must be between 0 and 100"),
  ]),
  tireController.create
);

router.get(
  "/",
  Authenticated,
  AuthorizedRole("Admin"),
  validate([
    query("brand").optional().isString(),
    query("size").optional().isString(),
    query("status")
      .optional()
      .isIn(["mounted", "inStorage", "needToBeReplaced", "replaced"])
      .withMessage("Invalid status filter"),
  ]),
  tireController.getAll
);


router.get(
  "/:id",
  Authenticated,
  AuthorizedRole("Admin"),
  validate([param("id").isMongoId().withMessage("Invalid tire ID")]),
  tireController.getById
);

router.put(
  "/:id",
  Authenticated,
  AuthorizedRole("Admin"),
  validate([
    param("id").isMongoId().withMessage("Invalid tire ID"),
    body("brand").optional().notEmpty().withMessage("Brand cannot be empty"),
    body("size").optional().notEmpty().withMessage("Size cannot be empty"),
    body("status")
      .optional()
      .isIn(["mounted", "inStorage", "needToBeReplaced", "replaced"])
      .withMessage("Invalid status"),
    body("wearLevel")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Wear level must be between 0 and 100"),
  ]),
  tireController.update
);


router.delete(
  "/:id",
  Authenticated,
  AuthorizedRole("Admin"),
  validate([param("id").isMongoId().withMessage("Invalid tire ID")]),
  tireController.deleteTire
);

module.exports = router;
