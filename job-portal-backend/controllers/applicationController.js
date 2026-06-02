const Application = require('../models/Application');

// 1️⃣ SUBMIT A NEW APPLICATION
const submitApplication = async (req, res) => {
    try {
        // 🎯 req.body....serEmail 
        const { jobId, jobRole, company, coverLetter, cv, userEmail } = req.body;

        const newApplication = new Application({
            jobId,
            jobRole,
            company,
            coverLetter,
            cv,
            userEmail 
        });

        const savedApplication = await newApplication.save();

        res.status(201).json({ 
            success: true, 
            message: "Application submitted successfully to NextGen Database! 🎉", 
            data: savedApplication 
        });
    } catch (error) {
        console.error("Error saving application: ", error);
        res.status(500).json({ success: false, error: "Failed to save application to database", details: error });
    }
};

// 2️⃣ GET APPLICATIONS 
const getApplications = async (req, res) => {
    try {
        const userEmail = req.query.email; // query parameter  (e.g., ?email=test@gmail.com)
        let applications;
        
        if (userEmail) {
            
            applications = await Application.find({ userEmail: userEmail });
        } else {
            
            applications = await Application.find();
        }
        
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications: ", error);
        res.status(500).json({ success: false, error: "Failed to fetch applications from database" });
    }
};

// 🎯  export
module.exports = { 
    submitApplication,
    getApplications
};