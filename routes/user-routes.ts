import express from 'express';
import { showCurrentUser, updateUserPassword, updateUser, getAllUsers, getSingleUser } from '../controllers'
import { authorizePermissions } from '../middlewares'

const router = express.Router();

router.route('/').get(showCurrentUser).patch(updateUser)
router.route('/update-password').patch(updateUserPassword)
router.route('/all').get(authorizePermissions, getAllUsers);
router.route('/:id').get(getSingleUser);

export default router