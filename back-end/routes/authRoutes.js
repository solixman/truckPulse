const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {Authenticated} =require('../middlewares/Authenticated');


router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout',Authenticated, authController.logout);

module.exports = router;
