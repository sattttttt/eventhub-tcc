import { Event, User, Category } from '../model/index.js';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';

// --- Inisialisasi Google Cloud Storage ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyFilePath = path.join(__dirname, '..', 'gcs-credentials.json');

const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);


// --- FUNGSI-FUNGSI CONTROLLER ---

/**
 * Membuat event baru dengan upload gambar dan kategori.
 */
export const createEvent = async (req, res) => {
  const { nama_acara, deskripsi, tanggal_acara, lokasi, categories } = req.body;
  const organizerId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "Gambar poster wajib di-upload." });
  }

  const originalname = req.file.originalname;
  const sanitizedFilename = originalname.replace(/\s/g, "_");
  const blob = bucket.file(`posters/${Date.now()}-${sanitizedFilename}`);
  const blobStream = blob.createWriteStream({ resumable: false });

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

      // Simpan relasi kategori jika ada
      if (categories) {
        const categoryIds = JSON.parse(categories);
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
          await newEvent.setCategories(categoryIds);
        }
      }

      res.status(201).json({ message: "Event berhasil dibuat", event: newEvent });
    } catch (error) {
      res.status(500).json({ message: "Gagal menyimpan data event ke database", error: error.message });
    }
  });

  blobStream.end(req.file.buffer);
};

/**
 * Mendapatkan semua event dengan filter pencarian dan kategori.
 */
export const getAllEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    
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
      where: {},
      order: [['tanggal_acara', 'DESC']] // Urutkan dari yang terbaru
    };

    if (search) {
      options.where.nama_acara = {
        [Op.like]: `%${search}%`
      };
    }

    if (category) {
      // Modifikasi 'include' untuk filter berdasarkan kategori
      options.include[1].where = { name: category };
    }

    const events = await Event.findAll(options);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data event", error: error.message });
  }
};

/**
 * Mendapatkan satu event berdasarkan ID, termasuk data kategorinya.
 */
export const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id, {
            include: [
                { model: User, as: 'organizer', attributes: ['id', 'nama', 'email'] },
                { model: Category, as: 'categories', through: { attributes: [] } } // Ambil data kategori
            ]
        });
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data event", error: error.message });
    }
};

/**
 * Mengupdate data sebuah event, termasuk kategorinya.
 */
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { nama_acara, deskripsi, tanggal_acara, lokasi, categories } = req.body;

    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (event.organizerId !== userId) {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan penyelenggara event ini." });
        }
        
        // Update data teks event
        await event.update({ nama_acara, deskripsi, tanggal_acara, lokasi });

        // Update relasi kategori
        if (categories) {
            const categoryIds = JSON.parse(categories);
            if (Array.isArray(categoryIds)) {
                await event.setCategories(categoryIds);
            }
        }
        
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
        
        // Sebelum menghapus event, hapus relasinya di tabel penghubung
        await event.setCategories([]);
        await event.destroy();

        res.json({ message: "Event berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus event", error: error.message });
    }
};