const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getAllJobs);
router.post('/create', jobController.createJob);
router.get('/employer/:employerId', jobController.getJobsByEmployer);

module.exports = router;