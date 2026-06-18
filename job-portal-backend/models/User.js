const mongoose = require('mongoose');

// Define the User Schema for the NextGen job portal platform
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
        enum: ['seeker', 'employer', 'admin'], // Restrict roles to either job seeker, employer, or admin
        required: true
    },
    username: { 
        type: String, 
        required: false // Keep optional initially to support legacy accounts and flexible registration
    }, 
    phone: { 
        type: String, 
        required: false // Optional field during standard authentication workflow
    },
    company: { 
        type: String,
        // 🎯 Smart Conditional Logic Integration:
        // This function executes during the save trigger. If the registering user's role 
        // is explicitly set to 'employer', this company field instantly becomes 'required: true'.
        // If the role is 'seeker', it bypasses validation safely as 'required: false'.
        required: function() {
            return this.role === 'employer';
        }
    }

}, { timestamps: true }); // Automatically handle createdAt and updatedAt fields for auditing tracking

module.exports = mongoose.model('User', UserSchema);