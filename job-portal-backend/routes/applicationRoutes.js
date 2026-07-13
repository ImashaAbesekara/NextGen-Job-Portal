const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Extract operational methods directly from controller using object destructuring
const {
    getApplications,
    submitApplication,
    updateApplicationStatus,
    scheduleInterview
} = require('../controllers/applicationController');

// ⚙️ MULTER STORAGE CONFIGURATION
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specifies the directory where CV files will be saved
    },
    filename: (req, file, cb) => {
        // Generates a unique filename using timestamps to prevent overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to ensure only PDFs and Word documents are allowed
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB File Limit
});


// ============================================================================
// 🌐 ROUTES DEFINITIONS
// ============================================================================

// Fetch all applications or filter by query streams
router.get('/', getApplications);

// Submit a new job application (Includes upload middleware for 'cv' file field)
router.post('/', upload.single('cv'), submitApplication);

// ============================================================================
// STATUS UPDATE ROUTE
// Conditional interceptor: If incoming payload status is 'Interview Scheduled',
// route the execution context straight to the 'scheduleInterview' controller.
// ============================================================================
router.put('/:id/status', (req, res, next) => {
    if (req.body.status === 'Interview Scheduled') {
        return scheduleInterview(req, res, next);
    }
    return updateApplicationStatus(req, res, next);
});

// Endpoint: /api/applications/:id/schedule
// Alternate endpoint to explicitly invoke the interview provisioning sequence
router.put('/:id/schedule', scheduleInterview);

module.exports = router;