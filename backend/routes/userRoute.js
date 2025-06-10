import express from 'express';
import { getMyRegisteredEvents } from '../controller/registrationController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Rute untuk mendapatkan semua event yang diikuti oleh user yang sedang login
// Method: GET, URL: /api/users/me/events
router.get('/me/events', verifyToken, getMyRegisteredEvents);

export default router;