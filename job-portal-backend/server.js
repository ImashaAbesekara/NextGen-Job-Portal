const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // 🎯 FIXED: Imported path module for handling folder paths safely

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware configuration
app.use(express.json());
app.use(cors());

// 🎯 CRITICAL REAL-WORLD FIX: Expose the uploads directory to serve uploaded CV files publicly
// This allows files like http://localhost:5000/uploads/ProposalFormat.pdf to load smoothly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbURI = process.env.MONGO_URI;

// Establish connection to MongoDB using Mongoose
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB Database Connected Successfully! 🚀'))
    .catch((err) => console.error('Database Connection Error: ❌', err));


// ==========================================
// 🌐 API ROUTES (LINKED FROM ROUTES FOLDER)
// ==========================================

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
// 🚀 NEW NODE: IMPORT ADMIN ENGINE SECURITY SYSTEM ROUTE
const adminRoutes = require('./routes/adminRoutes');

// 🧠 AI INTEGRATION NODE: IMPORT THE GOOGLE AI GEMINI ENGINE MODULE
const aiRoute = require('./routes/aiRoute');

// Connecting our modular routes to the Express app
app.use('/api/jobs', jobRoutes);                   // Maps to: GET /api/jobs
app.use('/api/applications', applicationRoutes);   // 🎯 Maps to: POST & GET /api/applications
app.use('/api/auth', authRoutes);                  // Maps to authentication endpoints
// 🚀 NEW NODE: INJECT THE SECURE ADMINISTRATIVE CORE CONTROLLER VIA MIDDLEWARE 
app.use('/api/admin', adminRoutes);                // Maps to: System Stats, Moderation & User Terminals

// 🧠 AI INTEGRATION NODE: INJECT THE GENERATIVE WORKFLOW ROUTER MIDDLEWARE
app.use('/api/ai', aiRoute);                       // Maps to: POST /api/ai/generate-cover-letter


// Base Test Route to verify server status
app.get('/', (req, res) => {
    res.send('NextGen Backend Server is Running Successfully!');
});

// Define and initialize the Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});