import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, getPosts, deletePost } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadMyPosts = async () => {
    if (postsLoaded) return;
    try {
      const res = await getPosts({ author: user.id, limit: 50 });
      setMyPosts(res.data.posts);
      setPostsLoaded(true);
    } catch { toast.error('Failed to load your posts'); }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'posts') loadMyPosts();
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(profile);
      setUser(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    setSaving(true);
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    setSaving(false);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await deletePost(id);
      setMyPosts(myPosts.filter(p => p._id !== id));
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete post'); }
  };

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} />
            : <span>{user?.name?.charAt(0).toUpperCase()}</span>
          }
        </div>
        <div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          {user?.role === 'admin' && <span className="badge" style={{ marginTop: 8 }}>Admin</span>}
        </div>
      </div>

      <div className="profile-tabs">
        {['profile', 'posts', 'password'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab)}>
            {tab === 'profile' ? '👤 Profile' : tab === 'posts' ? '📝 My Posts' : '🔒 Password'}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input type="url" value={profile.avatar} onChange={e => setProfile({ ...profile, avatar: e.target.value })} placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=yourname" />
              {profile.avatar && <img src={profile.avatar} alt="avatar preview" style={{ width: 60, height: 60, borderRadius: '50%', marginTop: 10, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell readers about yourself..." rows={4} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        )}

        {activeTab === 'posts' && (
          <div className="my-posts">
            <div className="my-posts-header">
              <h3>My Posts ({myPosts.length})</h3>
              <Link to="/create" className="btn btn-primary">✏️ Write New Post</Link>
            </div>
            {myPosts.length === 0
              ? (
                <div className="empty-state">
                  <span>📝</span>
                  <p>You haven't written any posts yet.</p>
                  <Link to="/create" className="btn btn-primary" style={{ marginTop: 16 }}>Write your first post</Link>
                </div>
              )
              : myPosts.map(p => (
                <div key={p._id} className="my-post-item">
                  {p.image && <img src={p.image} alt={p.title} />}
                  <div className="my-post-info">
                    <h4><Link to={`/post/${p.slug}`}>{p.title}</Link></h4>
                    <p>{new Date(p.createdAt).toLocaleDateString()} · {p.views} views · ❤️ {p.likes?.length || 0}</p>
                    <span className="badge">{p.category}</span>
                  </div>
                  <div className="my-post-actions">
                    <button
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => navigate(`/edit/${p._id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => handleDeletePost(p._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="Min. 6 characters" required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
