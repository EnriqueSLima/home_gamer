const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.get('/login', loginController.loginView);
router.get('/logout', loginController.logoutUser);
router.post('/login', loginController.loginUser);

module.exports = router;
