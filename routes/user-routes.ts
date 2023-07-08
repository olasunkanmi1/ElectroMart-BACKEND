import express from 'express';
import { 
    showCurrentUser, updateUserPassword, updateUser, getAllUsers, 
    getSingleUser, saveProduct, getSavedProducts, unsaveProduct, unsaveAllProducts,
} from '../controllers'
import { authorizePermissions } from '../middlewares'

const router = express.Router();

router.route('/').get(showCurrentUser).patch(updateUser)
router.route('/update-password').patch(updateUserPassword)
router.route('/all').get(authorizePermissions, getAllUsers);
router.route('/save').post(saveProduct).get(getSavedProducts).delete(unsaveAllProducts)
router.route('/save/:id').delete(unsaveProduct)

router.route('/:id').get(getSingleUser);

export default router