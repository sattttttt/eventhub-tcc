import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard'; // <-- Impor komponen baru

const searchContainerStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap'
};

const searchInputStyle = {
  flexGrow: 1,
  padding: '0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  fontSize: '1rem',
  backgroundColor: 'var(--card-bg)', // Agar ikut berubah warna saat dark mode
  color: 'var(--text-color)'
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      // Jangan set loading jika bukan fetch pertama kali (saat filter)
      // agar UI tidak berkedip
      // setLoading(true); // Baris ini bisa di-disable jika tidak ingin skeleton muncul saat filter

      try {
        const response = await api.get('/events', {
          params: {
            search: searchTerm,
            category: selectedCategory,
          }
        });
        setEvents(response.data);
      } catch (err) {
        setError('Gagal memuat event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const timerId = setTimeout(() => {
        fetchEvents();
    }, 500);

    return () => clearTimeout(timerId);

  }, [searchTerm, selectedCategory]);

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Temukan Event Menarik</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--secondary-text)' }}>Jelajahi berbagai acara menarik, mulai dari workshop teknologi hingga festival seni.</p>
      
      <div style={searchContainerStyle}>
        <input 
          type="text" 
          placeholder="Cari nama event..."
          style={searchInputStyle}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          style={searchInputStyle}
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Semua Kategori</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      {error && <p className="error-message">{error}</p>}

      {/* --- LOGIKA BARU UNTUK MENAMPILKAN SKELETON --- */}
      <div className="event-list">
        {loading ? (
          // Tampilkan 6 buah skeleton card saat loading
          [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
        ) : (
          events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p>Tidak ada event yang cocok dengan kriteria Anda.</p>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;