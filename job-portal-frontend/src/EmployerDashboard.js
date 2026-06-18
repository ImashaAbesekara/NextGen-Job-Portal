import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaChartPie, FaBriefcase, FaSignOutAlt, FaPlus, FaBuilding, FaFileDownload, FaEnvelopeOpenText } from 'react-icons/fa';

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

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-Time',
    category: 'Technology & IT', // Default fall-back option state mapping
    requirements: ''
  });

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
    // Directly targets the static asset middleware exposed on port 5000 securely
    window.open(`http://localhost:5000/uploads/${cvFileName}`, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({ ...prevData, [name]: value }));
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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
      );
      toast.success(`Application state transitioned to: ${newStatus} 🎯`);
    } catch (error) {
      toast.error("Failed to update execution state on application node.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out securely. See you soon! 👋");
    navigate('/login');
  };

  // --- Theme Style Setup Map Configuration ---
  const dashboardWrapper = { display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif' };

  const sidebarStyle = {
    width: '280px', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(15px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column',
    padding: '30px 20px', position: 'fixed', height: '100vh', boxSizing: 'border-box', justifyContent: 'space-between'
  };

  const brandArea = { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '40px', paddingLeft: '10px' };
  const brandTitle = { fontSize: '1.8rem', fontWeight: '900', margin: 0, background: 'linear-gradient(to right, #fff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const companyBadge = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '12px', fontSize: '13px', color: '#c084fc', fontWeight: '600', marginTop: '10px' };
  const menuGroup = { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' };

  const sidebarButton = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px', borderRadius: '14px',
    border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s', textAlign: 'left',
    backgroundColor: isActive ? '#7c3aed' : 'transparent', color: isActive ? '#fff' : '#94a3b8',
    boxShadow: isActive ? '0 8px 20px rgba(124, 58, 237, 0.25)' : 'none'
  });

  const logoutBtnStyle = { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' };

  const mainContentStyle = { flex: 1, marginLeft: '280px', padding: '40px 50px', boxSizing: 'border-box', minWidth: 0 };
  const topHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: 'rgba(30, 41, 59, 0.25)', padding: '20px 30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.03)' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' };
  const cardStyle = { background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '25px', borderRadius: '24px', textAlign: 'left' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'rgba(30, 41, 59, 0.20)', borderRadius: '16px', overflow: 'hidden' };
  const thStyle = { backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '16px', color: '#94a3b8', fontSize: '13px', textAlign: 'left', fontWeight: '600' };
  const tdStyle = { padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '14px', color: '#cbd5e1', verticalAlign: 'middle' };
  const actionBtn = (bg) => ({ padding: '6px 14px', borderRadius: '8px', border: 'none', color: '#fff', backgroundColor: bg, cursor: 'pointer', fontWeight: '600', fontSize: '12px', marginRight: '8px', transition: '0.2s' });

  const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContent = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '35px', borderRadius: '24px', width: '500px', maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle = { width: '100%', padding: '11px 16px', margin: '8px 0 16px 0', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none' };

  return (
    <div style={dashboardWrapper}>
      <ToastContainer position="top-right" theme="dark" />

      {/* LEFT SIDEBAR PANEL */}
      <div style={sidebarStyle}>
        <div style={{ width: '100%' }}>
          <div style={brandArea}>
            <h1 style={brandTitle}>NextGen</h1>
            <div style={companyBadge}>
              <FaBuilding size={14} />
              <span>{companyName}</span>
            </div>
          </div>

          <div style={menuGroup}>
            <button onClick={() => setActiveTab('overview')} style={sidebarButton(activeTab === 'overview')}>
              <FaChartPie size={18} />
              <span>Overview Analytics</span>
            </button>
            <button onClick={() => setActiveTab('applications')} style={sidebarButton(activeTab === 'applications')}>
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

        {activeTab === 'overview' ? (
          <div>
            <div style={gridStyle}>
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Openings</h3>
                <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#a78bfa' }}>{jobsCount}</p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pipeline Enrollees</h3>
                <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#34d399' }}>{applications.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: '700' }}>Incoming Applicant Streams</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>APPLICANT IDENTITY</th>
                  <th style={thStyle}>TARGET DESIRED ROLE</th>
                  <th style={thStyle}>ENGAGEMENT DATE</th>
                  <th style={thStyle}>PIPELINE STATUS</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>DECISION ROUTING</th>
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

                        {/* FEATURE NODE: Active cover letter presentation popup anchor triggering event binding */}
                        {app.coverLetter && (
                          <button
                            onClick={() => {
                              setSelectedCoverLetter({
                                email: app.userEmail,
                                letter: app.coverLetter,
                                role: app.jobRole
                              });
                              setShowLetterModal(true);
                            }}
                            title="View Cover Letter"
                            style={{
                              background: 'rgba(52, 211, 153, 0.1)',
                              border: '1px solid rgba(52, 211, 153, 0.25)',
                              color: '#34d399',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(52, 211, 153, 0.25)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)'}
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
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: app.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: app.status === 'Shortlisted' ? '#10b981' : '#f59e0b' }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button onClick={() => handleUpdateStatus(app._id, 'Shortlisted')} style={actionBtn('#10b981')}>Shortlist</button>
                      <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} style={actionBtn('#ef4444')}>Reject</button>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {/* CRITICAL INDUSTRY STANDARD RE-MAPPING: Successfully structural execution via unified function handler context */}
                      {app.cv ? (
                        <button
                          onClick={() => handleViewCV(app.cv)} // 🎯 FIXED: Replaced old <a> hyperlink wrapper with handleViewCV trigger mechanism securely bound
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(192, 132, 252, 0.12)',
                            color: '#c084fc',
                            border: '1px solid rgba(192, 132, 252, 0.25)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease-in-out',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(192, 132, 252, 0.25)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(192, 132, 252, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(192, 132, 252, 0.12)';
                            e.currentTarget.style.boxShadow = 'none';
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
      </div>

      {/* JOB CREATION FORM MODAL */}
      {showPostModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ marginTop: 0, fontWeight: '800', fontSize: '1.4rem', marginBottom: '20px' }}>Create Job Position</h2>
            <form onSubmit={handlePostJob} style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Job Title</label>
              <input type="text" name="title" value={jobData.title} onChange={handleInputChange} placeholder="e.g., Associate QA Engineer" style={inputStyle} required />

              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Location</label>
              <input type="text" name="location" value={jobData.location} onChange={handleInputChange} placeholder="e.g., Colombo 03 / Remote" style={inputStyle} required />

              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Monthly Salary (LKR)</label>
              <input type="text" name="salary" value={jobData.salary} onChange={handleInputChange} placeholder="e.g., Rs. 120,000+" style={inputStyle} required />

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Job Type</label>
                  <select name="type" value={jobData.type} onChange={handleInputChange} style={inputStyle}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Category</label>
                  <select name="category" value={jobData.category} onChange={handleInputChange} style={inputStyle}>
                    <option value="Technology & IT">Technology & IT</option>
                    <option value="Management & Business">Management & Business</option>
                    {/* 🎯 ADDED CATEGORY OPTION: Extended layout to support dynamic recruitment mappings for Education sector */}
                    <option value="Education & Teaching">Education & Teaching</option>
                  </select>
                </div>
              </div>

              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Requirements & Qualifications</label>
              <textarea name="requirements" value={jobData.requirements} onChange={handleInputChange} rows="4" placeholder="✦ Degree/HND in IT&#10;✦ Knowledge in Laravel/Express" style={{ ...inputStyle, fontFamily: 'sans-serif', resize: 'none' }} required></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowPostModal(false)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 24px', background: '#7c3aed', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Job</button>
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
              <button
                onClick={() => setShowLetterModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', fontWeight: '600' }}>Target Desired Role</span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginTop: '2px' }}>{selectedCoverLetter.role}</div>
            </div>

            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', fontWeight: '600' }}>Applicant Presentation Statement</span>
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '14px',
                color: '#cbd5e1',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                marginTop: '6px',
                maxHeight: '300px',
                overflowY: 'auto',
                textAlign: 'left'
              }}>
                {selectedCoverLetter.letter}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button
                onClick={() => setShowLetterModal(false)}
                style={{
                  padding: '10px 24px',
                  background: '#7c3aed',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
                }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;