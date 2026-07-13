import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import myLogo from './assets/logo.png';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current page URL path

    // 🎯 Identify if the user is currently inside any of the dashboard tracks (Added /admin-dashboard)
    const isDashboard =
        location.pathname === '/dashboard' ||
        location.pathname === '/employer-dashboard' ||
        location.pathname === '/admin-dashboard';

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // 🎯 PROFESSIONAL UX: If inside a workspace dashboard, completely unmount (hide) the top navbar to avoid layout overlapping
    if (isDashboard) {
        return null;
    }

    return (
        <nav style={navStyle}>
            {/* Logo Section - Redirects user back to landing page */}
            <div style={logoContainer} onClick={() => navigate('/')}>
                <img src={myLogo} alt="NextGen Logo" style={logoImageStyle} />
                <span style={logoTextStyle}>NextGen</span>
            </div>

            {/* Dynamic Navigation Links based on Current URL Route */}
            <div style={navLinks}>
                {isAuthPage ? (
                    // Keep the header completely clean inside authentication screens
                    null
                ) : (
                    // Display public entry portal triggers only on the landing page gateway
                    <>
                        <button onClick={() => navigate('/login')} style={navBtnStyle}>Login</button>
                        <button onClick={() => navigate('/register')} style={registerBtnStyle}>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
}

// === Premium Glassmorphism UI Layout Theme Styles ===
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

export default Navbar;