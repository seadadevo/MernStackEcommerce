import express from 'express';
import { register, reVerfiy, verify } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerfiy)

export default router;