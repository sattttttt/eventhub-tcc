import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = jwtDecode(token);
        // Cek jika token sudah kadaluwarsa
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decodedUser);
        }
      }
    } catch (error) {
      // Jika token tidak valid, hapus saja
      localStorage.removeItem('token');
      setUser(null);
      console.error("Invalid token found in localStorage", error);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};