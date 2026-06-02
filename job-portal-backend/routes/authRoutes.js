const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Define POST route for user registration
router.post('/register', registerUser);

// Define POST route for user login
router.post('/login', loginUser);

module.exports = router;