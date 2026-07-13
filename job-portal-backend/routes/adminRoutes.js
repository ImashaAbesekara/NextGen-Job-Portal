// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Integrating secure router paths mapped with Admin Controller nodes protected by Middleware
router.get('/stats', verifyAdmin, adminController.getAdminStats);
router.get('/users', verifyAdmin, adminController.getAllUsers);
router.delete('/users/:id', verifyAdmin, adminController.deleteUser);
router.patch('/jobs/:id/status', verifyAdmin, adminController.updateJobStatus);
router.get('/employers/pending', verifyAdmin, adminController.getPendingEmployers);
router.patch('/employers/:id/status', verifyAdmin, adminController.updateEmployerStatus);

module.exports = router;