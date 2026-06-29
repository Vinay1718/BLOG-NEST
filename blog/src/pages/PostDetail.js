import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getPost,
  incrementView,
  getComments,
  createComment,
  deleteComment,
  likePost,
  deletePost
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './PostDetail.css';

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Effect 1: fetch post + comments only when slug changes
  // user is intentionally NOT a dependency — so views only increment once per visit
  useEffect(() => {
  const load = async () => {
    setLoading(true);

    try {
      // Fetch the post
      const pRes = await getPost(slug);
      let fetchedPost = pRes.data;

      // Count only one view per browser session
      const viewed = sessionStorage.getItem(`viewed-${slug}`);

      if (!viewed) {
        const viewRes = await incrementView(slug);

        fetchedPost = {
          ...fetchedPost,
          views: viewRes.data.views
        };

        sessionStorage.setItem(`viewed-${slug}`, "true");
      }

      setPost(fetchedPost);
      setLikeCount(fetchedPost.likes?.length || 0);

      // Load comments
      const cRes = await getComments(fetchedPost._id);
      setComments(cRes.data);

    } catch (err) {
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  load();
}, [slug, navigate]);
  // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: update liked state when user loads (no API call, no view increment)
  useEffect(() => {
    if (user && post) {
      setLiked(post.likes?.some(id => id.toString() === user.id.toString()));
    }
  }, [user, post]);

  const handleLike = async () => {
    if (!user) return toast.info('Please log in to like posts');
    try {
      const res = await likePost(post._id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch { toast.error('Failed to like post'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Please log in to comment');
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await createComment(post._id, { content: comment });
      setComments([res.data, ...comments]);
      setComment('');
      toast.success('Comment posted!');
    } catch { toast.error('Failed to post comment'); }
    setSubmittingComment(false);
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(id);
      setComments(comments.filter(c => c._id !== id));
    } catch { toast.error('Failed to delete comment'); }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post permanently? This cannot be undone.')) return;
    try {
      await deletePost(post._id);
      toast.success('Post deleted');
      navigate('/');
    } catch { toast.error('Failed to delete post'); }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;
  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  // Compare string IDs to determine authorship
  const isAuthor = user && (
    user.id.toString() === post.author?._id?.toString() ||
    user.role === 'admin'
  );

  return (
    <div className="post-detail-page container">
      <article className="post-article">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          {post.category && <> › <Link to={`/?category=${post.category}`}>{post.category}</Link></>}
          {' '} › <span>{post.title}</span>
        </div>

        {/* Header */}
        <header className="post-header">
          {post.category && <span className="badge" style={{ marginBottom: '12px' }}>{post.category}</span>}
          <h1>{post.title}</h1>

          <div className="post-meta">
            <div className="post-author-info">
              {post.author?.avatar
                ? <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                : <div className="author-initials-lg">{post.author?.name?.charAt(0)}</div>
              }
              <div>
                <p className="author-nm">{post.author?.name}</p>
                <p className="post-date-meta">{date} · {post.views} views</p>
              </div>
            </div>

            <div className="post-actions">
              <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                {liked ? '❤️' : '🤍'} {likeCount}
              </button>
              {isAuthor && (
                <>
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '7px 14px' }}
                    onClick={() => navigate(`/edit/${post._id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: '0.85rem', padding: '7px 14px' }}
                    onClick={handleDeletePost}
                  >
                    🗑 Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map(t => <span className="badge" key={t}>{t}</span>)}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.image && (
          <div className="post-cover">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        {/* Content */}
        <div className="post-body">
          {post.content.split('\n\n').map((para, i) => (
            para.trim() ? <p key={i}>{para}</p> : null
          ))}
        </div>

        {/* Like bar */}
        <div className="post-like-bar">
          <button className={`like-big-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? '❤️ Liked' : '🤍 Like this post'} ({likeCount})
          </button>
          <p>If you found this helpful, share it with others!</p>
        </div>
      </article>

      {/* Author Card */}
      {post.author && (
        <div className="author-card">
          {post.author.avatar
            ? <img src={post.author.avatar} alt={post.author.name} />
            : <div className="author-initials-lg">{post.author.name?.charAt(0)}</div>
          }
          <div>
            <h4>About {post.author.name}</h4>
            <p>{post.author.bio || 'Writer at BlogSite'}</p>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <section className="comments-section">
        <h3>💬 Comments ({comments.length})</h3>

        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={submittingComment}>
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}

        <div className="comments-list">
          {comments.map(c => (
            <div key={c._id} className="comment-item">
              <div className="comment-header">
                {c.author?.avatar
                  ? <img src={c.author.avatar} alt={c.author.name} className="author-avatar-sm" />
                  : <div className="author-initials">{c.author?.name?.charAt(0)}</div>
                }
                <div>
                  <strong>{c.author?.name}</strong>
                  <span className="comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                {user && (
                  user.id.toString() === c.author?._id?.toString() || user.role === 'admin'
                ) && (
                  <button onClick={() => handleDeleteComment(c._id)} className="delete-comment-btn" title="Delete comment">✕</button>
                )}
              </div>
              <p className="comment-content">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </div>
  );
}
