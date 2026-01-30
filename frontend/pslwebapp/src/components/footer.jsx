import React from 'react';

const footer = () => {
  return (
    <div style={{ 
      marginTop: '40px', 
      paddingTop: '20px', 
      borderTop: '1px solid #ebedf3', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: '#b5b5c3',
      fontSize: '13px',
      fontWeight: '500'
    }}>
      <div>
        <span>2026 © </span>
        <a href="#" style={{ color: '#3f4254', textDecoration: 'none', fontWeight: '600' }}>Sign2Txt Admin</a>
        <span style={{ margin: '0 5px' }}>&nbsp;|&nbsp;</span>
        <span>Crafted with ❤️ by Team</span>
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="#" className="footer-link">About</a>
        <a href="#" className="footer-link">Support</a>
        <a href="#" className="footer-link">Purchase</a>
      </div>
      
      {/* Small inline style for hover effect */}
      <style>
        {`
          .footer-link { color: #b5b5c3; text-decoration: none; transition: 0.2s; }
          .footer-link:hover { color: #3699ff; }
        `}
      </style>
    </div>
  );
};

export default footer;