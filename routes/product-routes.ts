import express from 'express';
import { 
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, deleteProduct, uploadImage,
    saveProduct, getSavedProducts, unsaveProduct, unsaveAllProducts, 
    getSingleProductReviews 
} from '../controllers'
import { authenticateUser, authorizePermissions } from '../middlewares'

const router = express.Router();

router.route('/')
  .post([authenticateUser, authorizePermissions], createProduct)
  .get(getAllProducts);

router.route('/uploadImage')
  .post([authenticateUser, authorizePermissions], uploadImage);

router.route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions], updateProduct)
  .delete([authenticateUser, authorizePermissions], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

router.route('/save').post(saveProduct).get(getSavedProducts).delete(unsaveAllProducts)
router.route('/save/:externalID').delete(unsaveProduct)
export default router