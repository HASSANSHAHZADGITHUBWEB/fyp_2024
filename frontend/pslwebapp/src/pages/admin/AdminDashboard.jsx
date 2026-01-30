import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  DollarSign, TrendingUp, Users, Activity, Calendar, Download, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import '../../styles/fig.css'; // Your custom styles

// --- MOCK DATA (Connect your Local API here later) ---
const REVENUE_DATA = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const USER_STATS = [
  { name: 'Desktop', value: 65, color: '#3699ff' },
  { name: 'Mobile', value: 25, color: '#1bc5bd' },
  { name: 'Tablet', value: 10, color: '#ffa800' },
];

const RECENT_USERS = [
  { id: 1, name: "Dr. Sarah Smith", role: "Researcher", date: "Today, 9:00 AM", status: "Active", amount: "$120.00" },
  { id: 2, name: "James Alistair", role: "Developer", date: "Yesterday", status: "Pending", amount: "$0.00" },
  { id: 3, name: "Nadia Ali", role: "Designer", date: "Jan 23, 2026", status: "Active", amount: "$450.00" },
  { id: 4, name: "System Bot", role: "Automation", date: "Jan 22, 2026", status: "Error", amount: "$0.00" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'settings'

  return (
    <div className="fade-in-up">
      
      {/* 1. ADVANCED HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 className="section-title" style={{ fontSize: '26px', marginBottom: '5px' }}>Executive Dashboard</h2>
          <p style={{ color: '#b5b5c3', margin: 0 }}>Welcome back, Admin. Here is what’s happening today.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* Date Picker Mock */}
          <button className="content-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', margin: 0, cursor: 'pointer' }}>
            <Calendar size={18} color="#6c7293" />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#3f4254' }}>Jan 2026</span>
          </button>
          
          {/* Export Button */}
          <button style={{ background: '#3699ff', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #ebedf3', marginBottom: '30px' }}>
        <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <TabButton label="System Health" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {/* --- VIEW 1: OVERVIEW (Financials & Key Metrics) --- */}
      {activeTab === 'overview' && (
        <>
          {/* Top Stats Grid */}
          <div className="dashboard-grid">
            <AdvancedStatCard 
              title="Total Revenue" value="$1,245,680" change="+12.5%" isPos={true} 
              icon={<DollarSign size={24} color="#3699ff" />} color="icon-bg-blue" 
            />
            <AdvancedStatCard 
              title="Active Users" value="8,540" change="+3.2%" isPos={true} 
              icon={<Users size={24} color="#1bc5bd" />} color="icon-bg-green" 
            />
            <AdvancedStatCard 
              title="Bounce Rate" value="42.5%" change="-1.1%" isPos={true} 
              icon={<Activity size={24} color="#ffa800" />} color="icon-bg-yellow" 
            />
            <AdvancedStatCard 
              title="System Load" value="12%" change="+2%" isPos={false} 
              icon={<AlertCircle size={24} color="#f64e60" />} color="icon-bg-red" 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
            {/* Main Revenue Chart */}
            <div className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '18px', margin: 0 }}>Revenue Analytics</h3>
                <MoreHorizontal size={20} color="#b5b5c3" style={{ cursor: 'pointer' }} />
              </div>
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3699ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3699ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebedf3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#b5b5c3'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#b5b5c3'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                    <Area type="monotone" dataKey="income" stroke="#3699ff" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device/Traffic Source */}
            <div className="content-card">
              <h3 className="section-title" style={{ fontSize: '18px', margin: '0 0 20px 0' }}>Traffic Sources</h3>
              <div style={{ height: '250px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      data={USER_STATS} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {USER_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ color: '#b5b5c3', fontSize: '13px' }}>Most users access via Desktop.</p>
                <button style={{ background: 'none', border: 'none', color: '#3699ff', fontWeight: 600, cursor: 'pointer' }}>View Detailed Report</button>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="section-title" style={{ fontSize: '18px', margin: 0 }}>Recent Transactions</h3>
              <button style={{ padding: '6px 12px', background: '#f3f6f9', border: 'none', borderRadius: '6px', color: '#7e8299', fontSize: '12px', fontWeight: 600 }}>See All</button>
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f3f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#3699ff' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span style={{ display: 'block', fontWeight: 600, color: '#3f4254' }}>{user.name}</span>
                          <span style={{ fontSize: '12px', color: '#b5b5c3' }}>{user.id === 4 ? 'System' : 'Verified'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#7e8299' }}>{user.role}</td>
                    <td style={{ color: '#7e8299' }}>{user.date}</td>
                    <td style={{ fontWeight: 600, color: '#3f4254' }}>{user.amount}</td>
                    <td>
                      <span className={`status-badge ${user.status === 'Active' ? 'status-active' : user.status === 'Pending' ? 'status-pending' : 'status-danger'}`} style={{ 
                        background: user.status === 'Error' ? '#ffe2e5' : undefined,
                        color: user.status === 'Error' ? '#f64e60' : undefined
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button style={{ background: '#f3f6f9', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                        <MoreHorizontal size={16} color="#b5b5c3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- VIEW 2: ANALYTICS (Operational View) --- */}
      {activeTab === 'analytics' && (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Activity Feed */}
          <div className="content-card">
            <h3 className="section-title" style={{ fontSize: '18px' }}>System Activity</h3>
            <div style={{ marginTop: '20px' }}>
              <ActivityItem color="#1bc5bd" title="New subscriber added" desc="Lisa Anderson joined Premium plan" time="2 mins ago" />
              <ActivityItem color="#3699ff" title="Server Rebooted" desc="Automatic maintenance scheduled" time="1 hour ago" />
              <ActivityItem color="#ffa800" title="Payment Pending" desc="Invoice #10239 needs approval" time="3 hours ago" />
              <ActivityItem color="#f64e60" title="Login Attempt Failed" desc="IP 192.168.1.1 blocked" time="5 hours ago" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <h3 className="section-title" style={{ fontSize: '18px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <ActionButton icon={<Users />} label="Add User" color="#3699ff" />
              <ActionButton icon={<CheckCircle />} label="Approve All" color="#1bc5bd" />
              <ActionButton icon={<AlertCircle />} label="View Logs" color="#ffa800" />
              <ActionButton icon={<DollarSign />} label="Create Invoice" color="#8950fc" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      padding: '0 0 15px 0',
      fontSize: '15px',
      fontWeight: 600,
      color: active ? '#3699ff' : '#b5b5c3',
      borderBottom: active ? '3px solid #3699ff' : '3px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
  >
    {label}
  </button>
);

const AdvancedStatCard = ({ title, value, change, isPos, icon, color }) => (
  <div className="content-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid transparent', transition: '0.3s' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div>
        <p style={{ color: '#b5b5c3', fontSize: '14px', margin: 0 }}>{title}</p>
        <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#3f4254', margin: '5px 0' }}>{value}</h3>
      </div>
      <div className={color} style={{ padding: '12px', borderRadius: '10px' }}>{icon}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <span style={{ 
        display: 'flex', alignItems: 'center', 
        color: isPos ? '#1bc5bd' : '#f64e60', 
        background: isPos ? 'rgba(27, 197, 189, 0.1)' : 'rgba(246, 78, 96, 0.1)',
        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
      }}>
        {isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </span>
      <span style={{ color: '#b5b5c3', fontSize: '12px', marginLeft: '8px' }}>vs last month</span>
    </div>
  </div>
);

const ActivityItem = ({ color, title, desc, time }) => (
  <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', position: 'relative' }}>
    {/* Timeline Line could go here */}
    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, marginTop: '5px', flexShrink: 0, border: '2px solid white', boxShadow: `0 0 0 3px ${color}20` }}></div>
    <div>
      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#3f4254' }}>{title}</h4>
      <p style={{ margin: '2px 0 0 0', color: '#7e8299', fontSize: '13px' }}>{desc}</p>
      <span style={{ fontSize: '11px', color: '#b5b5c3', marginTop: '4px', display: 'block' }}>{time}</span>
    </div>
  </div>
);

const ActionButton = ({ icon, label, color }) => (
  <button style={{ 
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
    padding: '20px', border: '1px dashed #ebedf3', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: '0.2s'
  }}
  onMouseOver={(e) => e.currentTarget.style.borderColor = color}
  onMouseOut={(e) => e.currentTarget.style.borderColor = '#ebedf3'}
  >
    <div style={{ color: color }}>{icon}</div>
    <span style={{ fontWeight: 500, color: '#3f4254', fontSize: '14px' }}>{label}</span>
  </button>
);

export default AdminDashboard;