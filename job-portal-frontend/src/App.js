import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './Navbar';
import LandingPage from './landingPage';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import EmployerDashboard from './EmployerDashboard';
// IMPORT: Import the premium Admin Control Center UI
import AdminDashboard from './AdminDashboard';

// AI INTEGRATION NODE: Import the generative AI application view layer into the router mapping architecture
import AiAssistant from './AiAssistant';

// SECURITY LAYER: Route protection mechanism specifically targeting the corporate administrator scope
const AdminProtectedRoute = ({ children }) => {
    // Retrieve secure authentication parameters directly from client storage nodes
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Authorization Check: Enforce validation properties strictly against session keys
    if (!token || role !== 'admin') {
        console.warn("Administrative guard access denied. Rerouting agent to login gate.");
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    // Shared state management to control sub-view rendering inside the Job Seeker dashboard view layers
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <Router>
            <div className="App" style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>

                {/* Global Navigation Header (Self-hiding engine triggered dynamically inside secured workspace layouts) */}
                <Navbar />

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Secured Seeker Dashboard Context */}
                    <Route
                        path="/dashboard"
                        element={<Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
                    />

                    {/* Secured Employer Dashboard Context */}
                    <Route path="/employer-dashboard" element={<EmployerDashboard />} />

                    {/* Secured Corporate Administrator Dashboard Context with active Route Guard protection */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <AdminProtectedRoute>
                                <AdminDashboard />
                            </AdminProtectedRoute>
                        }
                    />

                    {/* AI INTEGRATION NODE: Inject the custom standalone AI assistant route into the system application grid */}
                    <Route path="/ai-assistant" element={<AiAssistant />} />

                    {/* Fallback routing layer to auto-redirect unmatched route paths back to home anchor */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* GLOBAL TOAST CONTAINER */}
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
                    theme="dark"
                />
            </div>
        </Router>
    );
}

export default App;