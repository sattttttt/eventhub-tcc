import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [namaAcara, setNamaAcara] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [lokasi, setLokasi] = useState('');
  
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [eventRes, categoriesRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get('/categories')
        ]);

        const event = eventRes.data;
        setAllCategories(categoriesRes.data);
        
        setNamaAcara(event.nama_acara);
        setDeskripsi(event.deskripsi);
        setLokasi(event.lokasi);
        
        const eventDate = new Date(event.tanggal_acara);
        eventDate.setMinutes(eventDate.getMinutes() - eventDate.getTimezoneOffset());
        setTanggalAcara(eventDate.toISOString().slice(0, 16));
        
        const initialCategoryIds = event.categories.map(cat => cat.id);
        setSelectedCategories(initialCategoryIds);

      } catch (err) {
        toast.error('Gagal memuat data event.');
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

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

        {/* --- PERUBAHAN TAMPILAN DI SINI --- */}
        <div className="form-group">
            <label>Kategori (bisa pilih lebih dari satu)</label>
            <div className="category-pills-container">
                {allCategories.map(cat => (
                    <div
                        key={cat.id}
                        className={`category-pill ${selectedCategories.includes(cat.id) ? 'selected' : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                    >
                        {cat.name}
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