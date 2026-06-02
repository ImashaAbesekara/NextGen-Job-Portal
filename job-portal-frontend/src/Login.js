import React, { useState } from 'react';
import axios from 'axios';
// Import useNavigate hook for industry-standard routing redirection
import { useNavigate } from 'react-router-dom';
// Import the background image asset for the login layout
import backgroundImage from './assets/lBg.jpg';

const Login = () => {
    // State management for user login inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Initialize the navigation trigger
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Send login credentials securely to the backend API route
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Check if the secure JWT token is received successfully
            if (response.data.token) {
                // Save the JWT token inside browser's localStorage for session management
                localStorage.setItem('token', response.data.token);


                localStorage.setItem('user', JSON.stringify({ email: email }));

                alert('Success: Login Successful! 🎉');

                // Professional redirection using the URL path to Dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            // Handle error response gracefully and display feedback to the user
            alert(error.response?.data?.message || 'Login Failed! Please check your credentials.');
        }
    };

    // --- Component Styling Properties ---
    const pageContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };

    const loginBoxStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        padding: '40px',
        borderRadius: '24px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const headingStyle = {
        color: '#ffffff',
        marginBottom: '24px',
        fontSize: '28px',
        fontWeight: 'bold'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        marginTop: '20px',
        backgroundColor: '#7c3aed', // NextGen Purple Theme
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: '0.3s ease',
        boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
        marginBottom: '10px'
    };

    const footerTextStyle = {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        marginTop: '20px',
        marginBottom: '15px'
    };

    const backBtnStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 20px',
        borderRadius: '20px',
        color: '#fff',
        marginTop: '15px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: '0.3s',
        display: 'inline-block'
    };

    return (
        <div style={pageContainerStyle}>
            <div style={loginBoxStyle}>
                <h2 style={headingStyle}>Login</h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        style={inputStyle}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* Updated Purple Theme Action Button */}
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>

                {/* Structured footer to match Register layout perfectly */}
                <div style={footerTextStyle}>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} style={{ color: '#7c3aed', cursor: 'pointer' }}>
                        Register
                    </span>
                </div>

                {/* Clean pill-shaped navigation back to the main index view */}
                <button onClick={() => navigate('/')} style={backBtnStyle}>Back to Home</button>
            </div>
        </div>
    );
};

export default Login;