import React, { useState } from 'react';
import axios from 'axios';
// Import useNavigate hook for industry-standard routing redirection
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Keep only toast!
// 🚀 IMPORT MODERN AND INDUSTRY-STANDARD EYE ICONS FOR PASSWORD TOGGLE
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// Import the background image asset for the login layout
import backgroundImage from './assets/lBg.jpg';

const Login = () => {
    // State management for user login inputs (Supports Email or Username validation)
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    // New state to toggle password visibility (Show/Hide Eye Feature)
    const [showPassword, setShowPassword] = useState(false);

    // Initialize the navigation trigger
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Premium validation safeguard checks instead of standard browser popups
        if (!identifier || !password) {
            toast.error("Please fill in all security fields! ⚠️", {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
            });
            return;
        }

        try {
            // Send login credentials safely to the backend configuration architecture
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: identifier, // Your API backend processes this mapping structure directly
                password
            });

            // Check if the secure JWT token is received successfully from the enterprise server
            if (response.data.token) {
                // Save the JWT token inside browser's localStorage for session access token authorization
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);

                // Save the complete profile object returned from server instead of just the identifier string
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Render dynamic premium toast for successful application login processing
                toast.success("Welcome Back! Login Successful! 🎉", {
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' },
                    duration: 3000
                });

                // Contextual rule-based conditional smart routing logic evaluating profile authorization states
                setTimeout(() => {
                    // 🚀 Administrative Role configuration to navigate to Corporate Dashboards
                    if (response.data.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (response.data.role === 'employer') {
                        navigate('/employer-dashboard');
                    } else if (response.data.role === 'seeker') {
                        navigate('/dashboard'); // Sourced from your Job Seeker dynamic dashboard route
                    } else {
                        navigate('/'); // Ultimate safe navigation fallback target
                    }
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            // 🎯 FIXED EXCEPTION BINDING NODE:
            // Intercepts the custom 403 Forbidden messages thrown during pending corporate validation verification checks
            const errorMsg = error.response?.data?.message || 'Login Failed! Check your verification tokens.';

            toast.error(`${errorMsg} ❌`, {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' },
                duration: 4000
            });
        }
    };

    // --- Component Styling Properties ---
    const pageContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: '80px 20px 40px 20px',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.40)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxSizing: 'border-box'
    };

    const loginBoxStyle = {
        background: 'rgba(30, 41, 59, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '40px 35px',
        borderRadius: '28px',
        width: '420px',
        textAlign: 'center',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box'
    };

    const headingStyle = {
        color: '#ffffff',
        margin: '0 0 6px 0',
        fontSize: '1.8rem',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    };

    const subtitleStyle = {
        color: '#94a3b8',
        margin: '0 0 24px 0',
        fontSize: '0.85rem'
    };

    const formFlowStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    };

    const inputStyle = {
        width: '100%',
        padding: '11px 16px',
        margin: '5px 0',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s'
    };

    const passwordWrapperStyle = {
        position: 'relative',
        width: '100%',
        margin: '5px 0',
        display: 'flex',
        alignItems: 'center'
    };

    const passwordInputStyle = {
        width: '100%',
        padding: '11px 45px 11px 16px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s'
    };

    const passwordToggleStyle = {
        position: 'absolute',
        right: '14px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#94a3b8',
        fontSize: '16px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        userSelect: 'none',
        transition: 'color 0.2s ease'
    };

    const buttonStyle = {
        width: '100%',
        padding: '14px',
        marginTop: '15px',
        backgroundColor: '#7c3aed',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '15px',
        cursor: 'pointer',
        transition: '0.3s ease',
        boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)'
    };

    const footerTextStyle = {
        color: '#94a3b8',
        fontSize: '13px',
        marginTop: '15px',
        textAlign: 'center'
    };

    const backBtnStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '6px 16px',
        borderRadius: '20px',
        color: '#94a3b8',
        marginTop: '15px',
        alignSelf: 'center',
        cursor: 'pointer',
        fontSize: '12px',
        transition: '0.3s',
        display: 'inline-block'
    };

    return (
        <div style={pageContainerStyle}>
            <div style={loginBoxStyle}>
                <h2 style={headingStyle}>Welcome Back</h2>
                <p style={subtitleStyle}>Enter your email or username handle to authenticate</p>

                <form onSubmit={handleLogin} style={formFlowStyle}>
                    <input
                        type="text"
                        placeholder="Email Address or Username"
                        style={inputStyle}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <div style={passwordWrapperStyle}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            style={passwordInputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={passwordToggleStyle}
                            title={showPassword ? "Hide Password" : "Show Password"}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    <button type="submit" style={buttonStyle}>Sign In</button>
                </form>

                <div style={footerTextStyle}>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: '600' }}>
                        Register
                    </span>
                </div>

                <div>
                    <button onClick={() => navigate('/')} style={backBtnStyle}>Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default Login;