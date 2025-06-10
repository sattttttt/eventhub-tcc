import express from 'express';
import authRoute from './authRoute.js';
import eventRoute from './eventRoute.js';
import userRoute from './userRoute.js';
import categoryRoute from './categoryRoute.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/events', eventRoute);
router.use('/users', userRoute);
router.use('/categories', categoryRoute); 

export default router;