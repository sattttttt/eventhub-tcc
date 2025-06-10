import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari header "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid.' });
    }
    // Jika token valid, simpan informasi user di dalam object request
    req.user = user;
    next(); // Lanjutkan ke controller atau middleware berikutnya
  });
};

export default verifyToken;