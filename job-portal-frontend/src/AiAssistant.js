// AiAssistant.js - Dynamic AI engine serving both Job Seekers and Employers conditionally
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AiAssistant = () => {
    // Application state states managing form fields, configurations, and response streams
    const [userRole, setUserRole] = useState('seeker'); // Fallback default to 'seeker', dynamically checked later
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [dynamicInput, setDynamicInput] = useState(''); // Holds either Skills or Requirements
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    // Dynamic environmental check inside the component cycle to detect logged-in user role
    useEffect(() => {
        // 💡 OPTIONAL REAL-WORLD IMPLEMENTATION: If you store user details in localStorage, uncomment below:
        // const role = localStorage.getItem('userRole'); // e.g. 'seeker' or 'employer'
        // if(role) setUserRole(role);
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!jobTitle || !companyName) return alert('Please fill required fields!');
        
        setLoading(true);
        setResult('');

        try {
            // Evaluates user execution path and targets the respective controller node on the backend
            if (userRole === 'seeker') {
                const res = await axios.post('http://localhost:5000/api/ai/generate-cover-letter', {
                    jobTitle, companyName, skills: dynamicInput
                });
                if (res.data.success) setResult(res.data.coverLetter);
            } else {
                const res = await axios.post('http://localhost:5000/api/ai/generate-job-description', {
                    jobTitle, companyName, requirements: dynamicInput
                });
                if (res.data.success) setResult(res.data.jobDescription);
            }
        } catch (error) {
            alert('AI Assistant temporary offline.');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '40px', background: '#05070c', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* 🎯 PRESENTATION HACK: A clean interactive toggle just for your demo, in case automated roles aren't globally wired yet */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                    <button onClick={() => { setUserRole('seeker'); setResult(''); }} style={{ ...toggleBtnStyle, background: userRole === 'seeker' ? '#6366f1' : '#1e293b' }}>Job Seeker Mode</button>
                    <button onClick={() => { setUserRole('employer'); setResult(''); }} style={{ ...toggleBtnStyle, background: userRole === 'employer' ? '#a855f7' : '#1e293b' }}>Employer Mode</button>
                </div>

                <h2 style={{ background: 'linear-gradient(to right, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem', fontWeight: '800', margin: '0' }}>
                    NextGen AI Career Assistant ✨
                </h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>
                    {userRole === 'seeker' ? 'Generate a highly professional tailored cover letter in seconds.' : 'Generate professional and high-converting job descriptions automatically.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Form Component Structure adapting to active state contexts */}
                    <form onSubmit={handleGenerate} style={{ background: 'rgba(11, 17, 32, 0.4)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Target Job Title *</label>
                            <input type="text" placeholder="e.g. React Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Company Name *</label>
                            <input type="text" placeholder="e.g. NextGen Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>
                                {userRole === 'seeker' ? 'Your Top Skills (Optional)' : 'Key Requirements / Keywords (Optional)'}
                            </label>
                            <textarea 
                                placeholder={userRole === 'seeker' ? 'e.g. Node.js, MongoDB, REST APIs' : 'e.g. 2 years experience, Git, Team player'} 
                                value={dynamicInput} 
                                onChange={(e) => setDynamicInput(e.target.value)} 
                                style={{ ...inputStyle, height: '80px', resize: 'none' }} 
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{ ...btnStyle, background: userRole === 'seeker' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'linear-gradient(135deg, #a855f7, #c084fc)' }}>
                            {loading ? 'AI is processing...' : userRole === 'seeker' ? 'Generate Cover Letter with AI ✨' : 'Generate Job Description with AI 🚀'}
                        </button>
                    </form>

                    {/* Output Section View Wrapper Terminal */}
                    <div style={{ background: 'rgba(10, 16, 31, 0.6)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>Generated Output ({userRole === 'seeker' ? 'Cover Letter' : 'Job Description'})</h4>
                        {loading && <div style={{ color: '#a78bfa', margin: 'auto' }}>⚡ NextGen AI is processing your request...</div>}
                        {!loading && !result && <div style={{ color: '#475569', margin: 'auto', textAlign: 'center', fontSize: '0.9rem' }}>Fill the fields and trigger the AI agent.</div>}
                        {!loading && result && (
                            <textarea readOnly value={result} style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', resize: 'none', fontFamily: 'monospace' }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// CSS Stylesheets object dictionaries
const inputStyle = { width: '100%', padding: '12px', background: 'rgba(5, 7, 12, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' };
const toggleBtnStyle = { padding: '6px 14px', border: 'none', borderRadius: '20px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.3s ease' };

export default AiAssistant;