import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Note: Keep your standard axios import
import backgroundImage from './assets/dBg.jpg';

function Dashboard({ activeTab, setActiveTab }) {
    // --- 🚀 STATES ---
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
                // 1. Fetch all jobs for the search tab
                const jobsResponse = await fetch('http://localhost:5000/api/jobs');
                if (jobsResponse.ok) {
                    const jobsData = await jobsResponse.json();
                    setJobData(jobsData);
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

    // Handle form submission to NextGen MongoDB Database
    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        if (!cvFile) {
            alert("Please upload your CV before submitting! 📄");
            return;
        }


        const currentUser = JSON.parse(localStorage.getItem('user'));


        if (!currentUser || !currentUser.email) {
            alert("Session expired! Please login again. ❌");
            return;
        }

        const applicationData = {
            jobId: selectedJob.id,
            jobRole: selectedJob.role,
            company: selectedJob.company,
            coverLetter: coverLetter,
            cv: cvFile.name,
            userEmail: currentUser.email
        };

        try {
            // 🎯 FIXED URL: Forwarding data to the correct standardized endpoint mapping
            const response = await axios.post('http://localhost:5000/api/applications', applicationData);

            if (response.status === 201 || response.data.success) {
                alert("🎉 Success: Application submitted successfully to NextGen Database!");

                // Optimistically update the local state array view UI live
                setAppliedJobs([...appliedJobs, { ...applicationData, appliedAt: new Date(), status: 'Pending Review' }]);

                // Clear input fields and close popup layout
                setCoverLetter('');
                setCvFile(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error submitting application: ", error);
            alert("❌ Failed to submit application. Check if server terminal is running.");
        }
    };

    // Filter jobs based on user search query
    const filteredJobData = jobData.map(categorySection => {
        const filteredJobs = categorySection.jobs ? categorySection.jobs.filter(job => {
            const query = searchQuery.toLowerCase();
            return (
                job.role.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query)
            );
        }) : [];
        return { ...categorySection, jobs: filteredJobs };
    }).filter(categorySection => categorySection.jobs.length > 0);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', color: '#fff', fontFamily: 'sans-serif' }}>
                <h2>Loading NextGen Careers from Database...</h2>
            </div>
        );
    }

    return (
        <div style={dashboardWrapper}>

            {/* =========================================================
                📉 TAB 1: OVERVIEW (DYNAMIC COUNTERS & LIVE TRACKING)
               ========================================================= */}
            {activeTab === 'overview' && (
                <div style={mainContent}>

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
                            {/* Dynamically filtering shortlisted stats status array */}
                            <p style={{ ...cardValueWhite, color: '#10b981' }}>
                                {appliedJobs.filter(app => app.status === 'Shortlisted').length}
                            </p>
                        </div>

                        <div style={summaryCard}>
                            <div style={cardHeaderIconRow}>
                                <h4 style={cardLabel}>Pending Review</h4>
                                <span style={{ ...cardIconBox, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>⏳</span>
                            </div>
                            {/* Dynamically filtering pending counter metrics mapping */}
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
                                You haven't applied for any jobs yet. Go to 'Search & Apply Jobs' tab to start! 🚀
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* =========================================================
                🔍 TAB 2: SEARCH JOBS (3-COLUMN RESPONSIVE MULTI-POST GRID)
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
                        {filteredJobData.length > 0 ? (
                            filteredJobData.map((section, idx) => (
                                <div key={idx} style={categoryWrapper}>
                                    <div style={categoryHeader}>
                                        <span style={categoryIcon}>{section.icon}</span>
                                        <h2 style={categoryTitleTextWhite}>{section.category}</h2>
                                    </div>

                                    <div style={jobGrid3Columns}>
                                        {section.jobs && section.jobs.map((job) => {
                                            const isHovered = hoveredButtonId === job.id;
                                            return (
                                                <div key={job.id} style={jobCard}>
                                                    <div style={cardHeader}>
                                                        <h3 style={roleNameWhite}>{job.role}</h3>
                                                        <span style={jobTag}>{job.type || 'Full Time'}</span>
                                                    </div>
                                                    <p style={companyName}>{job.company}</p>

                                                    <div style={detailsRow}>
                                                        <span>📍 {job.location}</span>
                                                        <span>💰 {job.salary}</span>
                                                    </div>

                                                    <button
                                                        style={isHovered ? applyButtonStyleHover : applyButtonStyle}
                                                        onMouseEnter={() => setHoveredButtonId(job.id)}
                                                        onMouseLeave={() => setHoveredButtonId(null)}
                                                        onClick={() => handleApply(job)}
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.6)' }}>
                                <h3>❌ No jobs match your search criteria. Try a different keyword!</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* =========================================================
                🔮 PREMIUM POPUP MODAL (DYNAMIC QUALIFICATIONS DISPLAY)
               ========================================================= */}
            {isModalOpen && selectedJob && (
                <div style={modalOverlay}>
                    <div style={creativeModalBox}>
                        <div style={modalLeftSplit}>
                            <div>
                                <span style={badgeTag}>NextGen Verified</span>
                                <h2 style={leftJobTitle}>{selectedJob.role}</h2>
                                <p style={leftCompanyTitle}>{selectedJob.company}</p>
                            </div>

                            <div style={leftDetailsGroup}>
                                <div style={detailItem}>📍 <span style={{ marginLeft: '8px' }}>{selectedJob.location}</span></div>
                                <div style={detailItem}>💰 <span style={{ marginLeft: '8px' }}>{selectedJob.salary}</span></div>
                            </div>

                            <div style={qualificationsWrapper}>
                                <h4 style={qualificationsHeading}>Requirements & Qualifications:</h4>
                                <ul style={ulStyle}>
                                    {selectedJob.qualifications && selectedJob.qualifications.length > 0 ? (
                                        selectedJob.qualifications.map((req, index) => (
                                            <li key={index} style={liStyle}>
                                                <span style={{ color: '#c084fc', marginRight: '8px' }}>✦</span> {req}
                                            </li>
                                        ))
                                    ) : (
                                        <li style={liStyle}>
                                            <span style={{ color: '#c084fc', marginRight: '8px' }}>✦</span> Professional qualifications required. Check MongoDB collection specs.
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
                                                onChange={(e) => setCvFile(e.target.files[0])}
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

// --- 🔥 CSS STYLES (INLINE INDUSTRY ARCHITECTURE DESIGN) ---
const dashboardWrapper = { minHeight: '100vh', width: '100%', background: `linear-gradient(rgba(13, 18, 36, 0.72), rgba(10, 14, 28, 0.78)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', paddingBottom: '60px', paddingTop: '110px', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };
const mainContent = { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' };
const summaryCardsRow = { display: 'flex', gap: '25px', justifyContent: 'space-between', marginBottom: '50px', flexWrap: 'wrap' };
const summaryCard = { flex: 1, minWidth: '280px', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '25px', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', gap: '12px' };
const cardHeaderIconRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardLabel = { margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' };
const cardIconBox = { width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' };
const cardValueWhite = { margin: 0, fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px', color: '#ffffff', textShadow: '0 2px 10px rgba(255,255,255,0.1)' };
const tableWrapper = { background: 'rgba(13, 17, 33, 0.65)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(25px)', borderRadius: '28px', padding: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' };
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
const heroSection = { padding: '30px 20px 40px', textAlign: 'center' };
const heroTitle = { fontSize: '3rem', fontWeight: '800', marginBottom: '10px', color: '#e9d5ff', textShadow: '3px 3px 6px rgba(0, 0, 0, 0.95), 0px 0px 12px rgba(168, 85, 247, 0.4)' };
const heroSubtitle = { fontSize: '1.4rem', marginBottom: '40px', color: 'rgba(243, 232, 255, 0.85)', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' };
const searchBarContainer = { display: 'flex', maxWidth: '700px', margin: '0 auto', background: 'rgba(15, 12, 30, 0.85)', backdropFilter: 'blur(12px)', padding: '8px', borderRadius: '16px', border: '1px solid #C084fc', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' };
const searchInput = { flex: 1, background: 'transparent', border: 'none', padding: '12px 20px', color: '#f3e8ff', fontSize: '16px', outline: 'none' };
const searchBtn = { background: '#7c3aed', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const categoryWrapper = { marginBottom: '60px' };
const categoryHeader = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' };
const categoryIcon = { fontSize: '2rem' };
const categoryTitleTextWhite = { fontSize: '1.8rem', fontWeight: '700', color: '#ffffff', textShadow: '0 2px 10px rgba(255,255,255,0.15)' };
const jobGrid3Columns = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const jobCard = { background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', padding: '30px', backdropFilter: 'blur(20px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' };
const roleNameWhite = { fontSize: '1.4rem', margin: 0, fontWeight: '700', color: '#ffffff', textShadow: '0 2px 8px rgba(255,255,255,0.1)' };
const jobTag = { background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' };
const companyName = { color: '#a78bfa', fontWeight: '600', marginBottom: '20px' };
const detailsRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '25px' };
const applyButtonStyle = { width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(167, 139, 250, 0.4)', color: '#fff', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' };
const applyButtonStyleHover = { ...applyButtonStyle, background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', border: '1px solid #c084fc', boxShadow: '0 0 12px rgba(124, 58, 237, 0.5)' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(7, 11, 23, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const creativeModalBox = { display: 'flex', width: '850px', height: '540px', maxWidth: '95%', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 0 40px rgba(124, 58, 237, 0.25), 0 25px 60px rgba(0,0,0,0.8)' };
const modalLeftSplit = { flex: '1', background: 'linear-gradient(145deg, rgba(124, 58, 237, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const badgeTag = { background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', padding: '6px 12px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' };
const leftJobTitle = { fontSize: '2.1rem', fontWeight: '800', marginTop: '15px', marginBottom: '5px', color: '#fff', lineHeight: '1.2' };
const leftCompanyTitle = { fontSize: '1.15rem', color: '#a78bfa', margin: 0, fontWeight: '600' };
const leftDetailsGroup = { display: 'flex', flexDirection: 'column', gap: '10px', margin: '15px 0' };
const detailItem = { display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)' };
const qualificationsWrapper = { margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '15px' };
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