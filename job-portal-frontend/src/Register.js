import React, { useState } from 'react';
// Import useNavigate hook from react-router-dom for industry-standard navigation
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from './assets/rBg.jpg';

function Register() {
    // State management to store user input data securely
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('seeker');

    // Initialize the navigation trigger function
    const navigate = useNavigate();

    // Handle the Form Submission event
    const handleRegister = async (e) => {
        e.preventDefault();

        // Simple validation check before submitting form data
        if (!name || !email || !password) {
            alert("Please fill in all fields! ⚠️");
            return;
        }

        try {
            // Sending registration payload data to the Express Backend route using Axios
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            // Check if registration operation is successfully accomplished by backend
            if (response.status === 201) {
                alert(`Success: ${response.data.message}`);
                // Automatically redirect the newly registered user directly to the login interface path
                navigate('/login');
            }
        } catch (error) {
            // Handling user authentication registration errors structurally
            if (error.response && error.response.data) {
                alert(`Error: ${error.response.data.message} ❌`);
            } else {
                alert("Something went wrong with the connection! 🔌");
            }
        }
    };

    return (
        <div style={pageContainerStyle}>
            <div style={registerBoxStyle}>
                {/* NextGen branding title */}
                <h2 style={titleStyle}>Join NextGen</h2>
                <p style={subtitleStyle}>Create an account to start your journey</p>

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        style={inputStyle}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Create Password"
                        style={inputStyle}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Role Selection Dropdown */}
                    <div style={dropdownContainerStyle}>
                        <label style={labelStyle}>I want to join as a:</label>
                        <select
                            style={selectStyle}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="seeker" style={optionStyle}>Job Seeker</option>
                            <option value="employer" style={optionStyle}>Employer</option>
                        </select>
                    </div>

                    <button type="submit" style={registerBtnStyle}>Create Account</button>
                </form>

                <div style={footerTextStyle}>
                    Already have an account?{' '}
                    {/* Professional route redirection mapping directly to the login screen */}
                    <span onClick={() => navigate('/login')} style={{ color: '#7c3aed', cursor: 'pointer' }}>
                        Login
                    </span>
                </div>

                {/* Professional route navigation redirection back to the Landing main index layout */}
                <button onClick={() => navigate('/')} style={backBtnStyle}>Back to Home</button>
            </div>
        </div>
    );
}

// --- Styles (Fixed to completely remove the top white line layout issue) ---

const pageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    /* 🚀 Added safe padding top to keep the glass box centered without getting pushed under floating navbar */
    paddingTop: '100px',
    paddingBottom: '40px',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxSizing: 'border-box'
};

const registerBoxStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    padding: '30px',
    borderRadius: '24px',
    width: '400px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
};

const titleStyle = {
    color: '#fff',
    fontSize: '2.2rem',
    marginBottom: '10px',
    fontWeight: '800',
};

const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '30px',
    fontSize: '0.9rem'
};

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
};

const dropdownContainerStyle = {
    textAlign: 'left',
    marginTop: '10px',
    marginBottom: '10px'
};

const labelStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    display: 'block',
    marginBottom: '5px',
    paddingLeft: '5px'
};

const selectStyle = {
    width: '100%',
    padding: '12px 15px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer'
};

const optionStyle = {
    backgroundColor: '#1e293b',
    color: '#fff'
};

const registerBtnStyle = {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    backgroundColor: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s ease',
    boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
};

const footerTextStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginTop: '20px'
};

const backBtnStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '8px 20px',
    borderRadius: '20px',
    color: '#fff',
    marginTop: '25px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: '0.3s'
};

export default Register;