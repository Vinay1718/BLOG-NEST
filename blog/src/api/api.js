import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Posts
export const getPosts = (params) => API.get('/posts', { params });
export const getPost = (slug) => API.get(`/posts/${slug}`);
export const incrementView = (slug) => API.post(`/posts/${slug}/view`);
export const getPostById = (id) => API.get(`/posts/id/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const getCategories = () => API.get('/categories');

// Comments
export const getComments = (postId) => API.get(`/posts/${postId}/comments`);
export const createComment = (postId, data) => API.post(`/posts/${postId}/comments`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// Newsletter
export const subscribe = (email) => API.post('/newsletter', { email });

// Contact
export const sendContact = (data) => API.post('/contact', data);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');

export default API;
