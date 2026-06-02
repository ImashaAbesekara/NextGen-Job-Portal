const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: Number, required: true },
    jobRole: { type: String, required: true },
    company: { type: String, required: true },
    coverLetter: { type: String },
    cv: { type: String, required: true },
    userEmail: { type: String, required: true },
    status: {type: String, default:'Pending Review'},
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema, 'applications');