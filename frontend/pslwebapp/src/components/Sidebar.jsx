import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import '../styles/fig.css'; 

const Sidebar = ({ title, links, isOpen, setIsOpen }) => {
  // const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear tokens)
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      {/* 1. Header with Gradient Text */}
      <div className="sidebar-header">
        {isOpen ? (
          <span 
            className="header-title" 
            style={{ 
              fontWeight: 800, 
              fontSize: '22px',
              background: 'linear-gradient(45deg, #3699ff, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px'
            }}
          >
            {title}
          </span>
        ) : (
          // Small Logo when closed
          <div style={{width: 30, height: 30, background:'#3699ff', borderRadius: 8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>Z</div>
        )}
        
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn" style={{color: '#6c7293'}}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* 2. Menu Links (With Tooltips) */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
        {links.map((link, index) => (
          <div key={index} className="sidebar-link-wrapper" style={{ position: 'relative' }}>
            <NavLink
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="icon-box" style={{ minWidth: '24px' }}>{link.icon}</span>
              <span className="link-text">{link.label}</span>
            </NavLink>
            
            {/* Tooltip (Only visible when closed) */}
            {!isOpen && (
              <div className="sidebar-tooltip">
                {link.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 3. User Profile & Logout (Pro Touch) */}
      <div style={{ padding: '10px' }}>
        
        {/* User Mini Card */}
        <div className="user-mini-card" style={{ cursor: 'pointer' }}>
          <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#3699ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            <User size={18} color="white" />
          </div>
          {isOpen && (
            <div style={{ marginLeft: 12, overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Admin User</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6c7293' }}>admin@ztos.com</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="sidebar-link w-full" 
          style={{ border: 'none', background: 'transparent', color: '#f64e60', marginTop: '5px' }}
        >
          <span className="icon-box"><LogOut size={20} /></span>
          <span className="link-text">Logout</span>
        </button>

      </div>
    </div>
  );
};

export default Sidebar;