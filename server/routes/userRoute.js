import express from 'express';
import { register, reVerfiy, verify, login, logout } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerfiy)
router.post('/login', login)
router.post('/logout', isAuthenticated , logout)

export default router;