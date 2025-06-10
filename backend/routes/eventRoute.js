import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controller/eventController.js';
import { registerForEvent, cancelRegistration } from '../controller/registrationController.js';
import verifyToken from '../middleware/verifyToken.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// --- Rute untuk mengelola event (CRUD) ---
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', verifyToken, updateEvent);
router.delete('/:id', verifyToken, deleteEvent);

// Rute untuk membuat event, menggunakan middleware upload gambar
router.post('/', verifyToken, upload.single('poster'), createEvent);


// --- Rute untuk registrasi event ---
// Mendaftar ke sebuah event berdasarkan ID event
router.post('/:id/register', verifyToken, registerForEvent);

// Membatalkan pendaftaran dari sebuah event berdasarkan ID event
router.delete('/:id/register', verifyToken, cancelRegistration);


export default router;