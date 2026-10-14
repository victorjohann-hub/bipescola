import express from 'express';

import { createClass,
    getClasses,
    getClassById,
    deleteClassById
 } from '../controllers/classController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, roleMiddleware("ADM"), createClass);
router.get('/', authMiddleware, roleMiddleware("ADM"), getClasses);
router.get('/:id', authMiddleware, roleMiddleware("ADM"), getClassById);
router.delete('/:id', authMiddleware, roleMiddleware("ADM"), deleteClassById);

export default router;