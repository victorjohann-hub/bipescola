import express from 'express';

import {
  createParent,
  listParents,
  updateParent,
  deleteParent
} from '../controllers/parentController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('ADM'), createParent);
router.get('/', authMiddleware, roleMiddleware('ADM', 'PROF'), listParents);
router.put('/:id', authMiddleware, roleMiddleware('ADM'), updateParent);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ADM'),
  deleteParent
);

export default router;
