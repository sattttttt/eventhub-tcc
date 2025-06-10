import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi untuk membuat URL Google Calendar
  const getGoogleCalendarUrl = (event) => {
    const startTime = new Date(event.tanggal_acara).toISOString().replace(/-|:|\.\d\d\d/g, "");
    // Asumsikan durasi event adalah 2 jam untuk sederhana
    const endTime = new Date(new Date(event.tanggal_acara).getTime() + (2 * 60 * 60 * 1000)).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.nama_acara);
    url.searchParams.append('dates', `${startTime}/${endTime}`);
    url.searchParams.append('details', event.deskripsi);
    url.searchParams.append('location', event.lokasi);
    
    return url.toString();
  };

  // Fungsi untuk memeriksa status registrasi user
  const checkRegistrationStatus = useCallback(async () => {
    if (!user) {
      setIsRegistered(false);
      return;
    }
    try {
      const response = await api.get('/users/me/events');
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

  // useEffect lain untuk memeriksa status registrasi
  useEffect(() => {
    if (event) {
        checkRegistrationStatus();
    }
  }, [event, user, checkRegistrationStatus]);


  // Handler untuk mendaftar event
  const handleRegister = async () => {
    if (!user) {
        toast.error('Anda harus login untuk mendaftar.');
        navigate('/login', { state: { from: location } });
        return;
    }
    setIsSubmitting(true);
    try {
        await api.post(`/events/${id}/register`);
        toast.success('Berhasil mendaftar ke event!');
        setIsRegistered(true);
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
        setIsRegistered(false);
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
      
      <div style={{ marginTop: '1rem' }}>
        <a 
          href={getGoogleCalendarUrl(event)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="button-secondary"
        >
          + Tambahkan ke Google Calendar
        </a>
      </div>

      <hr/>
      <h3>Deskripsi</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{event.deskripsi}</p>
      <hr/>
      
      {/* Bagian Tombol Aksi Dinamis */}
      {isOwner ? (
        <div className="owner-actions">
          <Link to={`/event/${id}/edit`} className="button-secondary">Edit Event</Link>
          <button className="button-danger" onClick={handleDelete}>Delete Event</button>
        </div>
      ) : (
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