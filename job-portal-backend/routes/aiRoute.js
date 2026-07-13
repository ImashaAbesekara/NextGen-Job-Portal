// aiRoute.js - Routing module for handling AI-powered services within the NextGen job portal
const express = require('express');
const router = express.Router();

// Import the official Google Generative AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client with the API key from environment variables
const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Define the stable model version
const MODEL_NAME = "gemini-1.5-flash";

/**
 * Route: POST /generate-cover-letter
 */
router.post('/generate-cover-letter', async (req, res) => {
    try {
        const { jobTitle, companyName, skills, candidateName, candidateEmail } = req.body;

        // Force the API to use the stable 'v1' version to avoid 404 errors
        const model = ai.getGenerativeModel({ model: MODEL_NAME }, { apiVersion: 'v1' });

        const prompt = `You are an expert career coach for the NextGen job portal. 
        Write a highly professional, engaging cover letter for a candidate applying for "${jobTitle}" at "${companyName}". 
        The candidate has these skills: "${skills || 'General industry skills'}". 
        
        Candidate Metadata (Strictly include this at the sign-off section):
        - Full Name: ${candidateName || 'Job Seeker'}
        - Email Address: ${candidateEmail || ''}
        
        Please format the final signature section professionally.
        Keep it modern and professional. Do not include date placeholders.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ success: true, coverLetter: text });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ success: false, message: 'AI generation failed.' });
    }
});

/**
 * Route: POST /generate-job-description
 */
router.post('/generate-job-description', async (req, res) => {
    try {
        const { jobTitle, companyName, requirements } = req.body;

        // Force the API to use the stable 'v1' version to avoid 404 errors
        const model = ai.getGenerativeModel({ model: MODEL_NAME }, { apiVersion: 'v1' });

        const prompt = `You are an expert HR manager and recruiter for the NextGen job portal. 
        Write a highly professional, structured, and engaging Job Description for the position of "${jobTitle}" at "${companyName}". 
        Include sections for Role Overview, Key Responsibilities, and Required Skills/Qualifications based on these points: "${requirements || 'Standard industry requirements'}". 
        Keep it modern, clean, and ready to post.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ success: true, jobDescription: text });
    } catch (error) {
        console.error('AI Job Desc Error:', error);
        res.status(500).json({ success: false, message: 'AI generation failed.' });
    }
});

module.exports = router;