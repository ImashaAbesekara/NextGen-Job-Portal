import React from 'react';
// Import useNavigate hook from react-router-dom for industry-standard navigation
import { useNavigate } from 'react-router-dom';
// Import the hero illustration from assets folder (myLogo removed from here as it is now in Navbar)
import heroImg from './assets/hero-illustration.png'; 

function LandingPage() {
  // Initialize the navigation trigger function
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      
      {/* --- Hero Section (Split Layout) --- */}
      <div style={heroSectionStyle}>
        {/* Left Side: Text and CTA */}
        <div style={heroTextStyle}>
          <h1 style={mainTitleStyle}>Bridge the Gap Between You and Your Future</h1>
          <p style={subTitleStyle}>
            Connect with top companies and find the perfect role that matches your skills
          </p>
          {/* Get Started button routes user directly to register route */}
          <button onClick={() => navigate('/register')} style={getStartedBtnStyle}>
            Get Started Now
          </button>
        </div>

        {/* Right Side: Creative Illustration */}
        <div style={heroImageContainerStyle}>
          <img src={heroImg} alt="Career Growth Illustration" style={heroImageStyle} />
        </div>
      </div>

      {/* --- Features Section (3 Cards below Hero) --- */}
      <div style={featureContainerStyle}>
        {/* Feature 1 - Added both className for hover and style for glassmorphism layout */}
        <div className="feature-card" style={featureBoxStyle}>
          <div style={iconCircleStyle}>🎯</div>
          <h3 style={featureTitleStyle}>Smart Matching</h3>
          <p style={featureDescriptionStyle}>
            Find jobs that fit your profile perfectly using our AI tools.
          </p>
        </div>

        {/* Feature 2 - Added both className for hover and style for glassmorphism layout */}
        <div className="feature-card" style={featureBoxStyle}>
          <div style={iconCircleStyle}>⚡</div>
          <h3 style={featureTitleStyle}>Easy Apply</h3>
          <p style={featureDescriptionStyle}>
            Apply to your favorite companies with just one simple click.
          </p>
        </div>

        {/* Feature 3 - Added both className for hover and style for glassmorphism layout */}
        <div className="feature-card" style={featureBoxStyle}>
          <div style={iconCircleStyle}>✅</div>
          <h3 style={featureTitleStyle}>Verified Jobs</h3>
          <p style={featureDescriptionStyle}>
            We only list trusted employers and real career opportunities.
          </p>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer style={footerStyle}>
        <p>&copy; 2024 NextGen Job Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

// --- CSS Styles (Identical and unchanged as requested) ---

const containerStyle = { 
  minHeight: '100vh', 
  width: '100%',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
  fontFamily: "'Poppins', sans-serif",
  color: '#fff'
};

const heroSectionStyle = { 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '160px 80px 100px',
  marginTop: '75px'
};

const heroTextStyle = { flex: 1, paddingRight: '50px' };
const mainTitleStyle = { fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px' };
const subTitleStyle = { fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '40px' };

const getStartedBtnStyle = { 
  padding: '16px 40px', 
  fontSize: '1rem', 
  backgroundColor: '#7c3aed', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '30px', 
  fontWeight: 'bold', 
  cursor: 'pointer',
  transition: '0.3s',
  boxShadow: '0 10px 20px rgba(124,58,237,0.3)'
};

const heroImageContainerStyle = { flex: 1, display: 'flex', justifyContent: 'center' };
const heroImageStyle = { 
  maxWidth: '100%', 
  height: 'auto',  
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  border: '1px solid rgba(225,225,255,0.1)'
};

const featureContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  padding: '100px 80px',
  backgroundColor: 'rgba(255, 255, 255, 0.02)' 
};

const featureBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '40px 30px',
  borderRadius: '20px',
  width: '320px',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease, background-color 0.3s ease', 
  cursor: 'pointer'
};

const iconCircleStyle = {
  fontSize: '40px',
  marginBottom: '20px',
  display: 'block'
};

const featureTitleStyle = { fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' };
const featureDescriptionStyle = { fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' };

const footerStyle = {
  textAlign: 'center',
  padding: '30px',
  fontSize: '0.9rem',
  color: 'rgba(255, 255, 255, 0.5)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
};

export default LandingPage;