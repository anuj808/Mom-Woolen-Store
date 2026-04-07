import { Router } from 'express';
import { sendOtp, verifyOtp, setupProfile, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/send-otp',      sendOtp);
router.post('/verify-otp',    verifyOtp);
router.post('/setup-profile', protect, setupProfile);
router.get('/me',             protect, getMe);

export default router;