import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../api/api';
import { toast } from 'react-toastify';
import './PostForm.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Health', 'Career', 'Wellness', 'Education', 'Travel', 'Food', 'Finance', 'Science', 'General'];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getPostById(id)
      .then(res => {
        const p = res.data;
        setForm({
          title: p.title,
          content: p.content,
          excerpt: p.excerpt || '',
          image: p.image || '',
          category: p.category || 'General',
          tags: (p.tags || []).join(', ')
        });
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Post not found');
        navigate('/profile');
      })
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      const res = await updatePost(id, payload);
      toast.success('Post updated!');
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    }
    setLoading(false);
  };

  if (fetching) return <div className="spinner" style={{ marginTop: 100 }} />;
  if (!form) return null;

  return (
    <div className="post-form-page container">
      <div className="post-form-card">
        <h1>✏️ Edit Post</h1>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input type="text" placeholder="e.g. AI, Tech, Future" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Cover Image URL</label>
            <input type="text" placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            {form.image && (
              <img src={form.image} alt="preview" className="img-preview" onError={e => e.target.style.display = 'none'} />
            )}
          </div>
          <div className="form-group">
            <label>Excerpt (short summary shown in cards)</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Brief summary of the post..." />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={16} required placeholder="Write your post content here..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
