import express from 'express';

import { createClass,
    getClasses,
    getClassById,
    deleteClassById
 } from '../controllers/classController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';



const router = express.Router();

router.post('/', createClass);
router.get('/', getClasses);
router.get('/:id', getClassById);
router.delete('/:id', deleteClassById);

export default router;