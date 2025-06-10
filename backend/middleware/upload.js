import multer from 'multer';

// Konfigurasi multer untuk menyimpan file di memori sementara
// sebelum di-upload ke GCS.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5 MB
  },
});

export default upload;