import express from 'express';
import { register, reVerfiy, verify, login } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerfiy)
router.post('/login', login)
// router.post('/logout', logout)

export default router;