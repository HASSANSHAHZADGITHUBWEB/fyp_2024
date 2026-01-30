import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Home, Globe, MessageSquare, Briefcase } from 'lucide-react';
import '../styles/fig.css'; 

const EmployeeLayout = () => {
  const employeeLinks = [
    { label: "Hello Page", path: "/employee/hello", icon: <Home size={20} /> },
    { label: "World Page", path: "/employee/world", icon: <Globe size={20} /> },
    { label: "Messages", path: "/employee/messages", icon: <MessageSquare size={20} /> },
    { label: "Projects", path: "/employee/projects", icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="app-container">
      <Sidebar title="ZTOS EMP" links={employeeLinks} />
      
      <div className="main-content">
        <header className="sidebar-header" style={{ background: 'white', color: '#3f4254' }}>
          <h2 className="font-bold text-lg">Employee Portal</h2>
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">E</div>
        </header>

        <div className="page-scroll-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;