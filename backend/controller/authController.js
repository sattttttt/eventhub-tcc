import { User } from '../model/index.js'; // Impor dari model/index.js
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'User berhasil dibuat', data: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    // Cek jika error karena email sudah ada
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ message: 'Login berhasil', accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};