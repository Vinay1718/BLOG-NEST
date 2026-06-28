import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/api';

const AuthContext = createContext(null);

// Normalize any user object so it always has both .id and ._id
const normalizeUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    id: u.id || u._id?.toString(),
    _id: u._id || u.id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUserRaw] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUser = (u) => setUserRaw(normalizeUser(u));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUserRaw(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
