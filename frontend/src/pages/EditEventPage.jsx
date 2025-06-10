import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk form
  const [namaAcara, setNamaAcara] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [lokasi, setLokasi] = useState('');

  // State untuk kategori
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect untuk mengambil SEMUA data saat halaman dibuka
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ambil data event dan data semua kategori secara bersamaan
        const [eventRes, categoriesRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get('/categories')
        ]);

        const event = eventRes.data;
        setAllCategories(categoriesRes.data);

        // Isi form dengan data yang sudah ada
        setNamaAcara(event.nama_acara);
        setDeskripsi(event.deskripsi);
        setLokasi(event.lokasi);
        
        // Format tanggal
        const eventDate = new Date(event.tanggal_acara);
        eventDate.setMinutes(eventDate.getMinutes() - eventDate.getTimezoneOffset());
        setTanggalAcara(eventDate.toISOString().slice(0, 16));
        
        // Isi checkbox kategori yang sudah terpilih
        const initialCategoryIds = event.categories.map(cat => cat.id);
        setSelectedCategories(initialCategoryIds);

      } catch (err) {
        setError('Gagal memuat data event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Kirim data yang diupdate ke backend, termasuk kategori
      await api.put(`/events/${id}`, {
        nama_acara: namaAcara,
        deskripsi: deskripsi,
        tanggal_acara: new Date(tanggalAcara).toISOString(),
        lokasi: lokasi,
        categories: JSON.stringify(selectedCategories)
      });

      toast.success('Event berhasil diupdate!');
      navigate(`/event/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengupdate event.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="form-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
         {/* ... (Form field lain sama seperti Create page) ... */}
         <div className="form-group">
          <label>Nama Acara</label>
          <input type="text" value={namaAcara} onChange={(e) => setNamaAcara(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Deskripsi</label>
          <textarea rows="5" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
        </div>

        <div className="form-group">
            <label>Kategori (bisa pilih lebih dari satu)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {allCategories.map(cat => (
                    <div key={cat.id}>
                        <input 
                            type="checkbox"
                            id={`cat-${cat.id}`}
                            value={cat.id}
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryChange(cat.id)}
                        />
                        <label htmlFor={`cat-${cat.id}`} style={{ marginLeft: '5px', fontWeight: 'normal' }}>{cat.name}</label>
                    </div>
                ))}
            </div>
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
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;