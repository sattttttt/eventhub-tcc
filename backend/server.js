import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mainRouter from './routes/index.js';
import db from './config/database.js'; // Impor koneksi db

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', mainRouter);

// Start server dan sinkronisasi database
app.listen(PORT, async () => {
  try {
    // Menguji koneksi ke database
    await db.authenticate();
    console.log('✅ Database connected successfully.');
    
    // Sinkronisasi model (membuat tabel jika belum ada)
    // Hati-hati dengan { force: true } karena akan menghapus dan membuat ulang tabel
    await db.sync(); 
    console.log('🔄 All models were synchronized successfully.');
app.get('/', (req, res) => {
    res.send('Welcome to the Event Management API');
  },)
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database or sync models:', error);
  }
});