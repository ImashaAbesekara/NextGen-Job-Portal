// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
    try {
        // Extracting JWT token from the Authorization header block
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Authentication failed. Bearer Token missing!" });
        }

        const token = authHeader.split(" ")[1];

        // Verifying token authenticity strictly using system environment JWT secret
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Locating the user context from database using fallback identification nodes safely
        const userId = decodedToken.id || decodedToken.userId || decodedToken._id;
        const user = await User.findById(userId);

        // Security enforcement: Terminate immediately if user context profile is not an administrator
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Corporate Administrator authorization required!" });
        }

        // Forwarding the validated user payload safely to the next controller layer node
        req.user = user;
        next();
    } catch (error) {
        // Logging system exception message profile directly onto server terminal window
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired secure authentication token!" });
    }
};

module.exports = { verifyAdmin };