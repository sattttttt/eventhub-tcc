import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateEventPage = () => {
  const [namaAcara, setNamaAcara] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [poster, setPoster] = useState(null);
  
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setAllCategories(response.data);
      } catch (error) {
        console.error("Gagal memuat kategori", error);
        toast.error("Gagal memuat daftar kategori.");
      }
    };
    fetchCategories();
  }, []);

  // Logika ini tidak perlu diubah sama sekali
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!poster) {
      toast.error('Gambar poster wajib di-upload.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('nama_acara', namaAcara);
    formData.append('deskripsi', deskripsi);
    formData.append('tanggal_acara', new Date(tanggalAcara).toISOString());
    formData.append('lokasi', lokasi);
    formData.append('poster', poster);
    formData.append('categories', JSON.stringify(selectedCategories));

    try {
      await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Event berhasil dibuat!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Buat Event Baru Anda</h2>
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
        <div className="form-group">
          <label>Poster Acara</label>
          <input type="file" accept="image/png, image/jpeg" onChange={(e) => setPoster(e.target.files[0])} required />
        </div>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Membuat...' : 'Buat Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;