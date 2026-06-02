const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware configuration
app.use(express.json());
app.use(cors());


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

// Connecting our modular routes to the Express app
app.use('/api/jobs', jobRoutes);                   // Maps to: GET /api/jobs
app.use('/api/applications', applicationRoutes);   // 🎯 Maps to: POST & GET /api/applications
app.use('/api/auth', authRoutes);                  // Maps to authentication endpoints


// Base Test Route to verify server status
app.get('/', (req, res) => {
    res.send('NextGen Backend Server is Running Successfully!');
});

// Define and initialize the Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});