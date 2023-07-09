import express from 'express';
import { 
    getAllOrders,  getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder, 
} from '../controllers'
import { authorizePermissions } from '../middlewares'

const router = express.Router();

router
  .route('/')
  .post(createOrder)
  .get(authorizePermissions, getAllOrders);

router.route('/show-my-orders').get(getCurrentUserOrders);

router
  .route('/:id')
  .get(getSingleOrder)
  .patch(updateOrder);

export default router