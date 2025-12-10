const express = require("express");
const router = express.Router();
const tireController = require("../controllers/tireController");
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");

router.post("/", authenticateJWT, authorizeRole("Admin"), tireController.create);
router.get("/", authenticateJWT, authorizeRole("Admin"), tireController.getAll);
router.get("/:id", authenticateJWT, authorizeRole("Admin"), tireController.getById);
router.put("/:id", authenticateJWT, authorizeRole("Admin"), tireController.update);
router.delete("/:id", authenticateJWT, authorizeRole("Admin"), Controller.delete);


module.exports = router;