import React from 'react';

const StatCard = ({ title, value, percentage, isPositive, icon, color }) => {
  return (
    <div className="stat-card-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
        </div>
        
        {/* The 'color' prop (e.g., bg-green-500) now matches the CSS helper classes above */}
        <div className={`stat-icon-box ${color}`}>
          {icon}
        </div>
      </div>

      <div className={`stat-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
        <span>{isPositive ? '↑' : '↓'} {percentage}</span>
        <span className="trend-text">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;