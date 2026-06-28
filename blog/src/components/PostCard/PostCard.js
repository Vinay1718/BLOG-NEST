import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="post-card">
      {post.image && (
        <Link to={`/post/${post.slug}`} className="card-img-wrapper">
          <img src={post.image} alt={post.title} />
          {post.category && <span className="card-category">{post.category}</span>}
        </Link>
      )}
      <div className="card-body">
        <div className="card-meta">
          {post.author?.avatar
            ? <img src={post.author.avatar} alt={post.author.name} className="author-avatar-sm" />
            : <div className="author-initials">{post.author?.name?.charAt(0) || 'A'}</div>
          }
          <span className="author-name">{post.author?.name || 'Anonymous'}</span>
          <span className="meta-sep">·</span>
          <span className="post-date">{date}</span>
        </div>
        <Link to={`/post/${post.slug}`}>
          <h2 className="card-title">{post.title}</h2>
        </Link>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-footer-row">
          <div className="card-stats">
            <span>❤️ {post.likes?.length || 0}</span>
            <span>👁 {post.views || 0}</span>
          </div>
          <div className="card-tags">
            {post.tags?.slice(0,2).map(t => <span className="badge" key={t}>{t}</span>)}
          </div>
          <Link to={`/post/${post.slug}`} className="read-more">Read more →</Link>
        </div>
      </div>
    </div>
  );
}
