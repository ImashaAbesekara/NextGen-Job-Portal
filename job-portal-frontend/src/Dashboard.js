import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 🚀 IMPORT NEXTGEN OFFICIAL BRAND LOGO FROM ASSETS
import logoImage from './assets/logo.png'; // Handled dynamic require fallback if needed
// 🚀 IMPORT REACT TOASTIFY FOR PREMIUM POP-UP NOTIFICATIONS
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    // --- 🚀 ARCHITECTURE STATES ---
    // Manages UI navigation tabs
    const [activeTab, setActiveTab] = useState('overview');
    // Stores all available job listings fetched from the database
    const [jobData, setJobData] = useState([]);
    // Stores the current user's job applications
    const [appliedJobs, setAppliedJobs] = useState([]);
    // UI Loading state to handle data fetching delays
    const [loading, setLoading] = useState(true);
    // Search input state for filtering jobs
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic States for Application Tracking Modal
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    const [trackingApp, setTrackingApp] = useState(null);

    // Popup Modal Dynamic States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [cvFile, setCvFile] = useState(null);

    // Interactive Hover Tracking States
    const [hoveredButtonId, setHoveredButtonId] = useState(null);

    // 🧠 AI INTEGRATION STATE: Tracks if the engine is processing cover letter tokens
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    // 🎯 FETCH TARGET DATA NODES FROM SYSTEM DATABASE
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const jobsResponse = await fetch('http://localhost:5000/api/jobs');
                if (jobsResponse.ok) {
                    const jobsData = await jobsResponse.json();
                    setJobData(jobsData);
                }

                const loggedInUser = JSON.parse(localStorage.getItem('user'));

                if (loggedInUser && loggedInUser.email) {
                    const appResponse = await fetch(`http://localhost:5000/api/applications?userEmail=${loggedInUser.email}`);
                    if (appResponse.ok) {
                        const appData = await appResponse.json();
                        setAppliedJobs(appData);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard data from NextGen Database:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [activeTab]);

    // Opens the application modal when a user clicks 'Apply'
    const handleApply = (job) => {
        setSelectedJob(job);
        setCoverLetter(''); // Reset previous input text
        setIsModalOpen(true);
    };

    // 🔮 PREMIUM FEATURE: CALL COGNITIVE ENGINE NODE TO ORCHESTRATE COVER LETTER DRAFT
    const handleAiCoverLetterGeneration = async () => {
        if (!selectedJob) return;

        setIsAiGenerating(true);
        const id = toast.loading("NextGen AI is composing your premium cover letter... ⚡", { theme: "dark" });

        // 🎯 Retrieve the currently authenticated user details from local storage
        const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Job Seeker', email: '' };

        try {
            const response = await axios.post('http://localhost:5000/api/ai/generate-cover-letter', {
                jobTitle: selectedJob.title || selectedJob.role,
                companyName: selectedJob.company,
                skills: selectedJob.requirements || 'Standard industry specifications',
                // 🔥 Injecting user metadata into the payload for personalized AI generation
                candidateName: currentUser.name || 'Job Seeker',
                candidateEmail: currentUser.email || ''
            });

            if (response.data.success && response.data.coverLetter) {
                setCoverLetter(response.data.coverLetter);
                toast.update(id, { render: "Cover letter written successfully! ✨", type: "success", isLoading: false, autoClose: 3000, theme: "dark" });
            } else {
                toast.update(id, { render: "AI failed to build response blocks. ❌", type: "error", isLoading: false, autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            console.error("AI Node Error:", error);
            toast.update(id, { render: "Connection to AI processing stream lost. ❌", type: "error", isLoading: false, autoClose: 3000, theme: "dark" });
        } finally {
            setIsAiGenerating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.info("Logged out successfully. See you again! 👋", {
            position: "top-right",
            autoClose: 2000,
            theme: "dark"
        });
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    const getCategoryIcon = (category) => {
        if (!category) return '💼';
        const cat = category.toLowerCase();
        if (cat.includes('it') || cat.includes('software') || cat.includes('tech') || cat.includes('developer')) return '💻';
        if (cat.includes('manage') || cat.includes('hr') || cat.includes('business') || cat.includes('admin')) return '📊';
        if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('creative')) return '🎨';
        if (cat.includes('finance') || cat.includes('bank') || cat.includes('account')) return '💵';
        if (cat.includes('market') || cat.includes('sale') || cat.includes('advertise')) return '📈';
        return '💼';
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        if (!cvFile) {
            toast.warning("Please upload your CV before submitting! 📄", { position: "top-right", theme: "dark" });
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('user')) || { email: 'test@example.com' };

        try {
            const formData = new FormData();
            formData.append('jobId', selectedJob._id || selectedJob.id);
            formData.append('jobRole', selectedJob.title || selectedJob.role);
            formData.append('company', selectedJob.company);
            formData.append('coverLetter', coverLetter);
            formData.append('userEmail', currentUser.email);
            formData.append('cv', cvFile);

            const response = await axios.post('http://localhost:5000/api/applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201 || response.data.success) {
                toast.success("Application Submitted Successfully! 🚀", { position: "top-right", theme: "dark" });
                setAppliedJobs([...appliedJobs, {
                    jobId: selectedJob._id || selectedJob.id,
                    jobRole: selectedJob.title || selectedJob.role,
                    company: selectedJob.company,
                    coverLetter: coverLetter,
                    cv: cvFile.name,
                    appliedAt: new Date(),
                    status: 'Pending Review'
                }]);
                setCoverLetter('');
                setCvFile(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error("Failed to submit application. ❌", { position: "top-right", theme: "dark" });
        }
    };

    const filteredJobData = jobData.filter(job => {
        const query = searchQuery.toLowerCase();
        return (
            (job.title && job.title.toLowerCase().includes(query)) ||
            (job.company && job.company.toLowerCase().includes(query)) ||
            (job.location && job.location.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', background: '#0a0a0c', color: '#c084fc', fontFamily: 'sans-serif', minHeight: '100vh' }}>
                <h2>Loading NextGen Careers Infrastructure...</h2>
            </div>
        );
    }

    const activeUser = JSON.parse(localStorage.getItem('user')) || { name: 'Job Seeker', email: '' };
    const scheduledInterviews = appliedJobs.filter(app => app.status === 'Interview Scheduled');

    return (
        <div style={dashboardLayoutContainer}>

            {/* SIDEBAR */}
            <aside style={sidebarWrapper}>
                <div style={sidebarBrandArea} onClick={() => window.location.href = '/'} title="Go to Homepage">
                    <img src={logoImage} alt="NextGen Logo" style={brandLogoImageStyle} />
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
                    <button style={activeTab === 'overview' ? sidebarBtnActive : sidebarBtn} onClick={() => setActiveTab('overview')}>
                        <span style={btnIconSlot}>📊</span> Overview Hub
                    </button>
                    <button style={activeTab === 'search' ? sidebarBtnActive : sidebarBtn} onClick={() => setActiveTab('search')}>
                        <span style={btnIconSlot}>🔍</span> Explore Openings
                    </button>
                </nav>

                <div style={sidebarFooterArea}>
                    <button style={logoutBtn} onClick={handleLogout}>
                        <span style={btnIconSlot}>🛑</span> Logout Account
                    </button>
                </div>
            </aside>

            {/* MAIN WORKSPACE */}
            <main style={workspaceMainArea}>

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div style={mainContent}>
                        <div style={workspaceHeaderArea}>
                            <h1 style={workspaceTitle}>System Metrics</h1>
                            <p style={workspaceSubtitle}>Real-time analytical metrics mapping the NextGen architecture platform.</p>
                        </div>

                        {scheduledInterviews.length > 0 && (
                            <div style={premiumInterviewCardContainer}>
                                {scheduledInterviews.map((interview, idx) => (
                                    <div key={idx} style={premiumInterviewGlassCard}>
                                        <div style={interviewLeftContent}>
                                            <div style={liveBadgeContainer}>
                                                <span style={pulsingLiveDot}>●</span> NEXTGEN LIVE STREAM PORTAL
                                            </div>
                                            <h2 style={interviewRoleTitle}>{interview.jobRole}</h2>
                                            <h3 style={interviewCompanySub}>🏢 {interview.company}</h3>
                                            <div style={interviewTimingMetaRow}>
                                                <span style={metaTimeBadge}>📅 {interview.interviewDate || 'Scheduled (Check Email)'}</span>
                                                <span style={metaTimeBadge}>🕒 {interview.interviewTime || 'Confirmed Time'}</span>
                                            </div>
                                        </div>
                                        <div style={interviewRightContent}>
                                            <a href={interview.zoomLink || "https://zoom.us"} target="_blank" rel="noopener noreferrer" style={premiumJoinWorkspaceButton}>
                                                Launch Secure Session 🚀
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={summaryCardsRow}>
                            <div style={totalApplicationsCard}>
                                <div style={cardHeaderIconRow}>
                                    <h4 style={cardLabel}>Total Applications</h4>
                                    <span style={{ ...cardIconBox, color: '#3b82f6' }}>💼</span>
                                </div>
                                <p style={cardValueDark}>{appliedJobs.length}</p>
                            </div>

                            <div style={shortlistedCard}>
                                <div style={cardHeaderIconRow}>
                                    <h4 style={cardLabel}>Shortlisted</h4>
                                    <span style={{ ...cardIconBox, color: '#10b981' }}>🎯</span>
                                </div>
                                <p style={cardValueDark}>
                                    {appliedJobs.filter(app => app.status === 'Shortlisted').length}
                                </p>
                            </div>

                            <div style={pendingReviewCard}>
                                <div style={cardHeaderIconRow}>
                                    <h4 style={cardLabel}>Pending Review</h4>
                                    <span style={{ ...cardIconBox, color: '#f59e0b' }}>⏳</span>
                                </div>
                                <p style={cardValueDark}>
                                    {appliedJobs.filter(app => (app.status || 'Pending Review') === 'Pending Review').length}
                                </p>
                            </div>
                        </div>

                        <div style={tableWrapper}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={tableHeading}>Your Applied Jobs Progress</h3>
                                <span style={tableSubBadge}>Live Tracking</span>
                            </div>

                            {appliedJobs.length > 0 ? (
                                <div style={tableContainer}>
                                    <div style={thGroupStyle}>
                                        <div style={{ flex: 2, color: '#cbd5e1', fontWeight: '800' }}>Job Role & Company</div>
                                        <div style={{ flex: 1, color: '#cbd5e1', fontWeight: '800' }}>Applied Date</div>
                                        <div style={{ flex: 1, color: '#cbd5e1', fontWeight: '800', textAlign: 'center' }}>Status</div>
                                        <div style={{ flex: 1, color: '#cbd5e1', fontWeight: '800', textAlign: 'right' }}>Action</div>
                                    </div>

                                    {appliedJobs.map((app, index) => {
                                        const currentStatus = app.status || 'Pending Review';
                                        const isPending = currentStatus === 'Pending Review' || currentStatus === 'Pending';
                                        const isScheduled = currentStatus === 'Interview Scheduled';
                                        return (
                                            <div key={index} style={creativeRowCard}>
                                                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={rowJobRole}>{app.jobRole}</span>
                                                    <span style={rowCompany}>🏢 {app.company}</span>
                                                </div>
                                                <div style={{ flex: 1, color: '#e2e8f0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                                                    📅 {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={isScheduled ? scheduledBadgeStyleRow : (isPending ? pendingBadgeStyle : shortlistedBadgeStyle)}>
                                                        <span style={isScheduled ? scheduledDotRow : (isPending ? pendingDot : shortlistedDot)}>●</span> {currentStatus}
                                                    </span>
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <button style={viewDetailsBtn} onClick={() => { setTrackingApp(app); setIsTrackModalOpen(true); }}>
                                                        Track 🚀
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p style={{ color: '#cbd5e1', textAlign: 'center', padding: '30px', fontSize: '1rem' }}>
                                    You haven't applied for any jobs yet. Click 'Explore Openings' to start!
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: EXPLORE CAREER OPENINGS */}
                {activeTab === 'search' && (
                    <div>
                        <div style={heroSectionHeaderArea}>
                            <h1 style={heroTitle}>Find Your Dream Career</h1>
                            <p style={heroSubtitle}>Browse through verified corporate opportunities today</p>

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
                                <div style={jobGrid3Columns}>
                                    {filteredJobData.map((job) => {
                                        const jobIdStr = job._id || job.id;
                                        const isHovered = hoveredButtonId === jobIdStr;
                                        return (
                                            <div key={jobIdStr} style={jobCard}>
                                                <div>
                                                    <div style={cardHeader}>
                                                        <h3 style={roleNameDark}>{job.title}</h3>
                                                        <span style={jobTagIcon}>{getCategoryIcon(job.category)}</span>
                                                    </div>
                                                    <p style={companyName}>🏢 {job.company} <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>• {job.category || 'General'}</span></p>

                                                    <div style={detailsRow}>
                                                        <span style={cardDetailMetaText}>📍 {job.location}</span>
                                                        <span style={cardDetailMetaText}>💰 {job.salary}</span>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
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
                                <div style={{ textAlign: 'center', padding: '50px', color: '#cbd5e1' }}>
                                    <h3>❌ No jobs match your search criteria. Try another keyword!</h3>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* APPLICATION POPUP FRAME MODAL WITH AI COVER LETTER INTEGRATION */}
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
                                <div style={detailItem}>📍 <span style={{ marginLeft: '8px', color: '#fff', fontWeight: '500' }}>{selectedJob.location}</span></div>
                                <div style={detailItem}>💰 <span style={{ marginLeft: '8px', color: '#fff', fontWeight: '500' }}>{selectedJob.salary}</span></div>
                            </div>

                            <div style={qualificationsWrapper}>
                                <h4 style={qualificationsHeading}>Requirements:</h4>
                                <ul style={ulStyle}>
                                    {selectedJob.requirements ? (
                                        selectedJob.requirements.split(',').map((req, index) => (
                                            <li key={index} style={liStyle}>
                                                <span style={{ color: '#c084fc', marginRight: '8px' }}>✦</span> {req.trim()}
                                            </li>
                                        ))
                                    ) : (
                                        <li style={liStyle}>✦ Professional qualifications required.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div style={modalRightSplit}>
                            <h3 style={rightFormHeading}>Complete Your Application</h3>
                            <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={creativeFormGroup}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <label style={{ ...creativeLabel, margin: 0 }}>Cover Letter / Brief Pitch</label>

                                            {/* 🔥 BRAND NEW: NEXTGEN AI COVER LETTER WRITER BUTTON */}
                                            <button
                                                type="button"
                                                onClick={handleAiCoverLetterGeneration}
                                                disabled={isAiGenerating}
                                                style={aiGeneratorTriggerBtn}
                                            >
                                                {isAiGenerating ? "Generating..." : "✨ Auto-Write with AI"}
                                            </button>
                                        </div>
                                        <textarea
                                            style={creativeTextarea}
                                            placeholder="Introduce yourself and state why you're a perfect fit or click 'Auto-Write with AI'..."
                                            rows="4"
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
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setCvFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="creative-cv-upload" style={uploadBoxLabel}>
                                                <span style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{cvFile ? '📄' : '☁️'}</span>
                                                <span style={uploadMainText}>{cvFile ? cvFile.name : "Click to upload your resume"}</span>
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

            {/* APPLICATION TRACKER MODAL */}
            {isTrackModalOpen && trackingApp && (
                <div style={modalOverlay}>
                    <div style={{ ...creativeModalBox, width: '500px', height: 'auto', padding: '30px', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '800' }}>Application Terminal</h3>
                            <button onClick={() => setIsTrackModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ marginBottom: '25px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#c084fc', fontSize: '1.15rem', fontWeight: '700' }}>{trackingApp.jobRole}</h4>
                            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '600' }}>🏢 Company: {trackingApp.company}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative', paddingLeft: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>✓</div>
                                <div>
                                    <span style={{ color: '#fff', fontWeight: '700', display: 'block' }}>Application Submitted</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Successfully registered in system database</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: (trackingApp.status === 'Shortlisted' || trackingApp.status === 'Interview Scheduled') ? '#34d399' : 'rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold',
                                    border: (trackingApp.status === 'Shortlisted' || trackingApp.status === 'Interview Scheduled') ? 'none' : '1px solid rgba(255,255,255,0.15)'
                                }}>
                                    {(trackingApp.status === 'Shortlisted' || trackingApp.status === 'Interview Scheduled') ? '✓' : '2'}
                                </div>
                                <div>
                                    <span style={{ color: (trackingApp.status === 'Shortlisted' || trackingApp.status === 'Interview Scheduled') ? '#fff' : '#64748b', fontWeight: '700', display: 'block' }}>Profile Shortlisted</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Hiring team approved candidate criteria</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: trackingApp.status === 'Interview Scheduled' ? '#10b981' : 'rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold',
                                    border: trackingApp.status === 'Interview Scheduled' ? 'none' : '1px solid rgba(255,255,255,0.15)'
                                }}>
                                    {trackingApp.status === 'Interview Scheduled' ? '✓' : '3'}
                                </div>
                                <div>
                                    <span style={{ color: trackingApp.status === 'Interview Scheduled' ? '#34d399' : '#64748b', fontWeight: '700', display: 'block' }}>Interview Confirmed 🔥</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Live streaming panel slot allocated</span>
                                </div>
                            </div>
                        </div>

                        <button style={{ ...creativeCancelBtnSymmetric, marginTop: '30px', width: '100%' }} onClick={() => setIsTrackModalOpen(false)}>
                            Dismiss Terminal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 🔥 CSS SCRIPTING OBJECT NODES ---
// 🎯 FIXED: Main container handles proper full height alignment
const dashboardLayoutContainer = { display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#000000', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };
// 🎯 FIXED: Sidebar retains its unique soft premium translucent look just like the Admin framework
const sidebarWrapper = { width: '280px', background: 'rgba(15, 23, 42, 0.6)', borderRight: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', padding: '35px 20px', boxSizing: 'border-box', position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100, justifyContent: 'space-between' };
const sidebarBrandArea = { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '35px', paddingLeft: '5px', cursor: 'pointer' };
const brandLogoImageStyle = { width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' };
const brandText = { margin: 0, color: '#fff', fontSize: '1.45rem', fontWeight: '800', letterSpacing: '0.5px' };
const sidebarUserBadge = { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '12px 15px', marginBottom: '30px' };
const avatarCircle = { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' };
const userInfoWrapper = { display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const userNameText = { color: '#fff', fontWeight: '700', fontSize: '0.95rem' };
const userRoleSub = { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '500' };
const sidebarNavGroup = { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 };
const sidebarBtn = { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'transparent', border: 'none', borderRadius: '14px', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' };
const sidebarBtnActive = { ...sidebarBtn, background: 'rgba(124, 58, 237, 0.25)', color: '#fff', fontWeight: '700', border: '1px solid rgba(124, 58, 237, 0.3)' };
const btnIconSlot = { fontSize: '1.1rem' };
const sidebarFooterArea = { paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' };
const logoutBtn = { ...sidebarBtn, color: '#f87171', fontWeight: '700', background: 'rgba(239, 68, 68, 0.12)', marginTop: '5px', border: '1px solid rgba(239, 68, 68, 0.15)' };
// 🎯 FIXED: Main workspace converted to pure solid black to give it the high-performance architectural look
const workspaceMainArea = { flex: 1, marginLeft: '280px', padding: '40px 50px 60px 50px', boxSizing: 'border-box', minHeight: '100vh', backgroundColor: '#0a0a0c' };
const workspaceHeaderArea = { marginBottom: '35px', paddingLeft: '5px' };
const workspaceTitle = { margin: 0, fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' };
const workspaceSubtitle = { margin: '6px 0 0 0', fontSize: '0.85rem', color: '#8e9aa8', opacity: 0.8 };
const mainContent = { width: '100%', maxWidth: '1200px' };
const summaryCardsRow = { display: 'flex', gap: '25px', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap' };

// 🎯 FIXED: Base summary cards structure optimized with custom left solid borders mapping the Admin Layout rules
const summaryCard = { flex: 1, minWidth: '240px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '22px 25px', display: 'flex', flexDirection: 'column', gap: '12px' };
const totalApplicationsCard = { ...summaryCard, borderLeft: '4px solid #3b82f6' };
const shortlistedCard = { ...summaryCard, borderLeft: '4px solid #10b981' };
const pendingReviewCard = { ...summaryCard, borderLeft: '4px solid #f59e0b' };

const cardHeaderIconRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardLabel = { margin: 0, fontSize: '0.75rem', color: '#8e9aa8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' };
const cardIconBox = { display: 'none' }; // Retained original layout node structure while rendering invisible for cleaner admin aesthetic mapping
const cardValueDark = { margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', lineHeight: 1 };
const tableWrapper = { background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', padding: '30px' };
const tableHeading = { marginTop: 0, marginBottom: 0, color: '#ffffff', fontSize: '1.25rem', fontWeight: '800' };
const tableSubBadge = { background: 'rgba(124, 58, 237, 0.25)', color: '#e9d5ff', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700' };
const tableContainer = { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' };
const thGroupStyle = { display: 'flex', padding: '10px 20px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.7px' };
const creativeRowCard = { display: 'flex', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', padding: '18px 20px', alignItems: 'center', transition: '0.2s all ease' };
const rowJobRole = { fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' };
const rowCompany = { fontSize: '0.9rem', color: '#c084fc', fontWeight: '600' };
const baseBadge = { padding: '5px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' };
const pendingBadgeStyle = { ...baseBadge, background: 'rgba(251, 191, 36, 0.15)', color: '#fde047', border: '1px solid rgba(251, 191, 36, 0.25)' };
const shortlistedBadgeStyle = { ...baseBadge, background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.25)' };
const pendingDot = { color: '#fde047', fontSize: '0.7rem' };
const shortlistedDot = { color: '#34d399', fontSize: '0.7rem' };
const viewDetailsBtn = { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', transition: '0.2s' };
const heroSectionHeaderArea = { textAlign: 'center', marginBottom: '45px', marginTop: '10px' };
const heroTitle = { fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: '#ffffff', letterSpacing: '-0.5px' };
const heroSubtitle = { fontSize: '1.05rem', marginBottom: '25px', color: '#cbd5e1' };
const searchBarContainer = { display: 'flex', maxWidth: '650px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.7)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)' };
const searchInput = { flex: 1, background: 'transparent', border: 'none', padding: '10px 15px', color: '#ffffff', fontSize: '15px', outline: 'none' };
const searchBtn = { background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' };
const jobGrid3Columns = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const jobCard = { display: 'flex', flexDirection: 'column', justifycontent: 'space-between', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', borderRadius: '24px', padding: '25px', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)', transition: 'all 0.3s ease' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '10px' };
const roleNameDark = { fontSize: '1.2rem', margin: 0, fontWeight: '800', color: '#ffffff', lineHeight: '1.3' };
const jobTagIcon = { width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 };
const companyName = { color: '#c084fc', fontWeight: '700', margin: '0 0 12px 0', fontSize: '0.95rem' };
const detailsRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', fontWeight: '500' };
const cardDetailMetaText = { display: 'inline-flex', alignItems: 'center', color: '#f1f5f9' };
const jobTag = { background: 'rgba(255, 255, 255, 0.06)', color: '#f1f5f9', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' };
const applyButtonStyle = { padding: '10px 18px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.85rem' };
const applyButtonStyleHover = { ...applyButtonStyle, background: '#7c3aed', borderColor: '#7c3aed', boxShadow: '0 6px 20px rgba(124, 58, 237, 0.5)' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const creativeModalBox = { display: 'flex', width: '820px', height: '500px', maxWidth: '95%', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)' };
const modalLeftSplit = { flex: '1', background: 'rgba(15, 23, 42, 0.6)', borderRight: '1px solid rgba(255, 255, 255, 0.08)', padding: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' };
const badgeTag = { background: 'rgba(192, 132, 252, 0.15)', padding: '5px 12px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' };
const leftJobTitle = { fontSize: '1.8rem', fontWeight: '800', marginTop: '12px', marginBottom: '5px', color: '#fff' };
const leftCompanyTitle = { fontSize: '1.1rem', color: '#c084fc', margin: 0, fontWeight: '700' };
const leftDetailsGroup = { display: 'flex', flexDirection: 'column', gap: '8px', margin: '15px 0' };
const detailItem = { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#f1f5f9' };
const qualificationsWrapper = { margin: '10px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '15px' };
const qualificationsHeading = { margin: '0 0 8px 0', fontSize: '0.95rem', color: '#fff', fontWeight: '700' };
const ulStyle = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' };
const liStyle = { fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', fontWeight: '500' };
const modalRightSplit = { flex: '1.2', padding: '35px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#1e293b' };
const rightFormHeading = { fontSize: '1.2rem', fontWeight: '800', margin: '0 0 15px 0', color: '#ffffff' };
const creativeFormGroup = { marginBottom: '15px' };
const creativeLabel = { display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '700' };
const creativeTextarea = { width: '100%', padding: '12px 15px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#ffffff', fontSize: '13.5px', outline: 'none', resize: 'none', boxSizing: 'border-box' };
const creativeUploadBox = { position: 'relative', width: '100%' };
const uploadBoxLabel = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '2px dashed rgba(255, 255, 255, 0.15)', borderRadius: '14px', textAlign: 'center', cursor: 'pointer' };
const uploadMainText = { fontSize: '13px', fontWeight: '600', color: '#cbd5e1' };
const creativeActionRow = { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' };
const creativeCancelBtnSymmetric = { background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '10px 22px', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' };
const creativeSubmitBtn = { background: '#7c3aed', border: 'none', padding: '10px 22px', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' };
const premiumInterviewCardContainer = { width: '100%', marginBottom: '35px' };
const premiumInterviewGlassCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)', backdropFilter: 'blur(20px)', padding: '30px', borderRadius: '24px', boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)', flexWrap: 'wrap', gap: '20px' };
const interviewLeftContent = { display: 'flex', flexDirection: 'column', gap: '6px' };
const liveBadgeContainer = { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', background: 'rgba(52, 211, 153, 0.12)', padding: '6px 14px', borderRadius: '30px', width: 'fit-content', border: '1px solid rgba(52, 211, 153, 0.2)' };
const pulsingLiveDot = { color: '#34d399', fontSize: '0.85rem' };
const interviewRoleTitle = { margin: '4px 0 0 0', color: '#ffffff', fontSize: '1.75rem', fontWeight: '800' };
const interviewCompanySub = { margin: 0, color: '#c084fc', fontSize: '1.05rem', fontWeight: '700' };
const interviewTimingMetaRow = { display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' };
const metaTimeBadge = { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' };
const interviewRightContent = { display: 'flex', alignItems: 'center' };
const premiumJoinWorkspaceButton = { padding: '14px 28px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', textDecoration: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '0.95rem', boxShadow: '0 6px 25px rgba(16, 185, 129, 0.4)', transition: 'all 0.2s ease', display: 'inline-block' };
const scheduledBadgeStyleRow = { ...baseBadge, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)' };
const scheduledDotRow = { color: '#34d399', fontSize: '0.7rem' };

const aiGeneratorTriggerBtn = {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)',
    transition: 'all 0.2s ease'
};

export default Dashboard;