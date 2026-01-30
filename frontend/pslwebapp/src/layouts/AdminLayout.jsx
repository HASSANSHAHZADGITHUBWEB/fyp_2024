import React, { useState } from 'react'; // Import useState
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { LayoutDashboard, BarChart3, FileText, Settings, Users, Menu } from 'lucide-react'; // Import Menu Icon
import '../styles/fig.css'; 

const AdminLayout = () => {
  // We need to control Sidebar state from here for Mobile
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const adminLinks = [
    { label: "Admin Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    // { label: "Ad Control", path: "/admin/ad", icon: <BarChart3 size={20} /> },
    { label: "Employees", path: "/admin/Employees", icon: <FileText size={20} /> },
    { label: "Subscribers", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Pass state to Sidebar */}
      <Sidebar 
        title="EXECUTIVE" 
        links={adminLinks} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="main-content">
        <header className="sidebar-header" style={{ background: 'white', color: '#3f4254', display: 'flex', gap: '15px' }}>
          
          {/* MOBILE TOGGLE BUTTON (Visible only on small screens) */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <Menu size={24} color="#3f4254" />
          </button>

          <h2 className="font-bold text-lg">Admin Portal</h2>
          
          {/* ... rest of header ... */}
          <div className="flex items-center gap-3" style={{ marginLeft: 'auto' }}>
            <span className="hide-on-mobile">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
          </div>
        </header>

        {/* ... scroll area ... */}
        <div className="page-scroll-area">
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <div style={{ flex: 1 }}><Outlet /></div>
            <Footer />
          </div>
        </div>
      </div>

      {/* Helper CSS for the button */}
      <style>{`
        .mobile-menu-btn { display: none; }
        .hide-on-mobile { display: block; }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: block; }
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;