const express = require("express");
const router = express.Router();
const trailerController = require("../controllers/trailerController");

const Authenticated =require('../middlewares/Authenticated');
const AuthorizedRole =require('../middlewares/AuthorizedRole');

router.post("/", Authenticated(req,res,next), AuthorizedRole("Admin"), trailerController.create(req,res));
router.get("/", Authenticated(req,res,next), AuthorizedRole("Admin"), trailerController.getAll(req,res));
router.get("/:id", Authenticated(req,res,next), AuthorizedRole("Admin"), trailerController.getById(req,res));
router.put("/:id", Authenticated(req,res,next), AuthorizedRole("Admin"), trailerController.update(req,res));
router.delete("/:id", Authenticated(req,res,next), AuthorizedRole("Admin"), trailerController.delete(req,res));

module.exports = router;
