import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/api';
import { toast } from 'react-toastify';
import './PostForm.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Health', 'Career', 'Wellness', 'Education', 'Travel', 'Food', 'Finance', 'Science', 'General'];

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', image: '', category: 'General', tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      const res = await createPost(payload);
      toast.success('Post published!');
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    }
    setLoading(false);
  };

  return (
    <div className="post-form-page container">
      <div className="post-form-card">
        <h1>✏️ Write a New Post</h1>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title *</label>
            <input type="text" placeholder="Give your post a captivating title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input type="text" placeholder="e.g. AI, Future, Tech" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Cover Image URL</label>
            <input type="text" placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            {form.image && <img src={form.image} alt="preview" className="img-preview" onError={e => e.target.style.display='none'} />}
          </div>
          <div className="form-group">
            <label>Short Excerpt (optional — auto-generated if empty)</label>
            <textarea placeholder="A brief summary shown in post cards..." value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea placeholder="Write your post here... Use blank lines to separate paragraphs." value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={16} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Publishing...' : '🚀 Publish Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
