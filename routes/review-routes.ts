import express from 'express';
import { createReview, getAllReviews, getSingleReview, updateReview, deleteReview } from '../controllers'
import { authenticateUser, authorizePermissions } from '../middlewares'

const router = express.Router();

router.route('/').post(authenticateUser, createReview)
  .get([authenticateUser, authorizePermissions], getAllReviews);

router
  .route('/:id')
  .get(authenticateUser, getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router