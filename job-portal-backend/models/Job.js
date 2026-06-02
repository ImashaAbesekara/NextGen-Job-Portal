const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    category: { type: String, required: true },
    icon: { type: String, required: true },
    jobs: [
        {
            id: { type: Number, required: true },
            role: { type: String, required: true },
            company: { type: String, required: true },
            location: { type: String, required: true },
            salary: { type: String, required: true },
            type: { type: String, default: 'Full Time' },
            qualifications: { type: [String], default: [] } // 🎯 Qualifications 
        }
    ]
});

module.exports = mongoose.model('Job', JobSchema, 'jobs');