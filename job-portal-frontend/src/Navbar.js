import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import myLogo from './assets/logo.png';

// Receiving activeTab and setActiveTab as props from Dashboard.js
function Navbar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const location = useLocation(); // Catch the current page URL path

    // Boolean conditions to identify exactly which page the user is viewing
    const isDashboard = location.pathname === '/dashboard';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <nav style={navStyle}>
            {/* Logo Section - Clicking this returns user back home */}
            <div style={logoContainer} onClick={() => navigate('/')}>
                <img src={myLogo} alt="NextGen Logo" style={logoImageStyle} />
                <span style={logoTextStyle}>NextGen</span>
            </div>

            {/* 🎯 NEW CENTER TABS: Only visible inside the Dashboard route */}
            {isDashboard && (
                <div style={middleTabsContainer}>
                    <button
                        style={activeTab === 'overview' ? activeTabStyle : inactiveTabStyle}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview Dashboard
                    </button>
                    <button
                        style={activeTab === 'search' ? activeTabStyle : inactiveTabStyle}
                        onClick={() => setActiveTab('search')}
                    >
                        🔍 Search & Apply Jobs
                    </button>
                </div>
            )}

            {/* Dynamic Navigation Links based on Current URL Route */}
            <div style={navLinks}>
                {isDashboard ? (
                    // 🧑‍💻 Inside Job Seeker Dashboard - Show profile and workspace links
                    <>
                        <button onClick={() => navigate('/')} style={logoutBtnStyle}>Logout</button>
                    </>
                ) : isAuthPage ? (
                    // 🔒 Inside Login or Register Screens - Keep it completely clean (No links shown)
                    null
                ) : (
                    // 🌐 Inside Public Landing Page - Show entry level portal routes
                    <>
                        <button onClick={() => navigate('/login')} style={navBtnStyle}>Login</button>
                        <button onClick={() => navigate('/register')} style={registerBtnStyle}>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
}

// === Premium Glassmorphism UI Layout Theme Styles (100% Kept Identical) ===
const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    boxSizing: 'border-box',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const logoContainer = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const logoImageStyle = { width: '40px', height: '40px', borderRadius: '8px' };
const logoTextStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' };
const navLinks = { display: 'flex', gap: '25px', alignItems: 'center' };
const navBtnStyle = { background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', transition: '0.2s' };
const registerBtnStyle = { background: '#fff', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' };
const logoutBtnStyle = { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' };

// === 🎨 Creative & Modern Middle Dashboard Tabs Styles ===
const middleTabsContainer = {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '6px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    gap: '8px'
};

const baseTabStyle = {
    border: 'none',
    padding: '10px 24px',
    borderRadius: '25px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

// Purple Gradient theme that perfectly blends with your active design
const activeTabStyle = {
    ...baseTabStyle,
    color: '#fff',
    background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
};

const inactiveTabStyle = {
    ...baseTabStyle,
    color: 'rgba(255, 255, 255, 0.65)',
    background: 'transparent'
};

export default Navbar;