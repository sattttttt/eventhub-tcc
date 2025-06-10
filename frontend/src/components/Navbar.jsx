import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from '../context/ThemeToggleButton'; // <-- Impor tombol tema

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const activeLinkStyle = {
    color: 'var(--primary-color)', // Gunakan CSS Variable
    fontWeight: 'bold',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">EventHub</NavLink>
        <div className="nav-links">
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            Semua Event
          </NavLink>
          {user ? (
            <>
              <NavLink to="/create-event" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                Buat Event
              </NavLink>
              <NavLink to="/my-events" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                Event Saya
              </NavLink>
              <button onClick={handleLogout}>Logout ({user.nama || user.email})</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                Login
              </NavLink>
              <NavLink to="/register" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                Register
              </NavLink>
            </>
          )}
          <ThemeToggleButton /> {/* <-- Tambahkan tombol di sini */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;