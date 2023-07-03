import express from 'express';
import { login, logout, register, resetPassword, forgotPassword, verifyEmail } from '../controllers'
import { authenticateUser } from '../middlewares';

const router = express.Router();

router.post('/register', register)
router.post('/verify-email', authenticateUser, verifyEmail)
router.post('/login', login)
router.delete('/logout', authenticateUser, logout)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router