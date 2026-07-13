const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Import bcryptjs for industry-standard secure password hashing and encryption
const bcrypt = require('bcryptjs');

// ==========================================
// 1. HANDLE USER REGISTRATION LOGIC
// ==========================================
const registerUser = async (req, res) => {
    try {
        // Destructure all input fields coming from the React frontend application
        const { name, email, password, role, username, phone, company } = req.body;

        // Validation: Verify if the email is already registered in the system
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already exists inside NextGen database!' });
        }

        // --- SECURE PASSWORD HASHING WORKFLOW ---
        // Generate a cryptographic salt with 10 rounds for high security resilience
        const salt = await bcrypt.genSalt(10);
        // Hash the plain text password into an unbreakable encrypted string
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the comprehensive user profile data safely inside MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Storing the securely encrypted hash, NOT plain text
            role,
            username,
            phone,
            company
        });

        // 🎯 SMART ARCHITECTURE INTEGRATION:
        // Checking if the registered user is an employer to pass institutional routing meta flags
        if (user.role === 'employer') {
            return res.status(201).json({
                success: true,
                isPendingEmployer: true,
                message: 'Registration successful! Your corporate account is pending administrative approval. Please await institutional verification before logging in. 🎉'
            });
        }

        // Respond with HTTP 201 Created and return non-sensitive user metadata profile for job seekers
        res.status(201).json({
            success: true,
            message: 'User Registered Successfully and Secured! 🎉',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Security Error', error: err.message });
    }
};

// ==========================================
// 2. HANDLE SECURE USER LOGIN LOGIC
// ==========================================
const loginUser = async (req, res) => {
    try {
        // 'email' variable receives either the actual Email address or the Username handle from frontend input
        const { email, password } = req.body;

        // 🎯 SMART MONGOOSE QUERY UPDATE:
        // Check if the user input matches EITHER the email field OR the username field inside MongoDB
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        });

        // Step A: If no user profile matches the incoming email/username identifier
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email/Username or Password!' });
        }

        // Step B: Compare the incoming plain password with the encrypted hash inside MongoDB via Bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Email/Username or Password!' });
        }

        // ============================================================
        // 🎯 🛡️ SECURED INSTITUTIONAL GATEWAY CONTROL NODE:
        // Prevent unauthorized access into endpoints if the employer profile is not active
        // ============================================================
        if (user.role === 'employer' && user.status === 'pending') {
            return res.status(403).json({
                message: "Your corporate account is pending administrative approval. Please wait for institutional verification."
            });
        }

        if (user.role === 'employer' && user.status === 'rejected') {
            return res.status(403).json({
                message: "Your corporate access request has been declined by NextGen administrators."
            });
        }
        // ============================================================

        // Step C: Generate an authenticated JSON Web Token (JWT) encapsulating session states
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        // Step D: Transmit secure HTTP 200 payload containing the authorization access token
        res.status(200).json({
            message: 'Login Successful! Welcome back to NextGen Portal! 🚀',
            token,
            role: user.role, // Dispatched cleanly to assist frontend dynamic route switching
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server Authentication Error', error: err.message });
    }
};

module.exports = { registerUser, loginUser };