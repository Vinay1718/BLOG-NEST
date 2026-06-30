const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ─── Database ──────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

// ─── Models ────────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  avatar:    { type: String, default: '' },
  bio:       { type: String, default: '' },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, required: true, unique: true },
  content:   { type: String, required: true },
  excerpt:   { type: String, default: '' },
  image:     { type: String, default: '' },
  category:  { type: String, default: 'General' },
  tags:      [{ type: String }],
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views:     { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

const CommentSchema = new mongoose.Schema({
  post:      { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', CommentSchema);

const NewsletterSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true },
  subscribedAt: { type: Date, default: Date.now }
});
const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

// ─── Auth Middleware ────────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const slugify = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ═══════════════════════════════════════════════════════
//   AUTH ROUTES
// ═══════════════════════════════════════════════════════

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, { name, bio, avatar }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Change password
app.put('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════
//   POST ROUTES
//   IMPORTANT: More specific routes MUST come before /:slug
//   Order: /posts (list) → /posts/id/:id → /posts/:postId/comments → /posts/:slug
// ═══════════════════════════════════════════════════════

// GET all posts with search, category filter, pagination
app.get('/api/posts', async (req, res) => {
  try {
    const { page = 1, limit = 9, category, tag, search, author } = req.query;
    const query = { published: true };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;
    if (search) query.$or = [
      { title:   { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ posts, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET post by MongoDB _id — for the Edit page (auth required, author only)
// MUST be before /:slug
app.get('/api/posts/id/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar bio');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author._id.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET comments for a post — MUST be before /:slug to avoid being swallowed
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST comment — MUST be before /:slug
app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content is required' });
    const comment = await Comment.create({ post: req.params.postId, author: req.user.id, content });
    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single post by slug — catch-all, must be LAST of GET /posts/*
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      published: true
    }).populate('author', 'name avatar bio');

    if (!post)
      return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/posts/:slug/view', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      {
        slug: req.params.slug,
        published: true
      },
      {
        $inc: { views: 1 }
      },
      {
        new: true
      }
    );

    if (!post)
      return res.status(404).json({ message: 'Post not found' });

    res.json({
      views: post.views
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE post
app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, image, category, tags } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
    let slug = slugify(title);
    if (await Post.findOne({ slug })) slug = `${slug}-${Date.now()}`;
    const post = await Post.create({
      title, slug, content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      image: image || '', category: category || 'General',
      tags: tags || [], author: req.user.id
    });
    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE post
app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    const { title, content, excerpt, image, category, tags, published } = req.body;
    if (title && title !== post.title) {
      let slug = slugify(title);
      if (await Post.findOne({ slug, _id: { $ne: post._id } })) slug = `${slug}-${Date.now()}`;
      post.slug = slug;
    }
    if (title !== undefined)     post.title     = title;
    if (content !== undefined)   post.content   = content;
    if (excerpt !== undefined)   post.excerpt   = excerpt;
    if (image !== undefined)     post.image     = image;
    if (category !== undefined)  post.category  = category;
    if (tags !== undefined)      post.tags      = tags;
    if (published !== undefined) post.published = published;
    post.updatedAt = Date.now();
    await post.save();
    await post.populate('author', 'name avatar');
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE post
app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// LIKE / UNLIKE post
app.post('/api/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userIdStr = req.user.id.toString();
    const likeIndex = post.likes.findIndex(id => id.toString() === userIdStr);
    if (likeIndex === -1) post.likes.push(req.user.id);
    else post.likes.splice(likeIndex, 1);
    await post.save();
    res.json({ likes: post.likes.length, liked: likeIndex === -1 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Post.distinct('category', { published: true });
    res.json(categories.filter(Boolean).sort());
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════
//   COMMENT ROUTES (delete only — create/get are above)
// ═══════════════════════════════════════════════════════

app.delete('/api/comments/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════
//   NEWSLETTER
// ═══════════════════════════════════════════════════════

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (await Newsletter.findOne({ email })) return res.status(400).json({ message: 'Already subscribed!' });
    await Newsletter.create({ email });
    res.json({ message: 'Subscribed successfully! Welcome aboard.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════
//   CONTACT
// ═══════════════════════════════════════════════════════

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required' });
    // In production: send email here via nodemailer
    console.log('📧 Contact form submission:', { name, email, message });
    res.json({ message: 'Message received! We will get back to you within 24 hours.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════
//   ADMIN ROUTES
// ═══════════════════════════════════════════════════════

app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totalPosts, totalUsers, totalComments, totalSubscribers] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Newsletter.countDocuments()
    ]);
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name');
    res.json({ totalPosts, totalUsers, totalComments, totalSubscribers, recentPosts });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════
//   HEALTH CHECK
// ═══════════════════════════════════════════════════════

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
