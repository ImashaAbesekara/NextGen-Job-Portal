const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Handle user registration logic
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            message: 'User Registered Successfully! 🎉',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Handle user login logic
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email or Password!' });
        }

        // 2. Check if the password matches (Plain text check for mid-presentation setup)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid Email or Password!' });
        }

        // 3. Generate a JSON Web Token (JWT)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            'secretkey123', // This is a temporary secret key for testing
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send successful response with token
        res.status(200).json({
            message: 'Login Successful! Welcome back! 🚀',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { registerUser, loginUser };