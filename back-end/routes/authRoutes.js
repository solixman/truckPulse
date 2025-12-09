const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Authenticated =require('../middlewares/Authenticated');
 //testing gtihub

router.post('/login', authController.login(req,res));
router.post('/register', authController.register(req,res));
router.get('/logout',Authenticated(req,res,next), authController.logout(req,res));

module.exports = router;
