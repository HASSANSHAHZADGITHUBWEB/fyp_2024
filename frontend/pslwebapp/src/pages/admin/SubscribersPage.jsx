import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Download, ChevronLeft, ChevronRight, User, Phone, MapPin } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import api from '../../api/axios.js';
import '../../styles/fig.css';

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate(); 

  // --- 1. FETCH SUBSCRIBERS ---
  const fetchSubscribers = async () => {
    try {
      const res = await api.get("subscribers/");
      setSubscribers(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // --- 2. EXPORT TO EXCEL ---
  const handleExport = () => {
    const dataToExport = subscribers.map(sub => ({
      ID: sub.id,
      Name: sub.name,
      Email: sub.email,
      Phone: sub.phone,
      'B-Form/CNIC': sub.bform,
      Address: sub.address,
      'Days Remaining': sub.days_remaining,
      'Trial': sub.trial
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
    XLSX.writeFile(workbook, "Subscribers_List.xlsx");
  };

  // --- 3. DELETE SUBSCRIBER ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await api.delete(`subscribers/${id}/`);
        setSubscribers(subscribers.filter(sub => sub.id !== id));
        alert("Subscriber Deleted successfully");
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  // --- 4. NAVIGATION HANDLERS ---
  const goToAddPage = () => navigate('/admin/add-subscriber'); 
  const goToEditPage = (id) => navigate(`/admin/add-subscriber?edit=${id}`);

  // --- STYLING HELPERS ---
  const getAvatarColor = (name) => {
    if (!name) return '#3699ff';
    const colors = ['#3699ff', '#8950fc', '#1bc5bd', '#ffa800', '#f64e60'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  // Logic to show status based on Days Remaining
  const getStatusBadge = (days, trial) => {
    if (days > 0) {
        return { 
            text: trial === 'yes' ? `Trial (${days} days)` : `Active (${days} days)`, 
            bg: '#c9f7f5', 
            color: '#1bc5bd' 
        };
    }
    return { text: 'Expired', bg: '#ffe2e5', color: '#f64e60' };
  };

  // --- PAGINATION LOGIC ---
  const filteredSubscribers = subscribers.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) return <div className="fade-in-up" style={{padding:30}}>Loading...</div>;

  return (
    <div className="fade-in-up">

      {/* HEADER */}
      <div className="content-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '30px' }}>
        <div>
          <h2 className="section-title" style={{ fontSize: '24px', margin: 0 }}>Subscriber Management</h2>
          <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Manage subscriptions and user details</p>
        </div>
        <button 
          onClick={goToAddPage}
          style={{ 
            background: '#3699ff', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(54, 153, 255, 0.3)'
          }}>
          <Plus size={18} /> Add New Subscriber
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="content-card" style={{ padding: '0' }}>

        {/* TOOLBAR */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="section-title" style={{ fontSize: '16px', margin: 0 }}>All Subscribers</h3>
            <span style={{ background: 'rgba(54, 153, 255, 0.1)', color: '#3699ff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
              {filteredSubscribers.length} Total
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b5b5c3' }} />
              <input 
                type="text" placeholder="Search..." className="custom-input" style={{ paddingLeft: '35px', width: '200px' }}
                value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              />
            </div>
            
            <button onClick={handleExport} className="custom-input" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Download size={16} color="#b5b5c3" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr style={{ background: 'rgba(243, 246, 249, 0.5)' }}>
                <th style={{ paddingLeft: '30px' }}>Subscriber</th>
                <th>Status</th>
                <th>Contact Info</th>
                <th>B-Form / CNIC</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sub) => {
                  const statusInfo = getStatusBadge(sub.days_remaining, sub.trial);

                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ paddingLeft: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            background: `${getAvatarColor(sub.name)}20`, color: getAvatarColor(sub.name),
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
                          }}>
                            {sub.name ? sub.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)' }}>{sub.name}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: statusInfo.bg, color: statusInfo.color }}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td>
                        <div style={{ display:'flex', flexDirection:'column', gap:'2px'}}>
                            <span style={{ fontSize: '13px', color: 'var(--text-main)', display:'flex', alignItems:'center', gap:'5px'}}>
                                <Phone size={12}/> {sub.phone}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {sub.address}
                            </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{sub.bform}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <ActionButton 
                            icon={<Edit size={16} />} color="#3699ff" bg="#e1f0ff" 
                            onClick={() => goToEditPage(sub.id)} 
                          />
                          <ActionButton 
                            icon={<Trash2 size={16} />} color="#f64e60" bg="#ffe2e5" 
                            onClick={() => handleDelete(sub.id)} 
                          />
                        </div>
                      </td>
                    </tr>
                  );
              })}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#b5b5c3' }}>
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --------------------- */}
        {/* NEW PAGINATION DESIGN */}
        {/* --------------------- */}
        {totalPages > 1 && (
            <div style={{ 
                padding: '15px 25px', 
                borderTop: '1px solid #ebedf3', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                
                {/* Left Side: Showing X - Y of Z */}
                <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#7e8299',
                    background: '#f3f6f9',
                    padding: '6px 12px',
                    borderRadius: '6px'
                }}>
                    Showing <span style={{fontWeight: 700, color: '#3f4254'}}>{indexOfFirstItem + 1}</span> - <span style={{fontWeight: 700, color: '#3f4254'}}>{Math.min(indexOfLastItem, filteredSubscribers.length)}</span> of {filteredSubscribers.length}
                </span>

                {/* Right Side: Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    
                    {/* Previous Button */}
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '8px 14px', 
                            border: currentPage === 1 ? '1px solid #ebedf3' : '1px solid #e1f0ff',
                            background: currentPage === 1 ? '#f3f6f9' : '#fff',
                            color: currentPage === 1 ? '#b5b5c3' : '#3699ff',
                            borderRadius: '8px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '13px', fontWeight: '600',
                            transition: 'all 0.2s',
                            boxShadow: currentPage === 1 ? 'none' : '0 2px 6px rgba(54, 153, 255, 0.1)'
                        }}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    {/* Current Page Indicator */}
                    <div style={{
                        width: '36px', height: '36px',
                        background: '#3699ff', color: '#fff',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '600', fontSize: '14px',
                        boxShadow: '0 4px 10px rgba(54, 153, 255, 0.3)'
                    }}>
                        {currentPage}
                    </div>

                    {/* Next Button */}
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '8px 14px', 
                            border: currentPage === totalPages ? '1px solid #ebedf3' : '1px solid #e1f0ff',
                            background: currentPage === totalPages ? '#f3f6f9' : '#fff',
                            color: currentPage === totalPages ? '#b5b5c3' : '#3699ff',
                            borderRadius: '8px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '13px', fontWeight: '600',
                            transition: 'all 0.2s',
                            boxShadow: currentPage === totalPages ? 'none' : '0 2px 6px rgba(54, 153, 255, 0.1)'
                        }}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

const ActionButton = ({ icon, color, bg, onClick }) => (
  <button 
    onClick={onClick} 
    style={{ 
        background: bg, 
        color: color, 
        border: 'none', 
        width: '32px', 
        height: '32px', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        cursor: 'pointer',
        padding: 0
    }}
  >
    {icon}
  </button>
);

export default SubscribersPage;