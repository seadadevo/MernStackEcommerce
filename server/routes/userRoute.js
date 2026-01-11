import express from 'express';
import { register, 
        allUsers,
        reVerfiy,
        verify,
        login,
        logout,
        forgetPassword,
        verifyOTP,
        changePassword, 
        } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerfiy)
router.post('/login', login)
router.post('/logout', isAuthenticated , logout)
router.post('/forget-password',  forgetPassword)
router.post('/verify-otp', verifyOTP)
router.post('/change-password',  changePassword)
router.get('/all-users', isAuthenticated , restrictTo('admin') , allUsers);

export default router;