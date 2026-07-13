import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logoImage from './assets/logo.png';
import {
  FaChartPie, FaBriefcase, FaSignOutAlt, FaPlus, FaBuilding,
  FaFileDownload, FaEnvelopeOpenText, FaCalendarAlt, FaClock, FaVideo, FaTimes,
  FaMapMarkerAlt, FaMoneyBillWave, FaTags, FaAlignLeft, FaHeading
} from 'react-icons/fa';

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [jobsCount, setJobsCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [companyName, setCompanyName] = useState('NextGen Partner');
  const [showPostModal, setShowPostModal] = useState(false);

  // States for handling the Professional Cover Letter Modal view
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [showLetterModal, setShowLetterModal] = useState(false);

  // --- 🚀 STATES FOR THE ENHANCED INTERVIEW SCHEDULER WORKSPACE ---
  const [showSchedulerWorkspace, setShowSchedulerWorkspace] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedApplicantEmail, setSelectedApplicantEmail] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [interviewData, setInterviewData] = useState({
    interviewDate: '',
    interviewTime: '',
    meetingLink: ''
  });

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-Time',
    category: 'Technology & IT', // Default fall-back option state mapping
    requirements: ''
  });

  // --- 🧠 AI INTEGRATION STATE ---
  // Tracks if the AI engine is actively generating the job description tokens
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || localStorage.getItem('role') !== 'employer') {
      navigate('/login');
      return;
    }

    if (user && user.company) {
      setCompanyName(user.company);
      setJobData(prev => ({ ...prev, company: user.company }));
    }

    fetchDashboardData();
  }, [navigate]);

  /**
   * @desc    Fetch metric analytics records dynamically for the logged-in employer
   * @access  Private (Employer)
   */
  const fetchDashboardData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const currentEmployerId = user._id || user.id;

      if (!currentEmployerId) {
        console.warn("Operation aborted: Employer ID identifier is missing inside the local state context.");
        return;
      }

      const jobsResponse = await axios.get(`http://localhost:5000/api/jobs/employer/${currentEmployerId}`);

      if (Array.isArray(jobsResponse.data)) {
        setJobsCount(jobsResponse.data.length);
      }

      if (user.company) {
        const appsResponse = await axios.get(`http://localhost:5000/api/applications?company=${user.company}`);
        setApplications(appsResponse.data);
      }
    } catch (error) {
      console.error("Dashboard fetching failure context logs:", error);
      toast.error("Failed to fetch real-time database records! ❌");
    }
  };

  /**
   * @desc    Triggers a new window view viewport to access binary static files from server
   * @param   {String} cvFileName - Unique identifier filename mapping inside static folder
   */
  const handleViewCV = (cvFileName) => {
    if (!cvFileName) {
      toast.warning("No dynamic attachment resource linked onto this application profile node! ⚠️");
      return;
    }
    window.open(`http://localhost:5000/uploads/${cvFileName}`, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handles scheduling state mutations inside the interactive calendar setup form
  const handleInterviewInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 🔮 PREMIUM FEATURE: CALL COGNITIVE ENGINE NODE TO ORCHESTRATE AI JOB DESCRIPTION DRAFT
  const handleAiJobDescriptionGeneration = async () => {
    if (!jobData.title) {
      toast.warning("Please input a Job Title first so AI can tailor the description! 🏷️");
      return;
    }

    setIsAiGenerating(true);
    const id = toast.loading("NextGen AI is orchestrating your premium job description... ⚡", { theme: "dark" });

    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate-job-description', {
        jobTitle: jobData.title,
        companyName: companyName,
        requirements: jobData.requirements || 'Standard corporate operational requirements'
      });

      if (response.data.success && response.data.jobDescription) {
        setJobData(prev => ({ ...prev, requirements: response.data.jobDescription }));
        toast.update(id, { render: "Job description compiled successfully! ✨", type: "success", isLoading: false, autoClose: 3000, theme: "dark" });
      } else {
        toast.update(id, { render: "AI failed to build response blocks. ❌", type: "error", isLoading: false, autoClose: 3000, theme: "dark" });
      }
    } catch (error) {
      console.error("AI Generation Node Error:", error);
      toast.update(id, { render: "Connection to AI processing stream lost. ❌", type: "error", isLoading: false, autoClose: 3000, theme: "dark" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    if (!jobData.title || !jobData.location || !jobData.salary || !jobData.requirements) {
      toast.error("Please provide all required core job details! ⚠️");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const postData = {
        ...jobData,
        employerId: user ? (user._id || user.id) : null
      };

      await axios.post('http://localhost:5000/api/jobs/create', postData);

      toast.success("New Job Position Published to Database! 🚀");
      setShowPostModal(false);
      fetchDashboardData();

      setJobData({
        title: '',
        company: user?.company || 'NextGen',
        location: '',
        salary: '',
        type: 'Full-Time',
        category: 'Technology & IT',
        requirements: ''
      });
    } catch (err) {
      toast.error("Server synchronization rejection on job broadcast.");
    }
  };

  // Standard Shortlist Action: Updates status dynamically to database without loading scheduler panel
  const handleDirectShortlist = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: 'Shortlisted' });
      setApplications(prev =>
        prev.map(app => app._id === id ? { ...app, status: 'Shortlisted' } : app)
      );
      toast.success("Applicant transitioned to Shortlisted status! 🎯");
    } catch (error) {
      toast.error("Failed to update execution state on application node.");
    }
  };

  // Standard Reject Action: Triggers direct operational state mutation to Rejected
  const handleRejectStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: 'Rejected' });
      setApplications(prev =>
        prev.map(app => app._id === id ? { ...app, status: 'Rejected' } : app)
      );
      toast.error("Application marked as Rejected ❌");
    } catch (error) {
      toast.error("Failed to update execution state on application node.");
    }
  };

  // Core Handler: Dispatches calendar schedule specifications data straight to backend application route
  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();

    if (!interviewData.interviewDate || !interviewData.interviewTime || !interviewData.meetingLink) {
      toast.error("Please specify all required calendar setup details! ⚠️");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/applications/${selectedApplicationId}/status`, {
        status: 'Interview Scheduled',
        seekerEmail: selectedApplicantEmail,
        jobRole: selectedJobRole,
        company: companyName,
        interviewDate: interviewData.interviewDate,
        interviewTime: interviewData.interviewTime,
        meetingLink: interviewData.meetingLink
      });

      setApplications(prev =>
        prev.map(app => app._id === selectedApplicationId ? { ...app, status: 'Interview Scheduled' } : app)
      );

      toast.success("Interview Officially Logged & Confirmation Email Dispatched! 📩🎯");
      setShowSchedulerWorkspace(false);

      setInterviewData({ interviewDate: '', interviewTime: '', meetingLink: '' });
    } catch (error) {
      console.error(error);
      toast.error("Failed to commit interview timeline criteria nodes to database.");
    }
  };

  // Routes to landing page `/` upon termination securely
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out securely. See you soon! 👋");
    navigate('/');
  };

  // --- Theme Style Setup Map Configuration ---
  const dashboardWrapper = { display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'sans-serif' };

  const sidebarStyle = {
    width: '280px', background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(15px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column',
    padding: '35px 20px', position: 'fixed', height: '100vh', boxSizing: 'border-box', justifyContent: 'space-between', zIndex: 100
  };

  const brandArea = { display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '5px' };
  const brandTitle = { fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#fff', letterSpacing: '0.5px' };
  const companyBadge = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: '12px', fontSize: '13px', color: '#c084fc', fontWeight: '600', marginTop: '15px', marginBottom: '35px', width: 'fit-content' };
  const menuGroup = { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' };

  const sidebarButton = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px', borderRadius: '14px',
    border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s', textAlign: 'left',
    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent', color: isActive ? '#fff' : '#94a3b8',
    borderStyle: isActive ? 'solid' : 'none', borderWidth: '1px', borderColor: 'rgba(124, 58, 237, 0.25)'
  });

  const logoutBtnStyle = { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.15)', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' };

  const mainContentStyle = { flex: 1, marginLeft: '280px', padding: '40px 50px', boxSizing: 'border-box', minWidth: 0 };
  const topHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: 'rgba(30, 41, 59, 0.2)', padding: '20px 30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' };
  const cardStyle = { background: 'rgba(30, 41, 59, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'left' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'rgba(30, 41, 59, 0.15)', borderRadius: '16px', overflow: 'hidden' };
  const thStyle = { backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '16px', color: '#94a3b8', fontSize: '13px', textAlign: 'left', fontWeight: '600' };
  const tdStyle = { padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '14px', color: '#cbd5e1', verticalAlign: 'middle' };
  const actionBtn = (bg) => ({ padding: '6px 12px', borderRadius: '8px', border: 'none', color: '#fff', backgroundColor: bg, cursor: 'pointer', fontWeight: '600', fontSize: '12px', transition: '0.2s' });

  const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };

  // Premium job post modal context styles map
  const modalContent = { background: '#111827', border: '1px solid rgba(255,255,255,0.07)', padding: '35px', borderRadius: '24px', width: '550px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' };
  const inputContainer = { position: 'relative', display: 'flex', alignItems: 'center', margin: '8px 0 16px 0' };
  const inputIconStyle = { position: 'absolute', left: '16px', color: '#64748b', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '12px 16px 12px 45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', transition: '0.2s', boxSizing: 'border-box' };
  const selectStyle = { width: '100%', padding: '12px 16px 12px 42px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box' };
  const textareaStyle = { width: '100%', padding: '14px 16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' };

  const aiGeneratorTriggerBtn = {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  return (
    <div style={dashboardWrapper}>
      <ToastContainer position="top-right" theme="dark" />

      {/* LEFT SIDEBAR PANEL */}
      <div style={sidebarStyle}>
        <div style={{ width: '100%' }}>
          <div style={brandArea}>
            <img src={logoImage} alt="NextGen Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }} />
            <h1 style={brandTitle}>NextGen</h1>
          </div>

          <div style={companyBadge}>
            <FaBuilding size={14} />
            <span>{companyName}</span>
          </div>

          <div style={menuGroup}>
            <button onClick={() => { setActiveTab('overview'); setShowSchedulerWorkspace(false); }} style={sidebarButton(activeTab === 'overview' && !showSchedulerWorkspace)}>
              <FaChartPie size={18} />
              <span>Overview Analytics</span>
            </button>
            <button onClick={() => { setActiveTab('applications'); }} style={sidebarButton(activeTab === 'applications' || showSchedulerWorkspace)}>
              <FaBriefcase size={18} />
              <span>Manage Pipelines</span>
            </button>
          </div>
        </div>

        <button onClick={handleLogout} style={logoutBtnStyle}>
          <FaSignOutAlt size={18} />
          <span>Exit Terminal</span>
        </button>
      </div>

      {/* RIGHT CONTENT AREA VIEWPORT */}
      <div style={mainContentStyle}>
        <div style={topHeaderStyle}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800' }}>Enterprise Workspace</h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Continuous operational records tracking terminal node.</p>
          </div>
          <button onClick={() => setShowPostModal(true)} style={{ padding: '12px 24px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)' }}>
            <FaPlus size={14} />
            <span>Publish Placement</span>
          </button>
        </div>

        {/* CONDITION 1: DISPLAY CORE OVERVIEW ANALYTICS TERMINAL TAB */}
        {activeTab === 'overview' && !showSchedulerWorkspace && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(30, 41, 59, 0.3) 100%)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              padding: '40px 30px',
              borderRadius: '24px',
              textAlign: 'center',
              marginBottom: '35px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#fff', textTransform: 'capitalize', letterSpacing: '0.5px' }}>
                Welcome Back, {companyName}! 👋
              </h3>
              <p style={{ margin: '12px auto 0 auto', color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '700px' }}>
                Here is your live enterprise workforce acquisition overview dashboard. Track current active talent streams, update operational configurations, and schedule candidate routing procedures securely.
              </p>
            </div>

            {/* 🔥 UPDATED: Added premium left accent bars to match candidate dashboard styling perfectly */}
            <div style={gridStyle}>
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #a78bfa' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Openings</h3>
                  <p style={{ margin: 0, fontSize: '2.6rem', fontWeight: '800', color: '#a78bfa', lineHeight: '1' }}>{jobsCount}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(167, 139, 250, 0.1)', padding: '16px', borderRadius: '16px', color: '#a78bfa' }}>
                  <FaBriefcase size={26} />
                </div>
              </div>

              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #34d399' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pipeline Enrollees</h3>
                  <p style={{ margin: 0, fontSize: '2.6rem', fontWeight: '800', color: '#34d399', lineHeight: '1' }}>{applications.length}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '16px', borderRadius: '16px', color: '#34d399' }}>
                  <FaChartPie size={26} />
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: '30px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Pipeline Structural Breakdown</h3>
              <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '13px' }}>Real-time state quantification layout map.</p>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px', background: 'rgba(15, 23, 42, 0.25)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>PENDING REVIEW</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b', marginTop: '6px' }}>
                    {applications.filter(a => a.status === 'Pending' || a.status === 'Pending Review').length}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '150px', background: 'rgba(15, 23, 42, 0.25)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>SHORTLISTED</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#10b981', marginTop: '6px' }}>
                    {applications.filter(a => a.status === 'Shortlisted').length}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '150px', background: 'rgba(15, 23, 42, 0.25)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>INTERVIEWS RUNNING</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#3b82f6', marginTop: '6px' }}>
                    {applications.filter(a => a.status === 'Interview Scheduled').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONDITION 2: DISPLAY WORKFORCE ACQUISITION MANAGED APPLICANT PIPELINES TABLE */}
        {activeTab === 'applications' && !showSchedulerWorkspace && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: '700' }}>Incoming Applicant Streams</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>APPLICANT IDENTITY</th>
                  <th style={thStyle}>TARGET DESIRED ROLE</th>
                  <th style={thStyle}>ENGAGEMENT DATE</th>
                  <th style={thStyle}>PIPELINE STATUS</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>DECISION ROUTING SYSTEM</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>CV ACCESS</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{app.userEmail ? app.userEmail.split('@')[0] : 'Applicant'}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{app.userEmail}</div>
                        </div>

                        {app.coverLetter && (
                          <button
                            onClick={() => {
                              setSelectedCoverLetter({ email: app.userEmail, letter: app.coverLetter, role: app.jobRole });
                              setShowLetterModal(true);
                            }}
                            title="View Cover Letter"
                            style={{
                              background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.25)',
                              color: '#34d399', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer',
                              fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px'
                            }}
                          >
                            <FaEnvelopeOpenText size={11} />
                            <span>Letter</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={tdStyle}>{app.jobRole}</td>
                    <td style={tdStyle}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Pending'}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: app.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.15)' : app.status === 'Interview Scheduled' ? 'rgba(59, 130, 246, 0.15)' : app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: app.status === 'Shortlisted' ? '#10b981' : app.status === 'Interview Scheduled' ? '#3b82f6' : app.status === 'Rejected' ? '#ef4444' : '#f59e0b'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button onClick={() => handleDirectShortlist(app._id)} style={actionBtn('#10b981')} title="Mark as Shortlisted directly">
                          Shortlist
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApplicationId(app._id);
                            setSelectedApplicantEmail(app.userEmail);
                            setSelectedJobRole(app.jobRole);
                            setShowSchedulerWorkspace(true);
                          }}
                          style={actionBtn('#3b82f6')}
                        >
                          Schedule Interview
                        </button>

                        <button onClick={() => handleRejectStatus(app._id)} style={actionBtn('#ef4444')}>Reject</button>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {app.cv ? (
                        <button
                          onClick={() => handleViewCV(app.cv)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(192, 132, 252, 0.12)',
                            color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.25)', padding: '6px 14px',
                            borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          <FaFileDownload size={12} />
                          <span>View CV</span>
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Not Provided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CONDITION 3: HIGH-END FULL CANVAS DASHBOARD AREA DEDICATED EXCLUSIVELY TO INTERVIEW TIMELINE PLANNING */}
        {showSchedulerWorkspace && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.3)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '40px', borderRadius: '24px', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Operational Sub-Terminal Node</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>Interactive Interview Provisioning System</h3>
              </div>
              <button
                onClick={() => setShowSchedulerWorkspace(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
              >
                <FaTimes size={12} />
                <span>Abort Framework</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '10px' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Candidate Parameters</h4>

                <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '25px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>IDENTIFIED ASSIGNED EMAIL</span>
                    <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600', marginTop: '2px' }}>{selectedApplicantEmail}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>TARGET INTENDED OPENING ROLE</span>
                    <div style={{ fontSize: '15px', color: '#a78bfa', fontWeight: '600', marginTop: '2px' }}>{selectedJobRole}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>HOST CORPORATE ORIGIN STATE</span>
                    <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600', marginTop: '2px' }}>{companyName}</div>
                  </div>
                </div>

                <form onSubmit={handleScheduleInterviewSubmit}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                    <FaVideo size={13} color="#3b82f6" />
                    <span>Secure Visual Streaming Meeting Link (Zoom / Meet URL)</span>
                  </label>
                  <div style={inputContainer}>
                    <FaVideo style={inputIconStyle} />
                    <input type="url" name="meetingLink" value={interviewData.meetingLink} onChange={handleInterviewInputChange} placeholder="https://zoom.us/j/your-meeting-hash-node" style={inputStyle} required />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setShowSchedulerWorkspace(false)} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Cancel Setup</button>
                    <button type="submit" style={{ flex: 2, padding: '14px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)' }}>Commit & Dispatch Stream</button>
                  </div>
                </form>
              </div>

              <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ margin: '0', color: '#cbd5e1', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interactive Calendar Allocation</h4>

                <div style={{ background: 'rgba(15, 23, 42, 0.2)', border: '1px solid rgba(255,255,255,0.03)', padding: '25px', borderRadius: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                    <FaCalendarAlt size={13} color="#3b82f6" />
                    <span>Select Evaluation Date Coordinates</span>
                  </label>
                  <div style={inputContainer}>
                    <FaCalendarAlt style={inputIconStyle} />
                    <input type="date" name="interviewDate" value={interviewData.interviewDate} onChange={handleInterviewInputChange} style={inputStyle} required />
                  </div>

                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '10px', fontWeight: '600' }}>
                    <FaClock size={13} color="#3b82f6" />
                    <span>Select Horizon Timestamp Allocation Block</span>
                  </label>
                  <div style={inputContainer}>
                    <FaClock style={inputIconStyle} />
                    <input type="time" name="interviewTime" value={interviewData.interviewTime} onChange={handleInterviewInputChange} style={inputStyle} required />
                  </div>

                  <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px dashed rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '12px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginTop: '15px' }}>
                    💡 <b>Automation System Alert Notice:</b> Submitting this framework execution block maps configuration data variables dynamically into backend transmission pipelines. An immediate notification system payload agent will parse structural timeline values and stream data onto candidate endpoints immediately.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ENHANCED PREMIUM JOB CREATION FORM MODAL */}
      {showPostModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontWeight: '800', fontSize: '1.4rem', color: '#fff' }}>Create Job Position</h2>
              <button onClick={() => setShowPostModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}><FaTimes /></button>
            </div>

            <form onSubmit={handlePostJob} style={{ textAlign: 'left' }}>
              {/* Job Title */}
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FaHeading size={13} style={{ color: '#7c3aed' }} />
                <span>Job Title</span>
              </label>
              <div style={{ margin: '0 0 16px 0' }}>
                <input type="text" name="title" value={jobData.title} onChange={handleInputChange} placeholder="e.g., Associate QA Engineer" style={{ ...inputStyle, paddingLeft: '16px' }} required />
              </div>

              {/* Location */}
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FaMapMarkerAlt size={13} style={{ color: '#34d399' }} />
                <span>Location</span>
              </label>
              <div style={{ margin: '0 0 16px 0' }}>
                <input type="text" name="location" value={jobData.location} onChange={handleInputChange} placeholder="e.g., Colombo 03 / Remote" style={{ ...inputStyle, paddingLeft: '16px' }} required />
              </div>

              {/* Monthly Salary */}
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FaMoneyBillWave size={13} style={{ color: '#f59e0b' }} />
                <span>Monthly Salary (LKR)</span>
              </label>
              <div style={{ margin: '0 0 16px 0' }}>
                <input type="text" name="salary" value={jobData.salary} onChange={handleInputChange} placeholder="e.g., Rs. 120,000+" style={{ ...inputStyle, paddingLeft: '16px' }} required />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                {/* Job Type */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <FaBriefcase size={13} style={{ color: '#3b82f6' }} />
                    <span>Job Type</span>
                  </label>
                  <div style={{ margin: '0 0 16px 0' }}>
                    <select name="type" value={jobData.type} onChange={handleInputChange} style={{ ...selectStyle, paddingLeft: '16px' }}>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <FaTags size={13} style={{ color: '#c084fc' }} />
                    <span>Category</span>
                  </label>
                  <div style={{ margin: '0 0 16px 0' }}>
                    <select name="category" value={jobData.category} onChange={handleInputChange} style={{ ...selectStyle, paddingLeft: '16px' }}>
                      <option value="Technology & IT">Technology & IT</option>
                      <option value="Management & Business">Management Management & Business</option>
                      <option value="Education & Teaching">Education & Teaching</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Requirements & Qualifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '4px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <FaAlignLeft size={13} style={{ color: '#a78bfa' }} />
                  <span>Requirements & Qualifications</span>
                </label>
                <button
                  type="button"
                  onClick={handleAiJobDescriptionGeneration}
                  disabled={isAiGenerating}
                  style={aiGeneratorTriggerBtn}
                >
                  {isAiGenerating ? "Generating..." : "✨ Auto-Generate with AI"}
                </button>
              </div>
              <textarea name="requirements" value={jobData.requirements} onChange={handleInputChange} rows="5" placeholder="✦ Degree/HND in IT&#10;✦ Knowledge in Laravel/Express" style={textareaStyle} required></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <button type="button" onClick={() => setShowPostModal(false)} style={{ padding: '12px 22px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 26px', background: '#7c3aed', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 5px 15px rgba(124, 58, 237, 0.3)' }}>Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC VIEW MODAL FOR DISPLAYING COVER LETTER CONTENT */}
      {showLetterModal && selectedCoverLetter && (
        <div style={modalOverlay}>
          <div style={{ ...modalContent, width: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ marginTop: 0, fontWeight: '800', fontSize: '1.3rem', color: '#fff', marginBottom: '4px' }}>Cover Letter / Pitch</h2>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  Submitted by: <span style={{ color: '#c084fc' }}>{selectedCoverLetter.email}</span>
                </p>
              </div>
              <button onClick={() => setShowLetterModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', fontWeight: '600' }}>Target Desired Role</span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginTop: '2px' }}>{selectedCoverLetter.role}</div>
            </div>

            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', fontWeight: '600' }}>Applicant Presentation Statement</span>
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '20px', borderRadius: '14px', color: '#cbd5e1', fontSize: '14px',
                lineHeight: '1.6', whiteSpace: 'pre-wrap', marginTop: '6px', maxHeight: '300px', overflowY: 'auto', textAlign: 'left'
              }}>
                {selectedCoverLetter.letter}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button onClick={() => setShowLetterModal(false)} style={{ padding: '10px 24px', background: '#7c3aed', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}>Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;