// controllers/adminController.js
const User = require('../models/User');
const Job = require('../models/Job'); // Imports the Job structure configuration
const Application = require('../models/Application'); // Imports the Job Application log template

// 1. GET SYSTEM GENERAL METRICS / STATS
exports.getAdminStats = async (req, res) => {
    try {
        const totalSeekers = await User.countDocuments({ role: 'seeker' });
        const totalEmployers = await User.countDocuments({ role: 'employer' });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        res.status(200).json({
            success: true,
            stats: { totalSeekers, totalEmployers, totalJobs, totalApplications }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching system statistics", error: error.message });
    }
};

// 2. GET ALL USERS (MANAGEMENT DIRECTORY)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user directory", error: error.message });
    }
};

// 3. TERMINATE / BAN USER FROM SYSTEM
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User account terminated successfully from NextGen ecosystem." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
    }
};

// 4. MODERATE JOB POSTING STATUS (APPROVE / REJECT)
exports.updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Target Job listing metadata not found." });
        }
        res.status(200).json({ success: true, message: `Job post status updated to ${status}`, updatedJob });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating job state", error: error.message });
    }
};

// 5. FETCH ALL PENDING EMPLOYERS FOR ADMINISTRATIVE REVIEW
exports.getPendingEmployers = async (req, res) => {
    try {
        const pendingEmployers = await User.find({ role: 'employer', status: 'pending' }).select('-password');
        res.status(200).json({ success: true, employers: pendingEmployers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching pending corporate accounts", error: error.message });
    }
};

// 6. MODERATE EMPLOYER VERIFICATION STATUS (APPROVE / REJECT)
exports.updateEmployerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedEmployer = await User.findByIdAndUpdate(id, { status: status }, { new: true }).select('-password');
        if (!updatedEmployer) {
            return res.status(404).json({ success: false, message: "Target Employer profile metadata not found." });
        }

        res.status(200).json({
            success: true,
            message: `Employer verification profile has been successfully updated to ${status}.`,
            updatedEmployer
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating corporate verification state", error: error.message });
    }
};