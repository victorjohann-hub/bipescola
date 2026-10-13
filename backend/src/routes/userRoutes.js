import express from 'express';

import {
  createUser,
  loginUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateUserPhoto
} from '../controllers/userController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.put('/change-password', authMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/:id/photo', authMiddleware, updateUserPhoto);
router.post('/', createUser);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ADM'),
  deleteUser
);

export default router;



