import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from './assets/dBg.jpg';
// 🚀 IMPORT REACT TOASTIFY FOR PREMIUM POP-UP NOTIFICATIONS
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    // --- 🚀 STATES ---
    const [activeTab, setActiveTab] = useState('overview'); // Managed internally now for Sidebar navigation
    const [jobData, setJobData] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [cvFile, setCvFile] = useState(null);

    // Hover States for Job Cards (Apply Now Buttons)
    const [hoveredButtonId, setHoveredButtonId] = useState(null);

    // 🎯 FETCH JOBS & APPLICATIONS FROM DATABASE ON LOAD
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch all flat-structured jobs from the updated backend endpoint
                const jobsResponse = await fetch('http://localhost:5000/api/jobs');
                if (jobsResponse.ok) {
                    const jobsData = await jobsResponse.json();
                    setJobData(jobsData); // jobsData is now a direct array of job documents
                }

                // 2. Fetch applications for the specific logged-in user
                const loggedInUser = JSON.parse(localStorage.getItem('user'));

                if (loggedInUser && loggedInUser.email) {
                    const appResponse = await fetch(`http://localhost:5000/api/applications?email=${loggedInUser.email}`);
                    if (appResponse.ok) {
                        const appData = await appResponse.json();
                        setAppliedJobs(appData);
                    }
                }

                // Turn off loading screen once data is fetched successfully
                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard data from NextGen Database:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [activeTab]); // Refreshes state data dynamically when shifting tabs

    // Open Modal and bind selected job properties
    const handleApply = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    /**
     * @desc    Handle logout action session termination
     */
    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.info("Logged out successfully. See you again! 👋", {
            position: "top-right",
            autoClose: 2500,
            theme: "dark"
        });
        setTimeout(() => {
            window.location.reload(); // Or route to login using react-router if available
        }, 1500);
    };

    /**
     * @desc    Dynamic Category Icon Selector to avoid static icons across different sectors
     * @param   {String} category - Job category passed from the backend database schema
     * @returns {String} Emoji / Icon mapping representing the industry standard
     */
    const getCategoryIcon = (category) => {
        if (!category) return '💼';
        const cat = category.toLowerCase();
        if (cat.includes('it') || cat.includes('software') || cat.includes('tech') || cat.includes('developer')) return '💻';
        if (cat.includes('manage') || cat.includes('hr') || cat.includes('business') || cat.includes('admin')) return '📊';
        if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('creative')) return '🎨';
        if (cat.includes('finance') || cat.includes('bank') || cat.includes('account')) return '💵';
        if (cat.includes('market') || cat.includes('sale') || cat.includes('advertise')) return '📈';
        if (cat.includes('health') || cat.includes('medical') || cat.includes('doctor')) return '🩺';
        if (cat.includes('engineer') || cat.includes('civil') || cat.includes('mechanic')) return '⚙️';
        return '💼'; // Default generic fallback icon
    };

    /**
     * @desc    Handle multi-part form submission using FormData for file streaming
     * @access  Private (Job Seeker)
     */
    const handleSubmitApplication = async (e) => {
        e.preventDefault();

        // 📄 TRIGGER WARNING TOAST IF CV IS MISSING
        if (!cvFile) {
            toast.warning("Please upload your CV before submitting! 📄", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark"
            });
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('user'));

        // ❌ TRIGGER ERROR TOAST IF SESSION IS EXPIRED
        if (!currentUser || !currentUser.email) {
            toast.error("Session expired! Please login again. ❌", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark"
            });
            return;
        }

        try {
            // 🚀 INITIALIZE FORMDATA WRAPPER FOR MULTIPART FILE UPLOAD
            const formData = new FormData();
            formData.append('jobId', selectedJob._id || selectedJob.id);
            formData.append('jobRole', selectedJob.title || selectedJob.role);
            formData.append('company', selectedJob.company);
            formData.append('coverLetter', coverLetter);
            formData.append('userEmail', currentUser.email);

            // Append the actual binary file object target securely to the data stream
            formData.append('cv', cvFile);

            // Forwarding processing payload stream data to the correct standardized endpoint mapping
            const response = await axios.post('http://localhost:5000/api/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Instructs backend server to handle binary stream chunks
                }
            });

            if (response.status === 201 || response.data.success) {

                // 🎉 TRIGGER PREMIUM SUCCESS TOAST MATCHING YOUR THEME
                toast.success("Application Submitted Successfully! 🚀", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark"
                });

                // Extract saved document data nodes mapped out from backend response object schema
                const savedApp = response.data.application || response.data;

                // Optimistically update the local state array view UI live with mapped values
                setAppliedJobs([...appliedJobs, {
                    jobId: selectedJob._id || selectedJob.id,
                    jobRole: selectedJob.title || selectedJob.role,
                    company: selectedJob.company,
                    coverLetter: coverLetter,
                    cv: savedApp.cv || cvFile.name, // Safely fallback to filename string context
                    appliedAt: new Date(),
                    status: 'Pending Review'
                }]);

                // Clear input fields and close popup layout
                setCoverLetter('');
                setCvFile(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error submitting application payload context logs:", error);

            // ❌ TRIGGER ERROR TOAST IF BACKEND SERVER IS DOWN
            toast.error("Failed to submit application. Server is unreachable. ❌", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark"
            });
        }
    };

    // 🎯 PROFESSIONAL UPDATE: Filter logic re-mapped for direct single-layered array streaming
    const filteredJobData = jobData.filter(job => {
        const query = searchQuery.toLowerCase();
        return (
            (job.title && job.title.toLowerCase().includes(query)) ||
            (job.company && job.company.toLowerCase().includes(query)) ||
            (job.location && job.location.toLowerCase().includes(query)) ||
            (job.category && job.category.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', color: '#fff', fontFamily: 'sans-serif' }}>
                <h2>Loading NextGen Careers from Database...</h2>
            </div>
        );
    }

    // Safely parse logged in user for sidebar profile widget display
    const activeUser = JSON.parse(localStorage.getItem('user')) || { name: 'Job Seeker', email: '' };

    return (
        <div style={dashboardLayoutContainer}>

            {/* =========================================================
                🛡️ ARCHITECTURE COMPONENT: GLASSMORPHIC SIDEBAR
               ========================================================= */}
            <aside style={sidebarWrapper}>
                <div style={sidebarBrandArea}>
                    <div style={brandLogoPlaceholder}>NG</div>
                    <h2 style={brandText}>NextGen</h2>
                </div>

                <div style={sidebarUserBadge}>
                    <div style={avatarCircle}>👤</div>
                    <div style={userInfoWrapper}>
                        <span style={userNameText}>{activeUser.name || 'User Terminal'}</span>
                        <span style={userRoleSub}>Candidate Account</span>
                    </div>
                </div>

                <nav style={sidebarNavGroup}>
                    <button
                        style={activeTab === 'overview' ? sidebarBtnActive : sidebarBtn}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span style={btnIconSlot}>📊</span> Overview Hub
                    </button>
                    <button
                        style={activeTab === 'search' ? sidebarBtnActive : sidebarBtn}
                        onClick={() => setActiveTab('search')}
                    >
                        <span style={btnIconSlot}>🔍</span> Explore Openings
                    </button>
                </nav>

                <div style={sidebarFooterArea}>
                    <button style={logoutBtn} onClick={handleLogout}>
                        <span style={btnIconSlot}>🚪</span> Disconnect Session
                    </button>
                </div>
            </aside>

            {/* =========================================================
                💻 MAIN WORKSPACE CONTENT CONTAINER
               ========================================================= */}
            <main style={workspaceMainArea}>

                {/* =========================================================
                    📉 TAB 1: OVERVIEW (DYNAMIC COUNTERS & LIVE TRACKING)
                   ========================================================= */}
                {activeTab === 'overview' && (
                    <div style={mainContent}>
                        <div style={workspaceHeader}>
                            <h1 style={workspaceTitle}>Candidate Overview Terminal</h1>
                            <p style={workspaceSubtitle}>Track and monitor real-time processing metrics of filed requests</p>
                        </div>

                        {/* Lighter, Frosted Glass Summary Cards */}
                        <div style={summaryCardsRow}>
                            <div style={summaryCard}>
                                <div style={cardHeaderIconRow}>
                                    <h4 style={cardLabel}>Total Applications</h4>
                                    <span style={{ ...cardIconBox, color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)' }}>💼</span>
                                </div>
                                <p style={cardValueWhite}>{appliedJobs.length}</p>
                            </div>

                            <div style={summaryCard}>
                                <div style={cardHeaderIconRow}>
                                    <h4 style={cardLabel}>Shortlisted</h4>
                                    <span style={{ ...cardIconBox, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>🎯</span>
                                </div>
                                <p style={{ ...cardValueWhite, color: '#10b981' }}>
                                    {appliedJobs.filter(app => app.status === 'Shortlisted').length}
                                </p>
                            </div>

                            <div style={summaryCard}>
                                <div style={cardHeaderIconRow}>
                                    <h4 style={cardLabel}>Pending Review</h4>
                                    <span style={{ ...cardIconBox, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>⏳</span>
                                </div>
                                <p style={{ ...cardValueWhite, color: '#f59e0b' }}>
                                    {appliedJobs.filter(app => (app.status || 'Pending Review') === 'Pending Review').length}
                                </p>
                            </div>
                        </div>

                        {/* Creative Live Tracking Table */}
                        <div style={tableWrapper}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={tableHeading}>Your Applied Jobs Progress</h3>
                                <span style={tableSubBadge}>Live Tracking</span>
                            </div>

                            {appliedJobs.length > 0 ? (
                                <div style={tableContainer}>
                                    <div style={thGroupStyle}>
                                        <div style={{ flex: 2, color: '#c084fc', fontWeight: '700' }}>Job Role & Company</div>
                                        <div style={{ flex: 1, color: '#c084fc', fontWeight: '700' }}>Applied Date</div>
                                        <div style={{ flex: 1, color: '#c084fc', fontWeight: '700', textAlign: 'center' }}>Status</div>
                                        <div style={{ flex: 1, color: '#c084fc', fontWeight: '700', textAlign: 'right' }}>Action</div>
                                    </div>

                                    {appliedJobs.map((app, index) => {
                                        const currentStatus = app.status || 'Pending Review';
                                        const isPending = currentStatus === 'Pending Review' || currentStatus === 'Pending';
                                        return (
                                            <div key={index} style={creativeRowCard}>
                                                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={rowJobRole}>{app.jobRole}</span>
                                                    <span style={rowCompany}>🏢 {app.company}</span>
                                                </div>
                                                <div style={{ flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                                                    📅 {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={isPending ? pendingBadgeStyle : shortlistedBadgeStyle}>
                                                        <span style={isPending ? pendingDot : shortlistedDot}>●</span> {currentStatus}
                                                    </span>
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <button style={viewDetailsBtn}>Track 🚀</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '30px', fontSize: '1.1rem' }}>
                                    You haven't applied for any jobs yet. Click 'Explore Openings' on the left panel to get started! 🚀
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* =========================================================
                    🔍 TAB 2: SEARCH JOBS (3-COLUMN RESPONSIVE FLAT GRID)
                   ========================================================= */}
                {activeTab === 'search' && (
                    <div>
                        <div style={heroSection}>
                            <h1 style={heroTitle}>Find Your Dream Career</h1>
                            <p style={heroSubtitle}>Browse through verified opportunities today</p>

                            <div style={searchBarContainer}>
                                <input
                                    type="text"
                                    placeholder="Search by job title, skill or company..."
                                    style={searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button style={searchBtn}>Search Jobs</button>
                            </div>
                        </div>

                        <div style={mainContent}>
                            {/* 🎯 PROFESSIONAL UPDATE: Directly rendering jobs from clean unified layout */}
                            {filteredJobData.length > 0 ? (
                                <div style={jobGrid3Columns}>
                                    {filteredJobData.map((job) => {
                                        const jobIdStr = job._id || job.id;
                                        const isHovered = hoveredButtonId === jobIdStr;
                                        return (
                                            <div key={jobIdStr} style={jobCard}>
                                                <div style={cardHeader}>
                                                    <h3 style={roleNameWhite}>{job.title}</h3>
                                                    {/* Dynamic Category Icon Rendered Live */}
                                                    <span style={jobTagIcon}>{getCategoryIcon(job.category)}</span>
                                                </div>
                                                <p style={companyName}>🏢 {job.company} <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'normal' }}>• {job.category || 'General'}</span></p>

                                                <div style={detailsRow}>
                                                    <span>📍 {job.location}</span>
                                                    <span>💰 {job.salary}</span>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                                    <span style={jobTag}>{job.type || 'Full Time'}</span>
                                                    <button
                                                        style={isHovered ? applyButtonStyleHover : applyButtonStyle}
                                                        onMouseEnter={() => setHoveredButtonId(jobIdStr)}
                                                        onMouseLeave={() => setHoveredButtonId(null)}
                                                        onClick={() => handleApply(job)}
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.6)' }}>
                                    <h3>❌ No jobs match your search criteria. Try a different keyword!</h3>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* =========================================================
                🔮 PREMIUM POPUP MODAL (DYNAMIC DESIGN)
               ========================================================= */}
            {isModalOpen && selectedJob && (
                <div style={modalOverlay}>
                    <div style={creativeModalBox}>
                        <div style={modalLeftSplit}>
                            <div>
                                <span style={badgeTag}>NextGen Verified</span>
                                <h2 style={leftJobTitle}>{selectedJob.title}</h2>
                                <p style={leftCompanyTitle}>{selectedJob.company}</p>
                            </div>

                            <div style={leftDetailsGroup}>
                                <div style={detailItem}>📍 <span style={{ marginLeft: '8px' }}>{selectedJob.location}</span></div>
                                <div style={detailItem}>💰 <span style={{ marginLeft: '8px' }}>{selectedJob.salary}</span></div>
                            </div>

                            <div style={qualificationsWrapper}>
                                <h4 style={qualificationsHeading}>Requirements & Qualifications:</h4>
                                <ul style={ulStyle}>
                                    {/* 🎯 PROFESSIONAL UPDATE: Splits requirement strings dynamically via standard syntax */}
                                    {selectedJob.requirements ? (
                                        selectedJob.requirements.split(',').map((req, index) => (
                                            <li key={index} style={liStyle}>
                                                <span style={{ color: '#c084fc', marginRight: '8px' }}>✦</span> {req.trim()}
                                            </li>
                                        ))
                                    ) : (
                                        <li style={liStyle}>
                                            <span style={{ color: '#c084fc', marginRight: '8px' }}>✦</span> Professional qualifications required.
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <p style={leftFooterNote}>You are directly submitting your verified NextGen profile to this employer.</p>
                        </div>

                        <div style={modalRightSplit}>
                            <h3 style={rightFormHeading}>Complete Your Application</h3>
                            <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={creativeFormGroup}>
                                        <label style={creativeLabel}>Cover Letter / Brief Pitch</label>
                                        <textarea
                                            style={creativeTextarea}
                                            placeholder="Introduce yourself and state why you're a perfect fit..."
                                            rows="3"
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                        />
                                    </div>
                                    <div style={creativeFormGroup}>
                                        <label style={creativeLabel}>Curriculum Vitae (CV)</label>
                                        <div style={creativeUploadBox}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                style={{ display: 'none' }}
                                                id="creative-cv-upload"
                                                onChange={(e) => {
                                                    // Dynamic single file assignment safely tracking empty checks
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setCvFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="creative-cv-upload" style={uploadBoxLabel}>
                                                <span style={{ fontSize: '2rem', marginBottom: '5px' }}>{cvFile ? '📄' : '☁️'}</span>
                                                <span style={uploadMainText}>{cvFile ? cvFile.name : "Click to upload your resume"}</span>
                                                <span style={uploadSubText}>Supports PDF, DOCX up to 5MB</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div style={creativeActionRow}>
                                    <button type="button" style={creativeCancelBtnSymmetric} onClick={() => setIsModalOpen(false)}>Dismiss</button>
                                    <button type="submit" style={creativeSubmitBtn}>Send Application 🚀</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 🔥 CSS STYLES (UPDATED INDUSTRY SIDEBAR ARCHITECTURE DESIGN) ---
const dashboardLayoutContainer = { display: 'flex', minHeight: '100vh', width: '100%', background: `linear-gradient(rgba(13, 18, 36, 0.82), rgba(10, 14, 28, 0.88)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };

// 🛠️ SIDEBAR ARCHITECTURE LOOK AND FEEL
const sidebarWrapper = { width: '280px', background: 'rgba(15, 23, 42, 0.55)', borderRight: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column', padding: '30px 20px', boxSizing: 'border-box', position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100, justifyContent: 'space-between' };
const sidebarBrandArea = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '35px', paddingLeft: '10px' };
const brandLogoPlaceholder = { width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '14px', border: '1px solid rgba(192, 132, 252, 0.3)' };
const brandText = { margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.5px' };
const sidebarUserBadge = { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '12px 15px', marginBottom: '30px' };
const avatarCircle = { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' };
const userInfoWrapper = { display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const userNameText = { color: '#fff', fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' };
const userRoleSub = { color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontWeight: '500' };
const sidebarNavGroup = { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 };
const sidebarBtn = { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'transparent', border: 'none', borderRadius: '14px', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' };
const sidebarBtnActive = { ...sidebarBtn, background: 'rgba(124, 58, 237, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.15)', boxShadow: 'inset 0 0 12px rgba(124, 58, 237, 0.05)' };
const btnIconSlot = { fontSize: '1.1rem' };
const sidebarFooterArea = { paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' };
const logoutBtn = { ...sidebarBtn, color: '#ef4444' };

// 🛠️ CONTENT AREA VIEWPORT ARCHITECTURE
const workspaceMainArea = { flex: 1, marginLeft: '280px', padding: '40px 40px 60px 40px', boxSizing: 'border-box', minHeight: '100vh' };
const workspaceHeader = { marginBottom: '40px' };
const workspaceTitle = { margin: 0, fontSize: '2rem', fontWeight: '800', color: '#ffffff' };
const workspaceSubtitle = { margin: '5px 0 0 0', fontSize: '1rem', color: 'rgba(255,255,255,0.5)' };

const mainContent = { width: '100%', maxWidth: '1200px' };
const summaryCardsRow = { display: 'flex', gap: '25px', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap' };
const summaryCard = { flex: 1, minWidth: '260px', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '25px', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)', display: 'flex', flexDirection: 'column', gap: '12px' };
const cardHeaderIconRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardLabel = { margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' };
const cardIconBox = { width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' };
const cardValueWhite = { margin: 0, fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px', color: '#ffffff', textShadow: '0 2px 10px rgba(255,255,255,0.1)' };
const tableWrapper = { background: 'rgba(13, 17, 33, 0.5)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(25px)', borderRadius: '28px', padding: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' };
const tableHeading = { marginTop: 0, marginBottom: 0, color: '#fff', fontSize: '1.5rem', fontWeight: '700' };
const tableSubBadge = { background: 'rgba(124, 58, 237, 0.15)', color: '#c084fc', padding: '6px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(192, 132, 252, 0.2)' };
const tableContainer = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' };
const thGroupStyle = { display: 'flex', padding: '10px 20px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const creativeRowCard = { display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '18px', padding: '20px', alignItems: 'center', transition: '0.3s all ease', backdropFilter: 'blur(10px)' };
const rowJobRole = { fontSize: '1.15rem', fontWeight: '700', color: '#fff' };
const rowCompany = { fontSize: '0.9rem', color: '#a78bfa', fontWeight: '500' };
const baseBadge = { padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' };
const pendingBadgeStyle = { ...baseBadge, background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.25)', boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)' };
const shortlistedBadgeStyle = { ...baseBadge, background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)' };
const pendingDot = { color: '#f59e0b', fontSize: '0.7rem' };
const shortlistedDot = { color: '#10b981', fontSize: '0.7rem' };
const viewDetailsBtn = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: '0.2s' };
const heroSection = { padding: '10px 20px 40px', textAlign: 'center' };
const heroTitle = { fontSize: '2.8rem', fontWeight: '800', marginBottom: '10px', color: '#e9d5ff', textShadow: '3px 3px 6px rgba(0, 0, 0, 0.95), 0px 0px 12px rgba(168, 85, 247, 0.4)' };
const heroSubtitle = { fontSize: '1.2rem', marginBottom: '35px', color: 'rgba(243, 232, 255, 0.85)', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' };
const searchBarContainer = { display: 'flex', maxWidth: '700px', margin: '0 auto', background: 'rgba(15, 12, 30, 0.65)', backdropFilter: 'blur(12px)', padding: '8px', borderRadius: '16px', border: '1px solid #C084fc', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' };
const searchInput = { flex: 1, background: 'transparent', border: 'none', padding: '12px 20px', color: '#f3e8ff', fontSize: '16px', outline: 'none' };
const searchBtn = { background: '#7c3aed', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const jobGrid3Columns = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '25px' };
const jobCard = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', padding: '25px', backdropFilter: 'blur(20px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '10px' };
const roleNameWhite = { fontSize: '1.25rem', margin: 0, fontWeight: '700', color: '#ffffff', textShadow: '0 2px 8px rgba(255,255,255,0.1)', lineHeight: '1.3' };
const jobTagIcon = { width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 };
const jobTag = { background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' };
const companyName = { color: '#a78bfa', fontWeight: '600', margin: '0 0 15px 0', fontSize: '0.95rem' };
const detailsRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '20px' };
const applyButtonStyle = { padding: '10px 20px', background: 'transparent', border: '1px solid rgba(167, 139, 250, 0.4)', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.9rem' };
const applyButtonStyleHover = { ...applyButtonStyle, background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', border: '1px solid #c084fc', boxShadow: '0 0 12px rgba(124, 58, 237, 0.5)' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(7, 11, 23, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const creativeModalBox = { display: 'flex', width: '850px', height: '540px', maxWidth: '95%', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 0 40px rgba(124, 58, 237, 0.25), 0 25px 60px rgba(0,0,0,0.8)' };
const modalLeftSplit = { flex: '1', background: 'linear-gradient(145deg, rgba(124, 58, 237, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const badgeTag = { background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', padding: '6px 12px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' };
const leftJobTitle = { fontSize: '2.1rem', fontWeight: '800', marginTop: '15px', marginBottom: '5px', color: '#fff', lineHeight: '1.2' };
const leftCompanyTitle = { fontSize: '1.15rem', color: '#a78bfa', margin: 0, fontWeight: '600' };
const leftDetailsGroup = { display: 'flex', flexDirection: 'column', gap: '10px', margin: '15px 0' };
const detailItem = { display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)' };
const qualificationsWrapper = { margin: '10px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '15px' };
const qualificationsHeading = { margin: '0 0 10px 0', fontSize: '1rem', color: '#e9d5ff', fontWeight: '700' };
const ulStyle = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' };
const liStyle = { fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'flex-start', lineHeight: '1.4' };
const leftFooterNote = { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4', margin: 0 };
const modalRightSplit = { flex: '1.2', padding: '35px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' };
const rightFormHeading = { fontSize: '1.25rem', fontWeight: '700', margin: '0 0 15px 0', color: '#f3e8ff' };
const creativeFormGroup = { marginBottom: '15px' };
const creativeLabel = { display: 'block', fontSize: '0.85rem', color: '#a78bfa', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.5px' };
const creativeTextarea = { width: '100%', padding: '12px 15px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', color: '#fff', fontSize: '13.5px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const creativeUploadBox = { position: 'relative', width: '100%' };
const uploadBoxLabel = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 15px', backgroundColor: 'rgba(124, 58, 237, 0.04)', border: '2px dashed rgba(192, 132, 252, 0.35)', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' };
const uploadMainText = { fontSize: '13.5px', fontWeight: '600', color: '#e9d5ff', marginBottom: '4px' };
const uploadSubText = { fontSize: '11px', color: 'rgba(255,255,255,0.4)' };
const creativeActionRow = { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' };
const creativeCancelBtnSymmetric = { background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '12px 26px', borderRadius: '14px', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', transition: 'all 0.2s ease', textAlign: 'center' };
const creativeSubmitBtn = { background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', border: 'none', padding: '12px 26px', borderRadius: '14px', color: '#fff', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.35)' };

export default Dashboard;