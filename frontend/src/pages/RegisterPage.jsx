import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast'; // Impor toast

const RegisterPage = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { nama, email, password });
      toast.success('Registrasi berhasil! Silakan login.'); // <-- Ganti alert
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'); // <-- Ganti setError
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Buat Akun Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Register'}
        </button>
      </form>
      <p className="form-footer">
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
};

export default RegisterPage;