import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPosts, getCategories } from '../api/api';
import PostCard from '../components/PostCard/PostCard';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  // Reset to page 1 whenever search or category changes
  useEffect(() => { setPage(1); }, [search, category]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPosts({ page, limit: 9, search, category });
      if (page === 1 && !search && !category && res.data.posts.length > 0) {
        setFeatured(res.data.posts[0]);
        setPosts(res.data.posts.slice(1));
      } else {
        setFeatured(null);
        setPosts(res.data.posts);
      }
      setTotalPages(res.data.pages);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [page, search, category]);

  useEffect(() => { loadPosts(); }, [loadPosts]);
  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleCategory = (cat) => {
    setPage(1);
    if (cat === category) setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div>
      {/* Hero Banner */}
      {!search && !category && page === 1 && (
        <div className="hero">
          <div className="hero-content">
            <h1>Welcome to BlogSite</h1>
            <p>Discover stories, ideas, and expertise from writers on any topic.</p>
          </div>
        </div>
      )}

      <div className="home-container container">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="category-filter">
            <button className={`cat-btn ${!category ? 'active' : ''}`} onClick={() => { setPage(1); setSearchParams({}); }}>All</button>
            {categories.map(cat => (
              <button key={cat} className={`cat-btn ${category === cat ? 'active' : ''}`} onClick={() => handleCategory(cat)}>{cat}</button>
            ))}
          </div>
        )}

        {search && <div className="search-header"><h2>Search results for: "<strong>{search}</strong>"</h2><button onClick={() => { setPage(1); setSearchParams({}); }}>✕ Clear</button></div>}

        {/* Featured Post */}
        {featured && !search && !category && (
          <div className="featured-section">
            <h2 className="section-title">✨ Featured</h2>
            <FeaturedCard post={featured} />
          </div>
        )}

        {/* Posts Grid */}
        <div className="posts-section">
          {(!featured || search || category) && <h2 className="section-title">{search ? 'Results' : category || 'Latest Posts'}</h2>}
          {loading ? <div className="spinner" /> : (
            posts.length === 0
              ? <div className="empty-state"><span>📭</span><p>No posts found{search ? ` for "${search}"` : ''}.</p></div>
              : <div className="posts-grid">{posts.map(p => <PostCard key={p._id} post={p} />)}</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i+1} className={`page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
            ))}
            <button className="btn btn-outline" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <Link to={`/post/${post.slug}`} className="featured-card">
      <div className="featured-img">
        {post.image && <img src={post.image} alt={post.title} />}
        <div className="featured-overlay" />
        <div className="featured-text">
          {post.category && <span className="badge" style={{marginBottom:'12px'}}>{post.category}</span>}
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <div className="featured-meta">
            <span>{post.author?.name}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>❤️ {post.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
