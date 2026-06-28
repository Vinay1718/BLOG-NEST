# ✍️ BlogSite — Full-Stack MERN Blog Platform

A production-ready, feature-complete blog platform built with **MongoDB, Express, React, and Node.js**.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the App](#running-the-app)
- [Seeding Sample Data](#seeding-sample-data)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Environment Variables](#environment-variables)
- [Deployment Guide](#deployment-guide)
- [Testing Checklist](#testing-checklist)

---

## ✅ Features

### For Readers
- 🏠 **Home Page** — Featured hero post + paginated grid of all posts
- 🔍 **Search** — Full-text search across post titles, content, and excerpts
- 🗂 **Category Filter** — Browse posts by category (Technology, Health, Lifestyle, etc.)
- 📖 **Post Detail** — Full post view with cover image, author info, view count
- ❤️ **Like Posts** — Like/unlike any post (requires login)
- 💬 **Comments** — Read, write, and delete comments on posts
- 📧 **Newsletter** — Subscribe to email updates via footer form

### For Writers
- ✏️ **Create Post** — Rich post editor with title, content, image URL, category, tags
- 📝 **Edit Post** — Update any post you authored
- 🗑 **Delete Post** — Remove your own posts (with confirmation)
- 👤 **Profile Page** — View and edit your name, bio, avatar, and password
- 📚 **My Posts** — See all posts you've written with edit/delete controls

### For Admins
- 📊 **Dashboard** — Stats overview: total posts, users, comments, subscribers
- 👥 **User Management** — View all registered users
- 🛡 **Moderation** — Delete any post or comment platform-wide

### General
- 🔐 **JWT Authentication** — Secure login/register with 7-day tokens
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet, and desktop
- 🍞 **Toast Notifications** — Success/error feedback on every action
- 🔒 **Protected Routes** — Login and admin guards on sensitive pages
- ℹ️ **About Page** — Platform stats and mission statement
- 📬 **Contact Page** — Contact form with server-side handling

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6         |
| Styling    | Custom CSS with CSS Variables      |
| HTTP       | Axios                             |
| Notifications | react-toastify               |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Dev Tools  | nodemon                           |

---

## 📁 Project Structure

```
MERN STACK/
├── backend/
│   ├── server.js          # Express app, all routes, all models
│   ├── seed.js            # Database seeder with sample posts
│   ├── package.json
│   ├── .env.example       # Environment variable template
│   └── .gitignore
│
└── blog/                  # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── api.js             # All Axios API calls
    │   ├── context/
    │   │   └── AuthContext.js     # Global auth state
    │   ├── components/
    │   │   ├── Navbar/            # Sticky navbar with search
    │   │   ├── Footer/            # Footer with newsletter
    │   │   ├── PostCard/          # Blog post card
    │   │   ├── PrivateRoute.js    # Login guard
    │   │   └── AdminRoute.js      # Admin guard
    │   ├── pages/
    │   │   ├── Home.js            # Hero + post grid + pagination
    │   │   ├── PostDetail.js      # Full post + comments
    │   │   ├── CreatePost.js      # Post creation form
    │   │   ├── EditPost.js        # Post edit form
    │   │   ├── Profile.js         # User profile + my posts
    │   │   ├── Login.js           # Login page
    │   │   ├── Register.js        # Registration page
    │   │   ├── About.js           # About page
    │   │   ├── Contact.js         # Contact form
    │   │   ├── AdminDashboard.js  # Admin panel
    │   │   └── NotFound.js        # 404 page
    │   ├── App.js                 # Root with all routes
    │   └── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed before starting:

| Tool      | Version  | Check Command       |
|-----------|----------|---------------------|
| Node.js   | ≥ 18.x   | `node --version`    |
| npm       | ≥ 9.x    | `npm --version`     |
| MongoDB   | ≥ 6.x    | `mongod --version`  |

**Install MongoDB:**
- **Windows:** Download from https://www.mongodb.com/try/download/community
- **macOS:** `brew tap mongodb/brew && brew install mongodb-community`
- **Ubuntu:** `sudo apt install mongodb`

---

## 🚀 Installation & Setup

### Step 1 — Clone / Extract the Project

If you downloaded a ZIP, extract it. You should have the `MERN STACK` folder.

### Step 2 — Set Up the Backend

```bash
# Navigate to backend folder
cd "MERN STACK/backend"

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Now open `.env` and set your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=choose_a_long_random_secret_string_here
CLIENT_URL=http://localhost:3000
```

### Step 3 — Set Up the Frontend

```bash
# Open a new terminal window, navigate to frontend
cd "MERN STACK/blog"

# Install dependencies
npm install
```

---

## ▶️ Running the App

You need **two terminal windows** running simultaneously:

### Terminal 1 — Start MongoDB (if not running as a service)
```bash
# Start MongoDB
mongod

# OR if installed as a service (macOS/Linux)
brew services start mongodb-community   # macOS
sudo systemctl start mongod             # Ubuntu
```

### Terminal 2 — Start the Backend
```bash
cd "MERN STACK/backend"
npm run dev        # Development (auto-restart with nodemon)
# OR
npm start          # Production
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```

### Terminal 3 — Start the Frontend
```bash
cd "MERN STACK/blog"
npm start
```

The app will automatically open at **http://localhost:3000**

---

## 🌱 Seeding Sample Data

To populate the database with 6 sample blog posts and 2 test accounts:

```bash
cd "MERN STACK/backend"
npm run seed
```

This creates:

| Account        | Email               | Password   | Role  |
|----------------|---------------------|------------|-------|
| Admin User     | admin@blog.com      | admin123   | admin |
| Jane Doe       | jane@blog.com       | user123    | user  |

And 6 sample posts across: Technology, Lifestyle, Wellness, Health, Career categories.

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint                   | Auth Required | Description              |
|--------|----------------------------|---------------|--------------------------|
| POST   | `/api/auth/register`       | No            | Create new account       |
| POST   | `/api/auth/login`          | No            | Login, returns JWT token |
| GET    | `/api/auth/me`             | Yes           | Get current user         |
| PUT    | `/api/auth/profile`        | Yes           | Update profile           |
| PUT    | `/api/auth/change-password`| Yes           | Change password          |

### Post Endpoints

| Method | Endpoint                   | Auth Required | Description                       |
|--------|----------------------------|---------------|-----------------------------------|
| GET    | `/api/posts`               | No            | Get posts (search, category, page)|
| GET    | `/api/posts/:slug`         | No            | Get single post, increments views |
| POST   | `/api/posts`               | Yes           | Create new post                   |
| PUT    | `/api/posts/:id`           | Yes (author)  | Update post                       |
| DELETE | `/api/posts/:id`           | Yes (author)  | Delete post                       |
| POST   | `/api/posts/:id/like`      | Yes           | Toggle like on post               |
| GET    | `/api/categories`          | No            | Get all categories                |

### Comment Endpoints

| Method | Endpoint                        | Auth Required | Description          |
|--------|---------------------------------|---------------|----------------------|
| GET    | `/api/posts/:postId/comments`   | No            | Get post comments    |
| POST   | `/api/posts/:postId/comments`   | Yes           | Add a comment        |
| DELETE | `/api/comments/:id`             | Yes (author)  | Delete a comment     |

### Other Endpoints

| Method | Endpoint                | Auth Required | Description           |
|--------|-------------------------|---------------|-----------------------|
| POST   | `/api/newsletter`       | No            | Subscribe to newsletter|
| POST   | `/api/contact`          | No            | Submit contact form    |
| GET    | `/api/admin/stats`      | Admin only    | Dashboard statistics  |
| GET    | `/api/admin/users`      | Admin only    | List all users        |
| GET    | `/api/health`           | No            | Health check          |

---

## 🗺 Pages & Routes

| Route           | Component        | Access    | Description                   |
|-----------------|------------------|-----------|-------------------------------|
| `/`             | Home             | Public    | Blog homepage with posts      |
| `/login`        | Login            | Public    | Login form                    |
| `/register`     | Register         | Public    | Registration form             |
| `/about`        | About            | Public    | About page with stats         |
| `/contact`      | Contact          | Public    | Contact form                  |
| `/post/:slug`   | PostDetail       | Public    | Full post view + comments     |
| `/create`       | CreatePost       | Login req  | Create new blog post          |
| `/edit/:id`     | EditPost         | Author req | Edit existing post            |
| `/profile`      | Profile          | Login req  | User profile + my posts       |
| `/admin`        | AdminDashboard   | Admin req | Admin panel                   |
| `*`             | NotFound         | Public    | 404 page                      |

---

## 🌍 Deployment Guide

### Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to https://render.com and create a **Web Service**
3. Connect your GitHub repo, select the `backend` folder as root
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add Environment Variables in Render dashboard:
   - `MONGO_URI` — Get from MongoDB Atlas (see below)
   - `JWT_SECRET` — Any long random string
   - `CLIENT_URL` — Your Vercel frontend URL

### Set Up MongoDB Atlas (Free Cloud Database)

1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user (username + password)
4. Get your connection string:  
   `mongodb+srv://username:password@cluster.mongodb.net/blogdb`
5. Set as `MONGO_URI` in your backend environment

### Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com
2. Import your GitHub repo, select the `blog` folder as root
3. Framework: Create React App
4. Add Environment Variable: none needed (uses proxy)
5. Update `src/api/api.js` — change baseURL to your Render backend URL:
   ```js
   const API = axios.create({ baseURL: 'https://your-render-app.onrender.com/api' });
   ```

---

## ✅ Testing Checklist

Use this checklist to verify every feature is working correctly:

### Authentication
- [ ] Register a new account — check success toast
- [ ] Login with that account — check navbar changes
- [ ] Refresh the page — should stay logged in
- [ ] Logout — should redirect to home
- [ ] Login with wrong password — should show error

### Posts
- [ ] View all posts on homepage
- [ ] Search for "AI" in the navbar search bar
- [ ] Filter by "Technology" category
- [ ] Click a post card — should open full post
- [ ] View count should increment on each visit
- [ ] Like a post (must be logged in)
- [ ] Unlike the same post
- [ ] Try liking without login — should prompt to login

### Create / Edit / Delete
- [ ] Click "Write" in navbar (must be logged in)
- [ ] Fill out title, category, image URL, content
- [ ] Publish post — should redirect to post page
- [ ] Click "Edit" button on your post
- [ ] Change the title and save
- [ ] Delete a post — confirm dialog should appear

### Comments
- [ ] View comments on any post
- [ ] Add a comment (must be logged in)
- [ ] Delete your own comment
- [ ] Comments should appear immediately

### Profile
- [ ] Update name and bio
- [ ] Set an avatar URL (try: `https://api.dicebear.com/7.x/avataaars/svg?seed=myname`)
- [ ] View "My Posts" tab — see your authored posts
- [ ] Change password

### Admin Panel
- [ ] Login as `admin@blog.com` / `admin123`
- [ ] Visit `/admin`
- [ ] Check stats: posts, users, comments, subscribers
- [ ] View all users in the Users tab
- [ ] Delete a post from the admin panel

### Newsletter & Contact
- [ ] Enter email in footer and subscribe
- [ ] Try subscribing again — should say "Already subscribed"
- [ ] Fill out the Contact form and submit

### Responsive Design
- [ ] Test on mobile width (< 768px)
- [ ] Navbar hamburger menu opens/closes
- [ ] Post grid collapses to single column
- [ ] Forms are usable on small screens

---

## 🔒 Security Notes

- **JWT tokens** are stored in `localStorage` with 7-day expiry
- **Passwords** are hashed with bcryptjs (12 salt rounds)
- **Authorization checks** prevent users from editing/deleting others' content
- **Change JWT_SECRET** to a long, random string in production — never commit it to Git
- Add rate limiting (express-rate-limit) before going to production

---

## 📄 License

This project is for educational purposes. Built as a MERN stack learning project.

---

*Made with ❤️ using MongoDB, Express, React & Node.js*
