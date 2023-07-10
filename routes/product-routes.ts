import express from 'express';
import { 
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, deleteProduct, uploadImage, getSingleProductReviews 
} from '../controllers'
import { authenticateUser, authorizePermissions } from '../middlewares'

const router = express.Router();

router.route('/')
  .post([authenticateUser, authorizePermissions], createProduct)
  .get(getAllProducts);

router.route('/upload-image')
  .post([authenticateUser, authorizePermissions], uploadImage);

router.route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions], updateProduct)
  .delete([authenticateUser, authorizePermissions], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

export default router