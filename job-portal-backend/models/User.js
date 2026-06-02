const mongoose = require('mongoose');

// Define the User Schema for the job portal
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['seeker', 'employer', 'admin'], // Restrict roles to either job seeker ,employer or admin
        required: true
    }
}, { timestamps: true }); // Automatically handle createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);