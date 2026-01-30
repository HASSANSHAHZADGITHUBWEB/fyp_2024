import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Palette, Moon, Sun, Monitor } from 'lucide-react';
import '../../styles/fig.css';

const SettingsPage = () => {
  // --- STATE ---
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState('Light');

  // --- DARK MODE LOGIC ---
  useEffect(() => {
    if (theme === 'Dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  return (
    <div className="fade-in-up">
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Account Settings</h2>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Control your profile and system preferences</p>
      </div>

      {/* 1. APPEARANCE (Moved up for easier access) */}
      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <div className="icon-bg-purple" style={{ padding: '10px', borderRadius: '8px' }}><Palette size={20} /></div>
          <h3 className="section-title" style={{ margin: 0, fontSize: '18px' }}>Appearance</h3>
        </div>

        {/* Professional Theme Selector (Visual Cards) */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          
          <div className={`theme-card ${theme === 'Light' ? 'active' : ''}`} onClick={() => setTheme('Light')}>
            <Sun size={20} className={theme === 'Light' ? 'text-blue-500' : 'text-gray-400'} />
            <span style={{ fontWeight: 600 }}>Light Mode</span>
          </div>

          <div className={`theme-card ${theme === 'Dark' ? 'active' : ''}`} onClick={() => setTheme('Dark')}>
            <Moon size={20} className={theme === 'Dark' ? 'text-blue-500' : 'text-gray-400'} />
            <span style={{ fontWeight: 600 }}>Dark Mode</span>
          </div>

          {/* Locked System Option */}
          <div className="theme-card" style={{ opacity: 0.5, cursor: 'not-allowed', borderStyle: 'dashed' }}>
            <Monitor size={20} />
            <span style={{ fontWeight: 600 }}>System (Pro)</span>
          </div>

        </div>

        {/* Language Selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Language</label>
          <select className="custom-input" style={{ width: '100%', cursor: 'not-allowed', opacity: 0.7 }} disabled>
            <option>English (United States)</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>Language settings are managed by organization policy.</p>
        </div>
      </div>

      {/* 2. PROFILE SETTINGS */}
      <div className="content-card" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <div className="icon-bg-blue" style={{ padding: '10px', borderRadius: '8px' }}><User size={20} /></div>
          <h3 className="section-title" style={{ margin: 0, fontSize: '18px' }}>Profile Information</h3>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
          <FormGroup label="Full Name" placeholder="Employee User" defaultValue="Employee User" />
          <FormGroup label="Email Address" placeholder="employee@sign2text.com" defaultValue="employee@sign2text.com" />
          <FormGroup label="Phone Number" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 000-0000" />
          <FormGroup label="Role / Designation" placeholder="Employee" defaultValue="Employee" disabled />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ 
            background: '#3699ff', color: 'white', border: 'none', padding: '12px 30px', 
            borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(54, 153, 255, 0.3)'
          }}>
            Save Changes
          </button>
        </div>
      </div>

      {/* 3. NOTIFICATION & SECURITY GRID */}
      <div className="dashboard-grid" style={{ marginTop: '30px', gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        
        {/* Notifications */}
        <div className="content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div className="icon-bg-green" style={{ padding: '10px', borderRadius: '8px' }}><Bell size={20} /></div>
            <h3 className="section-title" style={{ margin: 0, fontSize: '18px' }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <ToggleRow label="Email Alerts" desc="Direct updates to inbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
            <ToggleRow label="Push Alerts" desc="Mobile push notifications" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
            <ToggleRow label="Weekly Digest" desc="Summary of weekly stats" checked={weeklyReports} onChange={() => setWeeklyReports(!weeklyReports)} />
          </div>
        </div>

        {/* Security */}
        <div className="content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div className="icon-bg-red" style={{ padding: '10px', borderRadius: '8px' }}><Lock size={20} /></div>
            <h3 className="section-title" style={{ margin: 0, fontSize: '18px' }}>Security</h3>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <FormGroup label="Current Password" placeholder="••••••••" type="password" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <FormGroup label="New Password" placeholder="••••••••" type="password" />
          </div>
          <button style={{ 
            width: '100%', background: 'rgba(246, 78, 96, 0.1)', color: '#f64e60', border: 'none', padding: '12px', 
            borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: '0.2s'
          }} onMouseOver={(e) => e.target.style.background = '#f64e60'} onMouseOut={(e) => e.target.style.background = 'rgba(246, 78, 96, 0.1)'} 
             onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#f64e60'}>
            Update Password
          </button>
        </div>

      </div>

      {/* Inline Styles for Toggle Switch (Keep local for simplicity) */}
      <style>{`
        .toggle-switch {
          width: 44px; height: 24px; background: var(--border-color); border-radius: 12px; position: relative; cursor: pointer; transition: 0.3s;
        }
        .toggle-switch.checked { background: #3699ff; }
        .toggle-knob {
          width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: 0.3s;
        }
        .toggle-switch.checked .toggle-knob { left: 22px; }
      `}</style>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const FormGroup = ({ label, placeholder, defaultValue, type = "text", disabled = false }) => (
  <div style={{ marginBottom: '5px' }}>
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '13px' }}>{label}</label>
    <input 
      type={type} 
      className="custom-input" 
      placeholder={placeholder} 
      defaultValue={defaultValue}
      disabled={disabled}
      style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', outline: 'none' }}
    />
  </div>
);

const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
    <div>
      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{label}</h4>
      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
    <div className={`toggle-switch ${checked ? 'checked' : ''}`} onClick={onChange}>
      <div className="toggle-knob"></div>
    </div>
  </div>
);

export default SettingsPage;