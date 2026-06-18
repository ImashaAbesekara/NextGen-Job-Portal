const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    type: { type: String, default: 'Full Time' },
    category: { type: String, required: true },
    requirements: { type: String, required: true }, // Marks qualification text area
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema, 'jobs');