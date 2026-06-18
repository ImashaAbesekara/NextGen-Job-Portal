import React, { useState } from 'react';
// Import useNavigate hook from react-router-dom for industry-standard navigation
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Keep only toast!
// 🚀 IMPORT MODERN EYE ICONS TO FIX EMBEDDED TEXT EMOJI DOUBLE IMAGE ISSUE
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from './assets/rBg.jpg';

function Register() {
    // State management to store user input data securely with enterprise standards
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('seeker');
    // 🎯 Fixed: Renamed state variable to 'company' to seamlessly align with backend destructuring
    const [company, setCompany] = useState('');

    // New state to toggle password visibility (Show/Hide Eye Feature)
    const [showPassword, setShowPassword] = useState(false);

    // Initialize the navigation trigger function for page routing
    const navigate = useNavigate();

    // Handle the Form Submission event and payload dispatch
    const handleRegister = async (e) => {
        e.preventDefault();

        // Premium validation check instead of standard browser alerts
        if (!name || !username || !email || !phone || !password) {
            toast.error("Please fill in all identity fields! ⚠️", {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
            });
            return;
        }

        // Contextual validation constraint evaluation based on corporate security requirements
        if (role === 'employer' && !company) {
            toast.error("Please provide your registered Company Name! 🏢", {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
            });
            return;
        }

        try {
            // Constructing a unified smart registration payload data structure
            const payload = {
                name,
                username,
                email,
                phone,
                password,
                role,
                ...(role === 'employer' && { company })
            };

            // Transmitting encapsulated registration payload to Express API endpoint using Axios client
            const response = await axios.post('http://localhost:5000/api/auth/register', payload);

            // Evaluate if server context confirms safe insertion lifecycle creation
            if (response.status === 201) {
                // Show dynamic modern toast for successful registration lifecycle execution
                toast.success("Account Created Successfully! Please Sign In. 🎉", {
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' },
                    duration: 3000
                });

                // Short delay to let the user experience the professional success toast animation
                setTimeout(() => {
                    // 🎯 FIXED: Industry standard architecture logic. 
                    // Redirect BOTH employers and seekers strictly to login to safely clear credentials and build JWT token streams.
                    navigate('/login');
                }, 1500);
            }
        } catch (error) {
            // Processing server exception feedback structures gracefully using elegant toast updates
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message} ❌`, {
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
                });
            } else {
                toast.error("Network architecture binding error detected! 🔌", {
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
                });
            }
        }
    };

    return (
        <div style={pageContainerStyle}>
            {/* Split Screen Premium Landscape Interface Layout Box */}
            <div style={splitCardStyle}>

                {/* Left Side: NextGen Enterprise Branding Info Showcase Panel (Compressed for Form Space) */}
                <div style={leftBrandingSideStyle}>
                    <div style={brandingContentStyle}>
                        <h1 style={mainBrandTitleStyle}>NextGen</h1>
                        <p style={brandTaglineStyle}>The Ultimate Smart Career Solution.</p>
                        <div style={featureListStyle}>
                            <div style={featureItemStyle}>✦ Connect with Top Global Enterprises</div>
                            <div style={featureItemStyle}>✦ Streamlined Application Tracking System</div>
                            <div style={featureItemStyle}>✦ Advanced Enterprise Talent Recruitment Tools</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Interactive Secured Registration Form Input Console Panel (Expanded Layout) */}
                <div style={rightFormSideStyle}>
                    <h2 style={titleStyle}>Create Account</h2>
                    <p style={subtitleStyle}>Get started by setting up your universal credentials</p>

                    <form onSubmit={handleRegister} style={formFlowStyle}>
                        {/* Legal Full Name Registration Field */}
                        <input
                            type="text"
                            placeholder="Full Name"
                            style={inputStyle}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Unique Account Handle Designation Field */}
                        <input
                            type="text"
                            placeholder="Unique Username"
                            style={inputStyle}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        {/* Secure Communications Electronic Mail Input Field */}
                        <input
                            type="email"
                            placeholder="Email Address"
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Authorized Direct Contact Communications Field */}
                        <input
                            type="text"
                            placeholder="Phone Number (e.g. +94 7X XXX XXXX)"
                            style={inputStyle}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        {/* Private Authentication Cipher Input Input Field with Show/Hide Eye Toggle */}
                        <div style={passwordWrapperStyle}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create Password"
                                style={passwordInputStyle}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* 🎯 FIXED: Crisp high-performance React Icons integrated cleanly */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={passwordToggleStyle}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>

                        {/* Authorization Role Selection Strategy Dropdown Container Component */}
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

                        {/* Smart Conditional Input Rendering: Invokes validation node exclusively for corporate profiles */}
                        {role === 'employer' && (
                            <div style={conditionalInputWrapperStyle}>
                                <input
                                    type="text"
                                    placeholder="Company Name (e.g. NextGen Systems)"
                                    style={{ ...inputStyle, border: '1px solid #7c3aed' }}
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Submit Action Registration Execution Button Trigger */}
                        <button type="submit" style={registerBtnStyle}>Create Account</button>
                    </form>

                    {/* Authentication Cross Link Context Interface Navigation Node */}
                    <div style={footerTextStyle}>
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: '600' }}>
                            Login
                        </span>
                    </div>

                    {/* Root Landing View Interface Return Target Button */}
                    <button onClick={() => navigate('/')} style={backBtnStyle}>Back to Home</button>
                </div>

            </div>
        </div>
    );
}

// --- NextGen Smart Premium Responsive Landscape Style Architecture ---

const pageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '95px 20px 45px 20px',
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.40)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxSizing: 'border-box'
};

const splitCardStyle = {
    display: 'flex',
    flexDirection: 'row',
    background: 'rgba(30, 41, 59, 0.45)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '28px',
    width: '960px',
    minHeight: '610px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    boxSizing: 'border-box'
};

const leftBrandingSideStyle = {
    flex: '0.8',
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.1) 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 30px',
    textAlign: 'left'
};

const brandingContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const mainBrandTitleStyle = {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: '900',
    margin: 0,
    letterSpacing: '-1px',
    background: 'linear-gradient(to right, #fff, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
};

const brandTaglineStyle = {
    color: '#cbd5e1',
    fontSize: '1rem',
    margin: '0 0 10px 0',
    fontWeight: '400'
};

const featureListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px'
};

const featureItemStyle = {
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: '500',
    lineHeight: '1.4'
};

const rightFormSideStyle = {
    flex: '1.5',
    padding: '35px 45px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'left',
    boxSizing: 'border-box'
};

const titleStyle = {
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: '800',
    margin: '0 0 4px 0'
};

const subtitleStyle = {
    color: '#94a3b8',
    margin: '0 0 8px 0',
    fontSize: '0.85rem'
};

const formFlowStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '10px',
};

const inputStyle = {
    width: '100%',
    padding: '11px 16px',
    margin: '4px 0',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(15, 23, 42, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s'
};

const passwordWrapperStyle = {
    position: 'relative',
    width: '100%',
    margin: '3px 0',
    display: 'flex',
    alignItems: 'center'
};

const passwordInputStyle = {
    width: '100%',
    padding: '11px 45px 11px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(15, 23, 42, 0.2)',
    borderRadius: '12px',
    color: '#fff',
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

const dropdownContainerStyle = {
    textAlign: 'left',
    margin: '6px 0'
};

const labelStyle = {
    color: '#94a3b8',
    fontSize: '12px',
    display: 'block',
    marginBottom: '4px',
    paddingLeft: '2px'
};

const selectStyle = {
    width: '100%',
    padding: '11px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(15, 23, 42, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
};

const optionStyle = {
    backgroundColor: '#1e293b',
    color: '#fff'
};

const conditionalInputWrapperStyle = {
    animation: 'fadeIn 0.4s ease-out-in'
};

const registerBtnStyle = {
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
    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
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
    transition: '0.3s'
};

export default Register;