const express = require('express');
const signupController = require('../controllers/signupController');
const router = express.Router();

router.get('/signup', signupController.registerView);
router.post('/signup', signupController.registerUser);

module.exports = router;
