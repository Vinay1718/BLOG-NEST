import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, deletePost } from '../api/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const loadUsers = async () => {
    if (users.length > 0) return;
    try {
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch { toast.error('Failed to load users'); }
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') loadUsers();
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setStats(s => ({ ...s, recentPosts: s.recentPosts.filter(p => p._id !== id), totalPosts: s.totalPosts - 1 }));
      toast.success('Post deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="spinner" style={{marginTop:100}} />;

  return (
    <div className="admin-page container">
      <h1>🛠 Admin Dashboard</h1>
      <div className="admin-tabs">
        {['stats', 'users'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTab(tab)}>
            {tab === 'stats' ? '📊 Overview' : '👥 Users'}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && stats && (
        <div>
          <div className="stats-grid">
            <StatCard icon="📝" label="Total Posts" value={stats.totalPosts} />
            <StatCard icon="👤" label="Total Users" value={stats.totalUsers} />
            <StatCard icon="💬" label="Total Comments" value={stats.totalComments} />
            <StatCard icon="📧" label="Subscribers" value={stats.totalSubscribers} />
          </div>
          <div className="recent-posts-section">
            <h2>Recent Posts</h2>
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {stats.recentPosts.map(p => (
                  <tr key={p._id}>
                    <td><Link to={`/post/${p.slug}`}>{p.title}</Link></td>
                    <td>{p.author?.name}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger" style={{fontSize:'0.78rem',padding:'5px 10px'}} onClick={() => handleDeletePost(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>All Users ({users.length})</h2>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    {u.avatar ? <img src={u.avatar} alt={u.name} style={{width:32,height:32,borderRadius:'50%',objectFit:'cover'}} /> : <div style={{width:32,height:32,borderRadius:'50%',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700}}>{u.name.charAt(0)}</div>}
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card-admin">
      <span className="stat-icon">{icon}</span>
      <div><span className="stat-value">{value}</span><span className="stat-label">{label}</span></div>
    </div>
  );
}
