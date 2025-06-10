import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me/events');
        setEvents(response.data);
      } catch (err) {
        setError('Gagal memuat event yang Anda ikuti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h2>Event yang Saya Ikuti</h2>
      <div className="event-list">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p>Anda belum terdaftar di event mana pun. Ayo cari event seru di halaman utama!</p>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;