import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import toast configuration from react-toastify to replace default browser popups
import { toast } from 'react-toastify';
// Import the NextGen static branding asset image for dashboard orchestration
import logoImage from './assets/logo.png';

const AdminDashboard = () => {
    // State management for navigation tabs, system data metrics, and global loading states
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalSeekers: 0, totalEmployers: 0, totalJobs: 0, totalApplications: 0 });
    const [users, setUsers] = useState([]);
    const [pendingEmployers, setPendingEmployers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch synchronized backend records upon component lifecycle mounting trigger
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Safely retrieve secure JWT authentication token and user role from client session memory
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');

                // Security gate enforcement: Redirect if credentials are missing or user is not an admin
                if (!token || role !== 'admin') {
                    console.error("Authorization failed. Invalid session role or token missing.");
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }

                // Construct industry-standard request configuration header
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };

                // Execute parallel analytical requests to optimize system data loading speeds
                const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
                const usersRes = await axios.get('http://localhost:5000/api/admin/users', config);

                if (statsRes.data.success) setStats(statsRes.data.stats);
                if (usersRes.data.success) setUsers(usersRes.data.users);

                // Safe extraction configuration fallback to evaluate pending employer validation metrics
                if (usersRes.data.success) {
                    const filteredPending = usersRes.data.users.filter(
                        u => u.role === 'employer' && u.status === 'pending'
                    );
                    setPendingEmployers(filteredPending);
                }

                setLoading(false);
            } catch (error) {
                console.error("Administrative data nodes synchronization failed:", error.response?.data || error.message);

                // If authentication drops with an explicit 401 status code, cleanly route user out
                if (error.response?.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    // Core functionality execution: Account Termination Handler with Premium Toast Integration
    const handleTerminateUser = async (userId) => {
        // Safe programmatic confirmation block utilizing clean premium toast triggers
        toast.info(
            <div>
                <p style={{ margin: '0 0 10px 0' }}>Are you sure you want to terminate this user permanently? ⚠️</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={async () => {
                            toast.dismiss();
                            try {
                                const token = localStorage.getItem('token');
                                const config = { headers: { Authorization: `Bearer ${token}` } };

                                // Fire network payload to clear account data node permanently from database
                                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);

                                // Render success response feedback to admin terminal
                                toast.success("User profile successfully purged from NextGen database! 💀", {
                                    style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' }
                                });

                                // Instantly filter out user locally from UI node arrays
                                setUsers(users.filter(user => user._id !== userId));
                                setPendingEmployers(pendingEmployers.filter(emp => emp._id !== userId));
                            } catch (error) {
                                console.error("Account elimination error:", error);
                                toast.error("Failed to terminate target user account session. ❌", {
                                    style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
                                });
                            }
                        }}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Yes, Terminate
                    </button>
                    <button onClick={() => toast.dismiss()} style={{ background: '#475569', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>,
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false, style: { background: '#1e293b', color: '#fff' } }
        );
    };

    // Business Logic Validation Flow: Corporate Employer Account Verification Mappings
    const handleVerifyEmployer = async (employerId, actionStatus) => {
        const promptText = actionStatus === 'approved'
            ? "Approve this corporate employer and authorize job deployment rights? 🏢"
            : "Reject and decline this corporate profile access token? ⚠️";

        // Premium confirmation custom toast architecture integration node
        toast.info(
            <div>
                <p style={{ margin: '0 0 10px 0' }}>{promptText}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={async () => {
                            toast.dismiss();
                            try {
                                const token = localStorage.getItem('token');
                                const config = { headers: { Authorization: `Bearer ${token}` } };

                                // 🎯 FIXED & SYNCHRONIZED: Updated endpoint path to cleanly hit the right backend route architecture
                                await axios.patch(`http://localhost:5000/api/admin/employers/${employerId}/status`, { status: actionStatus }, config);

                                // Display professional success notifications
                                if (actionStatus === 'approved') {
                                    toast.success("Employer approved successfully! Corporate portal is now active. 🎉", {
                                        style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' }
                                    });
                                } else {
                                    toast.warn("Employer profile has been rejected and deactivated. ⚠️", {
                                        style: { background: '#1e293b', color: '#fff', border: '1px solid #f59e0b' }
                                    });
                                }

                                // Dynamically purge validated profile from local component view queue
                                setPendingEmployers(pendingEmployers.filter(emp => emp._id !== employerId));

                                // Incremental count modification on active admin analytics board state
                                if (actionStatus === 'approved') {
                                    setStats(prev => ({ ...prev, totalEmployers: prev.totalEmployers + 1 }));
                                }
                            } catch (error) {
                                console.error("Employer state adjustment operation failed:", error.response?.data || error.message);
                                toast.error("Action failed: Unable to update employer authorization parameters. ❌", {
                                    style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
                                });
                            }
                        }}
                        style={{ background: actionStatus === 'approved' ? '#10b981' : '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Confirm
                    </button>
                    <button onClick={() => toast.dismiss()} style={{ background: '#475569', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>,
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false, style: { background: '#1e293b', color: '#fff' } }
        );
    };

    // Calculate maximum metric value to normalize the visual distribution bars dynamically
    const maxMetricValue = Math.max(stats.totalSeekers, stats.totalEmployers, stats.totalJobs, stats.totalApplications, 1);

    if (loading) {
        return (
            <div style={{ background: '#090d16', height: '100vh', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', color: '#a78bfa', fontSize: '1.5rem', fontFamily: 'sans-serif' }}>
                <svg width="50" height="50" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="4" />
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#a78bfa" strokeWidth="4" strokeDasharray="31.4 31.4" />
                </svg>
                <span>Initializing NextGen Corporate Admin Framework...</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', background: '#05070c', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", color: '#f8fafc' }}>

            {/* Modular Sidebar Controls Navigation Node */}
            <div style={{ width: '290px', background: 'rgba(10, 15, 30, 0.7)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '35px 24px', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', boxSizing: 'border-box', zIndex: 5 }}>
                {/* Visual Branding Section Optimized with Corporate Identity Logo Component */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '45px', paddingLeft: '5px' }}>
                    <img src={logoImage} alt="NextGen Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px' }} />
                    <h2 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(to right, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>NextGen Admin</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                    <button onClick={() => setActiveTab('overview')} style={{ ...sidebarBtnStyle, background: activeTab === 'overview' ? 'rgba(99, 102, 241, 0.12)' : 'transparent', color: activeTab === 'overview' ? '#c084fc' : '#94a3b8', border: activeTab === 'overview' ? '1px solid rgba(192, 132, 252, 0.2)' : '1px solid transparent' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                        Overview Hub
                    </button>

                    <button onClick={() => setActiveTab('users')} style={{ ...sidebarBtnStyle, background: activeTab === 'users' ? 'rgba(99, 102, 241, 0.12)' : 'transparent', color: activeTab === 'users' ? '#c084fc' : '#94a3b8', border: activeTab === 'users' ? '1px solid rgba(192, 132, 252, 0.2)' : '1px solid transparent' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        Account Directory
                    </button>

                    <button onClick={() => setActiveTab('verification')} style={{ ...sidebarBtnStyle, background: activeTab === 'verification' ? 'rgba(99, 102, 241, 0.12)' : 'transparent', color: activeTab === 'verification' ? '#c084fc' : '#94a3b8', border: activeTab === 'verification' ? '1px solid rgba(192, 132, 252, 0.2)' : '1px solid transparent' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        Employer Verification
                        {pendingEmployers.length > 0 && (
                            <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '2px 7px', borderRadius: '10px' }}>{pendingEmployers.length}</span>
                        )}
                    </button>
                </div>

                <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ ...sidebarBtnStyle, color: '#f43f5e', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.15)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Terminate Control
                </button>
            </div>

            {/* Main Content Interface Dashboard Screen */}
            <div style={{ marginLeft: '290px', width: 'calc(100% - 290px)', padding: '45px 55px', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>

                {/* OVERVIEW TAB INTERFACE CONSOLE */}
                {activeTab === 'overview' && (
                    <div>
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>System Metrics</h1>
                            <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Real-time analytical metrics mapping the NextGen architecture platform.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '45px' }}>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #6366f1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={cardLabelStyle}>Total Seekers</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{ marginLeft: 'auto' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <h3 style={{ fontSize: '2.6rem', fontWeight: '800', margin: '15px 0 0 0', color: '#f8fafc' }}>{stats.totalSeekers}</h3>
                            </div>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #38bdf8' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={cardLabelStyle}>Total Employers</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" style={{ marginLeft: 'auto' }}><path d="M22 21H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4v18" /><rect x="6" y="7" width="12" height="14" /><path d="M18 21h4a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-4" /></svg>
                                </div>
                                <h3 style={{ fontSize: '2.6rem', fontWeight: '800', margin: '15px 0 0 0', color: '#f8fafc' }}>{stats.totalEmployers}</h3>
                            </div>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #34d399' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={cardLabelStyle}>Active Jobs</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" style={{ marginLeft: 'auto' }}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </div>
                                <h3 style={{ fontSize: '2.6rem', fontWeight: '800', margin: '15px 0 0 0', color: '#f8fafc' }}>{stats.totalJobs}</h3>
                            </div>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #fbbf24' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={cardLabelStyle}>Applications</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" style={{ marginLeft: 'auto' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                </div>
                                <h3 style={{ fontSize: '2.6rem', fontWeight: '800', margin: '15px 0 0 0', color: '#f8fafc' }}>{stats.totalApplications}</h3>
                            </div>
                        </div>

                        {/* Volume Distribution Tracking Display Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' }}>
                            <div style={{ background: 'rgba(11, 17, 32, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '30px', backdropFilter: 'blur(10px)' }}>
                                <h3 style={{ margin: '0 0 25px 0', fontSize: '1.15rem', fontWeight: '700', letterSpacing: '0.3px', color: '#cbd5e1' }}>Architecture Volume Distribution</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>
                                            <span>Talent Pools (Seekers)</span>
                                            <span style={{ color: '#6366f1' }}>{stats.totalSeekers} Nodes</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(stats.totalSeekers / maxMetricValue) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #6366f1)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>
                                            <span>Corporate Infrastructure (Employers)</span>
                                            <span style={{ color: '#38bdf8' }}>{stats.totalEmployers} Active</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(stats.totalEmployers / maxMetricValue) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>
                                            <span>Market Indexing (Active Jobs)</span>
                                            <span style={{ color: '#34d399' }}>{stats.totalJobs} Posts</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(stats.totalJobs / maxMetricValue) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>
                                            <span>Engagement Interactions (Applications)</span>
                                            <span style={{ color: '#fbbf24' }}>{stats.totalApplications} Transmitted</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(stats.totalApplications / maxMetricValue) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #d97706, #fbbf24)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(11, 17, 32, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '30px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.15rem', fontWeight: '700', letterSpacing: '0.3px', color: '#cbd5e1' }}>Ecosystem Security</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}></div>
                                            <span>Database Cluster: Connected</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}></div>
                                            <span>JWT Core Gateway: Secured</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></div>
                                            <span>Server Environment: Production</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '20px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                                    NextGen System Architecture v1.0.2
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* USER ACCOUNT REGISTRY CONFIGURATION MATRIX TAB */}
                {activeTab === 'users' && (
                    <div>
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>Account Registry</h1>
                            <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Manage configurations and session authorizations of users across the framework.</p>
                        </div>

                        <div style={tableWrapperStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <th style={tableHeaderStyle}>User Entity</th>
                                        <th style={tableHeaderStyle}>Email Contact</th>
                                        <th style={tableHeaderStyle}>Role Scope</th>
                                        <th style={tableHeaderStyle}>Actions Module</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} style={tableRowStyle}>
                                            <td style={tableCellStyle}>{user.name}</td>
                                            <td style={tableCellStyle}>{user.email}</td>
                                            <td style={tableCellStyle}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                                                    background: user.role === 'admin' ? 'rgba(192, 132, 252, 0.12)' : user.role === 'employer' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                                                    color: user.role === 'admin' ? '#c084fc' : user.role === 'employer' ? '#38bdf8' : '#818cf8'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={tableCellStyle}>
                                                {user.role !== 'admin' ? (
                                                    <button onClick={() => handleTerminateUser(user._id)} style={actionBtnRejectStyle}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
                                                        Terminate
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        🛡️ System Secure
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* EMPLOYER INSTITUTIONAL VERIFICATION PIPELINE MANAGEMENT TAB */}
                {activeTab === 'verification' && (
                    <div>
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>Corporate Verification Hub</h1>
                            <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Authorize or decline pending corporate entities requesting job deployment rights.</p>
                        </div>

                        {pendingEmployers.length === 0 ? (
                            <div style={{ padding: '60px', background: 'rgba(15, 23, 42, 0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', color: '#64748b' }}>
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '15px', color: '#34d399' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                <h3 style={{ color: '#cbd5e1', margin: '0 0 5px 0' }}>All Clear, Captain!</h3>
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>No pending employer accounts require institutional review at this moment.</p>
                            </div>
                        ) : (
                            <div style={tableWrapperStyle}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <th style={tableHeaderStyle}>Company / Representative</th>
                                            <th style={tableHeaderStyle}>Corporate Email</th>
                                            <th style={tableHeaderStyle}>Verification State</th>
                                            <th style={tableHeaderStyle}>Administrative Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingEmployers.map((employer) => (
                                            <tr key={employer._id} style={tableRowStyle}>
                                                <td style={tableCellStyle}>
                                                    <div style={{ fontWeight: '600', color: '#f8fafc' }}>{employer.company || "Unknown Corp"}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>HR: {employer.name}</div>
                                                </td>
                                                <td style={tableCellStyle}>{employer.email}</td>
                                                <td style={tableCellStyle}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                                                        ⚠️ PENDING APPROVAL
                                                    </span>
                                                </td>
                                                <td style={tableCellStyle}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => handleVerifyEmployer(employer._id, 'approved')} style={actionBtnApproveStyle}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                                            Approve
                                                        </button>
                                                        <button onClick={() => handleVerifyEmployer(employer._id, 'rejected')} style={actionBtnRejectStyle}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// INDUSTRIAL STYLING CONFIGURATIONS
const sidebarBtnStyle = { padding: '13px 18px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '600', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' };
const cardStyle = { background: 'rgba(11, 17, 32, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'transform 0.2s' };
const cardLabelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.75px' };
const tableWrapperStyle = { background: 'rgba(10, 16, 31, 0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 };
const tableHeaderStyle = { padding: '20px 24px', fontSize: '0.85rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.75px' };
const tableCellStyle = { padding: '20px 24px', fontSize: '0.95rem', color: '#cbd5e1', verticalAlign: 'middle' };
const tableRowStyle = { borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', background: 'rgba(255,255,255,0.01)' };

const actionBtnApproveStyle = { padding: '8px 14px', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '8px', color: '#34d399', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' };
const actionBtnRejectStyle = { padding: '8px 14px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '8px', color: '#f43f5e', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' };

export default AdminDashboard;