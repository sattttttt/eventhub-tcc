import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="event-card">
      <img src={event.url_poster || 'https://via.placeholder.com/400x200.png?text=EventHub'} alt={event.nama_acara} />
      <div className="event-card-content">
        <h3>{event.nama_acara}</h3>
        <p>
            <strong>Lokasi:</strong> {event.lokasi}<br/>
            <strong>Tanggal:</strong> {new Date(event.tanggal_acara).toLocaleDateString('id-ID')}
        </p>
      </div>
    </Link>
  );
};

export default EventCard;