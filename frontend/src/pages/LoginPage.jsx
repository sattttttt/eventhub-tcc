import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast'; // Impor toast

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      toast.success('Login berhasil!'); // <-- Ganti alert
      login(response.data.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Login gagal. Periksa kembali email dan password Anda.'); // <-- Ganti setError
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login ke Akun Anda</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
      <p className="form-footer">
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
};

export default LoginPage;