const mongoose = require('mongoose');
const Job = require('../models/Job');

/**
 * @desc    Fetch all available jobs for job seekers
 * @route   GET /api/jobs
 * @access  Public
 */
const getAllJobs = async (req, res) => {
    try {
        const allJobsFromDb = await Job.find();
        res.status(200).json(allJobsFromDb);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs from database", details: error });
    }
};

/**
 * @desc    Create a new job post by an employer
 * @route   POST /api/jobs
 * @access  Private (Employer)
 */
const createJob = async (req, res) => {
    try {
        const { title, company, location, salary, type, category, requirements, employerId } = req.body;

        // Ensure the employerId is stored as a proper Mongoose ObjectId if valid
        const formattedEmployerId = mongoose.Types.ObjectId.isValid(employerId)
            ? new mongoose.Types.ObjectId(employerId)
            : employerId;

        const newJob = new Job({
            title,
            company,
            location,
            salary,
            type,
            category,
            requirements,
            employerId: formattedEmployerId
        });

        await newJob.save();
        res.status(201).json({ message: "Job posted successfully!", job: newJob });
    } catch (error) {
        res.status(500).json({ error: "Failed to create job post", details: error });
    }
};

/**
 * @desc    Fetch all jobs posted by a specific employer ID
 * @route   GET /api/jobs/employer/:employerId
 * @access  Private (Employer)
 */
const getJobsByEmployer = async (req, res) => {
    try {
        const { employerId } = req.params;

        // Validate if the incoming string ID matches MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(employerId)) {
            return res.status(400).json({ error: "Invalid Employer ID format structure!" });
        }

        // Explicitly cast string ID to ObjectId to prevent data type mismatch during queries
        const jobs = await Job.find({ employerId: new mongoose.Types.ObjectId(employerId) });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch employer jobs due to casting exception", details: error });
    }
};

module.exports = { getAllJobs, createJob, getJobsByEmployer };