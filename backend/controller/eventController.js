import { Event, User, Category } from '../model/index.js'; // Impor Category
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize'; // Pastikan Op sudah diimpor

// ... (Inisialisasi Google Cloud Storage tidak berubah) ...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyFilePath = path.join(__dirname, '..', 'gcs-credentials.json');
const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: process.env.GCS_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);


export const createEvent = async (req, res) => {
  // Ambil 'categories' dari request body
  const { nama_acara, deskripsi, tanggal_acara, lokasi, categories } = req.body;
  const organizerId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "Gambar poster wajib di-upload." });
  }

  const originalname = req.file.originalname;
  const sanitizedFilename = originalname.replace(/\s/g, "_");
  const blob = bucket.file(`posters/${Date.now()}-${sanitizedFilename}`);
  const blobStream = blob.createWriteStream({ resumable: false });

  blobStream.on('error', (err) => { /* ... (tidak berubah) ... */ });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    try {
      const newEvent = await Event.create({
        nama_acara, deskripsi, tanggal_acara, lokasi,
        url_poster: publicUrl,
        organizerId,
      });

      // --- BAGIAN BARU: Simpan relasi kategori ---
      if (categories) {
        const categoryIds = JSON.parse(categories); // Data dari form-data adalah string
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
          await newEvent.setCategories(categoryIds); // Sequelize akan otomatis mengisi tabel penghubung
        }
      }
      // --- AKHIR BAGIAN BARU ---

      res.status(201).json({ message: "Event berhasil dibuat", event: newEvent });
    } catch (error) {
      res.status(500).json({ message: "Gagal menyimpan data event ke database", error: error.message });
    }
  });

  blobStream.end(req.file.buffer);
};


export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    // Ambil 'categories' dari request body
    const { nama_acara, deskripsi, tanggal_acara, lokasi, categories } = req.body;

    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (event.organizerId !== userId) {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan penyelenggara event ini." });
        }
        
        // Update data teks
        await event.update({ nama_acara, deskripsi, tanggal_acara, lokasi });

        // --- BAGIAN BARU: Update relasi kategori ---
        if (categories) {
            const categoryIds = JSON.parse(categories);
            if (Array.isArray(categoryIds)) {
                await event.setCategories(categoryIds); // setCategories akan menghapus yg lama & menambah yg baru
            }
        }
        // --- AKHIR BAGIAN BARU ---
        
        res.json({ message: "Event berhasil diupdate", event });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate event", error: error.message });
    }
};

// ... (fungsi getAllEvents, getEventById, deleteEvent tidak berubah) ...
export const getAllEvents = async (req, res) => { /* ...kode sama... */ };
export const getEventById = async (req, res) => { /* ...kode sama... */ };
export const deleteEvent = async (req, res) => { /* ...kode sama... */ };