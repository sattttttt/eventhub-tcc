import { Registration, Event, User } from '../model/index.js';

/**
 * Mendaftarkan user yang sedang login ke sebuah event.
 */
export const registerForEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id; // Diambil dari token JWT

  try {
    // Langkah 1: Cek dulu apakah event-nya ada
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    // Langkah 2: Buat entri registrasi baru di tabel 'registrations'
    await Registration.create({
      userId,
      eventId,
    });

    res.status(201).json({ message: 'Anda berhasil terdaftar pada event ini' });
  } catch (error) {
    // Langkah 3: Tangani error jika user mencoba mendaftar dua kali
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Anda sudah terdaftar pada event ini' });
    }
    // Tangani error server lainnya
    res.status(500).json({ message: 'Gagal mendaftar ke event', error: error.message });
  }
};

/**
 * Membatalkan pendaftaran user yang sedang login dari sebuah event.
 */
export const cancelRegistration = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    // Hapus baris di tabel 'registrations' yang cocok dengan userId dan eventId
    const result = await Registration.destroy({
      where: {
        userId,
        eventId,
      },
    });

    // Cek apakah ada baris yang benar-benar dihapus
    if (result === 0) {
      return res.status(404).json({ message: 'Registrasi tidak ditemukan. Anda mungkin belum terdaftar di event ini.' });
    }

    res.status(200).json({ message: 'Pendaftaran Anda berhasil dibatalkan' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membatalkan pendaftaran', error: error.message });
  }
};

/**
 * Mendapatkan semua event yang diikuti oleh user yang sedang login.
 */
export const getMyRegisteredEvents = async (req, res) => {
    const userId = req.user.id;
    try {
        const userWithEvents = await User.findByPk(userId, {
            // Gunakan 'include' untuk mengambil data event yang terhubung melalui tabel registrasi
            include: {
                model: Event,
                as: 'registeredEvents', // Gunakan alias yang kita definisikan di model/index.js
                through: { attributes: [] } // Ini agar data dari tabel perantara (registrations) tidak ikut ditampilkan
            }
        });

        if (!userWithEvents) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Kirim hanya array event-nya saja
        res.json(userWithEvents.registeredEvents);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data event yang diikuti', error: error.message });
    }
}