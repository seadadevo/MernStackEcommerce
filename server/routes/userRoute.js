import express from 'express';
import { register, reVerfiy, verify, login, logout, forgetPassword, verifyOTP, changePassword } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerfiy)
router.post('/login', login)
router.post('/logout', isAuthenticated , logout)
router.post('/forget-password',  forgetPassword)
router.post('/verify-otp', verifyOTP)
router.post('/change-password',  changePassword)

export default router;