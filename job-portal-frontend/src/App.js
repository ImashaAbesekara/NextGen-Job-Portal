import React, { useState } from 'react'; // Managed tabs globally
import './App.css';
// Import essential routing components from react-router-dom library
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 IMPORT TOASTCONTAINER AND STYLES FOR GLOBAL NOTIFICATIONS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import custom application components and view screens
import Navbar from './Navbar';
import LandingPage from './landingPage';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import EmployerDashboard from './EmployerDashboard'; // Ensure this file is inside 'src' folder

function App() {
    // 🎯 Dynamic State to track which dashboard view is active ('overview' or 'search')
    // Shared between Navbar.js (for switching) and Dashboard.js (for rendering content)
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <Router>
            <div className="App" style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>

                {/* 🚀 Global Navbar: Now perfectly receiving activeTab state props */}
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

                <Routes>
                    {/* Route targeting the main public landing gateway page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Route targeting the user identity verification login screen */}
                    <Route path="/login" element={<Login />} />

                    {/* Route targeting the account creation registration screen */}
                    <Route path="/register" element={<Register />} />

                    {/* 📊 Secured Seeker Dashboard: Receiving activeTab to change content dynamically */}
                    <Route
                        path="/dashboard"
                        element={<Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
                    />

                    {/* 🏢 Secured Employer Dashboard Route */}
                    <Route path="/employer-dashboard" element={<EmployerDashboard />} />

                    {/* Catch-all safety route: Automatically redirects any unknown URLs back to the home landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* 🔥 GLOBAL TOAST CONTAINER PROVIDING PREMIUM NOTIFICATIONS ACROSS ALL PAGES */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark" // Beautiful dark theme to match NextGen design blueprint
                />
            </div>
        </Router>
    );
}

export default App;