import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EditEventPage = () => {
  const { id } = useParams(); // Mengambil ID event dari URL
  const navigate = useNavigate();

  // State untuk menyimpan data form
  const [namaAcara, setNamaAcara] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [lokasi, setLokasi] = useState('');
  
  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect untuk mengambil data event yang ada saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data;
        
        // Isi form dengan data yang sudah ada
        setNamaAcara(event.nama_acara);
        setDeskripsi(event.deskripsi);
        setLokasi(event.lokasi);
        // Format tanggal agar sesuai dengan input type="datetime-local"
        const eventDate = new Date(event.tanggal_acara);
        // Mengurangi offset timezone agar waktu lokal benar
        eventDate.setMinutes(eventDate.getMinutes() - eventDate.getTimezoneOffset());
        setTanggalAcara(eventDate.toISOString().slice(0, 16));

      } catch (err) {
        setError('Gagal memuat data event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  // Fungsi yang dijalankan saat form di-submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Kirim data yang sudah diupdate ke backend
      await api.put(`/events/${id}`, {
        nama_acara: namaAcara,
        deskripsi: deskripsi,
        tanggal_acara: new Date(tanggalAcara).toISOString(),
        lokasi: lokasi,
      });

      alert('Event berhasil diupdate!');
      navigate(`/event/${id}`); // Kembali ke halaman detail setelah update
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupdate event.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !namaAcara) return <LoadingSpinner />;
  if (error && !namaAcara) return <p className="error-message">{error}</p>;

  return (
    <div className="form-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama Acara</label>
          <input type="text" value={namaAcara} onChange={(e) => setNamaAcara(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Deskripsi</label>
          <textarea rows="5" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Tanggal & Waktu Acara</label>
          <input type="datetime-local" value={tanggalAcara} onChange={(e) => setTanggalAcara(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Lokasi</label>
          <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required />
        </div>
        <p style={{fontSize: '0.8rem', color: '#718096', marginBottom: '1.5rem'}}>Untuk saat ini, mengubah gambar poster belum didukung.</p>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;