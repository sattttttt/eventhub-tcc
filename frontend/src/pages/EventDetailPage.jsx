import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(''); // Error untuk memuat halaman
  
  // State untuk melacak status registrasi dan proses submit
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi untuk memeriksa apakah user sudah terdaftar di event ini
  const checkRegistrationStatus = useCallback(async () => {
    if (!user) {
      setIsRegistered(false);
      return;
    }

    try {
      const response = await api.get('/users/me/events');
      // Cek apakah ID event saat ini ada di dalam array event yang diikuti user
      const userIsRegistered = response.data.some(regEvent => regEvent.id === parseInt(id));
      setIsRegistered(userIsRegistered);
    } catch (err) {
      console.error("Gagal memeriksa status registrasi:", err);
    }
  }, [user, id]);

  // useEffect untuk mengambil data detail event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setPageError('Gagal memuat detail event atau event tidak ditemukan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // useEffect lain yang berjalan setelah data event atau status login user berubah
  useEffect(() => {
    if (event) {
        checkRegistrationStatus();
    }
  }, [event, user, checkRegistrationStatus]);


  // Handler untuk mendaftar event
  const handleRegister = async () => {
    if (!user) {
        toast.error('Anda harus login untuk mendaftar.');
        navigate('/login', { state: { from: location } }); // Simpan lokasi agar bisa kembali
        return;
    }
    setIsSubmitting(true);
    try {
        await api.post(`/events/${id}/register`);
        toast.success('Berhasil mendaftar ke event!');
        setIsRegistered(true); // Langsung update UI
    } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal mendaftar.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Handler untuk membatalkan registrasi
  const handleCancelRegistration = async () => {
    setIsSubmitting(true);
    try {
        await api.delete(`/events/${id}/register`);
        toast.success('Pendaftaran Anda berhasil dibatalkan.');
        setIsRegistered(false); // Langsung update UI
    } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal membatalkan pendaftaran.');
    } finally {
        setIsSubmitting(false);
    }
  }

  // Handler untuk menghapus event (hanya pemilik)
  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini secara permanen?')) {
        try {
            await api.delete(`/events/${id}`);
            toast.success('Event berhasil dihapus.');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus event.');
        }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (pageError) return <p className="error-message">{pageError}</p>;
  if (!event) return <p>Event tidak ditemukan.</p>;

  const isOwner = user && user.id === event.organizerId;

  return (
    <div className="event-detail">
      {event.url_poster && <img src={event.url_poster} alt={event.nama_acara} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}/>}
      <h1>{event.nama_acara}</h1>
      <p><strong>Penyelenggara:</strong> {event.organizer.nama}</p>
      <p><strong>Lokasi:</strong> {event.lokasi}</p>
      <p><strong>Tanggal:</strong> {new Date(event.tanggal_acara).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
      <hr/>
      <h3>Deskripsi</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{event.deskripsi}</p>
      <hr/>
      
      {/* --- Bagian Tombol Aksi Dinamis --- */}

      {/* Jika user adalah pemilik event */}
      {isOwner && (
        <div className="owner-actions">
          <Link to={`/event/${id}/edit`} className="button-secondary">Edit Event</Link>
          <button className="button-danger" onClick={handleDelete}>Delete Event</button>
        </div>
      )}

      {/* Jika user BUKAN pemilik event */}
      {!isOwner && (
        isRegistered ? (
          <button className="button-danger" onClick={handleCancelRegistration} disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Batalkan Pendaftaran'}
          </button>
        ) : (
          <button className="button-primary" onClick={handleRegister} disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Daftar ke Event Ini'}
          </button>
        )
      )}
    </div>
  );
};

export default EventDetailPage;