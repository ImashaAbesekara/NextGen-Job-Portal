const Job = require('../models/Job');

// Fetch all jobs
const getAllJobs = async (req, res) => {
    try {
        const allJobsFromDb = await Job.find(); 
        res.status(200).json(allJobsFromDb);   
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs from database", details: error });
    }
};

module.exports = { getAllJobs };