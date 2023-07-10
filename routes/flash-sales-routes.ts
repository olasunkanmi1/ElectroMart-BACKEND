import express from 'express';
import { startFlashSales, getTargetTime } from '../controllers'
import { authenticateUser, authorizePermissions } from '../middlewares'

const router = express.Router();

router.route('/').post([authenticateUser, authorizePermissions], startFlashSales).get(getTargetTime);

export default router