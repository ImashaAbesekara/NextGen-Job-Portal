import React, { useState } from 'react'; // Added useState to manage tabs globally
import './App.css';
// Import essential routing components from react-router-dom library
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import custom application components and view screens
import Navbar from './Navbar';
import LandingPage from './landingPage';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
    // 🎯 Dynamic State to track which dashboard view is active ('overview' or 'search')
    // Shared between Navbar.js (for switching) and Dashboard.js (for rendering content)
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="App">
            {/* Wrap the entire application routing hierarchy within the Router component */}
            <Router>

                {/* 🚀 Global Navbar: Now perfectly receiving activeTab state props */}
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

                <Routes>
                    {/* Route targeting the main public landing gateway page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Route targeting the user identity verification login screen */}
                    <Route path="/login" element={<Login />} />

                    {/* Route targeting the account creation registration screen */}
                    <Route path="/register" element={<Register />} />

                    {/* 📊 Secured Dashboard: Receiving activeTab to change content dynamically */}
                    <Route
                        path="/dashboard"
                        element={<Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
                    />

                    {/* Catch-all safety route: Automatically redirects any unknown URLs back to the home landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;