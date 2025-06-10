import { Event, User } from '../model/index.js';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize'; // <-- Impor Op dari sequelize
import { Category } from '../model/index.js'; // <-- Impor Category

// --- Inisialisasi Google Cloud Storage ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyFilePath = path.join(__dirname, '..', 'gcs-credentials.json');

const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

/**
 * Membuat event baru dengan upload gambar poster.
 */
export const createEvent = async (req, res) => {
  const { nama_acara, deskripsi, tanggal_acara, lokasi } = req.body;
  const organizerId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "Gambar poster wajib di-upload." });
  }

  // --- BAGIAN YANG DIPERBAIKI ---
  // Ambil nama file asli dan ganti semua spasi dengan garis bawah (_)
  const originalname = req.file.originalname;
  const sanitizedFilename = originalname.replace(/\s/g, "_");
  
  // Gunakan nama file yang sudah bersih untuk membuat nama blob
  const blob = bucket.file(`posters/${Date.now()}-${sanitizedFilename}`);
  // --- AKHIR BAGIAN YANG DIPERBAIKI ---

  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    return res.status(500).json({ message: err.message });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    try {
      const newEvent = await Event.create({
        nama_acara,
        deskripsi,
        tanggal_acara,
        lokasi,
        url_poster: publicUrl,
        organizerId,
      });
      res.status(201).json({ message: "Event berhasil dibuat", event: newEvent });
    } catch (error) {
      res.status(500).json({ message: "Gagal menyimpan data event ke database", error: error.message });
    }
  });

  // Kirim buffer file ke GCS untuk memulai upload
  blobStream.end(req.file.buffer);
};

/**
 * Mendapatkan semua event.
 */
export const getAllEvents = async (req, res) => {
  try {
    const { search, category } = req.query; // Ambil query dari URL
    
    const options = {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['nama'],
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ],
      where: {}
    };

    // Jika ada query pencarian
    if (search) {
      options.where.nama_acara = {
        [Op.like]: `%${search}%`
      };
    }

    // Jika ada query filter kategori
    if (category) {
      options.include[1].where = { name: category };
    }

    const events = await Event.findAll(options);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data event", error: error.message });
  }
};

/**
 * Mendapatkan satu event berdasarkan ID.
 */
export const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id, {
            include: { model: User, as: 'organizer', attributes: ['id', 'nama', 'email'] },
        });
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data event", error: error.message });
    }
};

/**
 * Mengupdate data sebuah event.
 */
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (event.organizerId !== userId) {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan penyelenggara event ini." });
        }
        
        // Note: Logika update gambar tidak dicakup di sini agar sederhana.
        // Fungsi ini hanya akan mengupdate data teks.
        await event.update(req.body);
        res.json({ message: "Event berhasil diupdate", event });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate event", error: error.message });
    }
};

/**
 * Menghapus sebuah event.
 */
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (event.organizerId !== userId) {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan penyelenggara event ini." });
        }
        
        // TODO: Tambahkan logika untuk menghapus gambar dari GCS jika diperlukan.
        await event.destroy();
        res.json({ message: "Event berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus event", error: error.message });
    }
};