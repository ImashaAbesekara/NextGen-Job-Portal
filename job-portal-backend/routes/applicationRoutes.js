const express = require('express');
const router = express.Router();
// Importing the application controller to handle the logic
const applicationController = require('../controllers/applicationController');

// @route   GET /api/applications
// @desc    Fetch all applications or filter by user email
// @access  Public
router.get('/', applicationController.getApplications);

// @route   POST /api/applications
// @desc    Submit a new job application to the database
// @access  Public
router.post('/', applicationController.submitApplication);

module.exports = router;