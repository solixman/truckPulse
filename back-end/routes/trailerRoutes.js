const express = require("express");
const router = express.Router();
const trailerController = require("../controllers/trailerController");

const {Authenticated} =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.post("/", Authenticated, AuthorizedRole("Admin"), trailerController.create);
router.get("/", Authenticated, AuthorizedRole("Admin"), trailerController.getAll);
router.get("/:id", Authenticated, AuthorizedRole("Admin"), trailerController.getById);
router.put("/:id", Authenticated, AuthorizedRole("Admin"), trailerController.update);
router.delete("/:id", Authenticated, AuthorizedRole("Admin"), trailerController.deleteTrailer);

module.exports = router;
