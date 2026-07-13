const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', // Links it to your jobs collection
        required: true
    },
    jobRole: { type: String, required: true },
    company: { type: String, required: true },
    coverLetter: { type: String },
    cv: { type: String, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, default: 'Pending Review' },
    appliedAt: { type: Date, default: Date.now },
    // 🚀 PREMIUM INTERVIEW SCHEDULING METRICS
    // These fields are required for the NextGen Employer Panel to dispatch live interview streams
    zoomLink: { type: String, default: '' },       // Stores the secure Zoom/Meet URL
    interviewDate: { type: String, default: '' },  // Stores the scheduled date (e.g., '2026-07-10')
    interviewTime: { type: String, default: '' }   // Stores the allocated time (e.g., '10:30 AM')
});

module.exports = mongoose.model('Application', ApplicationSchema, 'applications');