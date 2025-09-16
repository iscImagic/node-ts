const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Assuming you have an auth controller 
const verifyToken = require('../middlewares/auth.middleware'); // Assuming you have an auth middleware for authentication

router.post('/register', authController.register); // Route for user registration
router.post('/login', authController.login); // Route for user login
router.get('/profile', verifyToken, authController.getUserProfile); // Route to get user profile, protected by authentication middleware
router.post('/refresh-token', authController.refreshToken); // Route to refresh access token
router.post('/logout', authController.logout); // Route to log out user
module.exports = router; // Export the router to be used in app.js