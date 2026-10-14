import express from 'express';

import { 
    createClass,
    getClasses,
    getClassById,
    updateClassById,
    deleteClassById
} from '../controllers/classController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware("ADM"), createClass);
router.get('/', authMiddleware, roleMiddleware("ADM", "PROF", "PORTEIRO"), getClasses);
router.get('/:id', authMiddleware, roleMiddleware("ADM", "PROF", "PORTEIRO"), getClassById);
router.put('/:id', authMiddleware, roleMiddleware("ADM"), updateClassById);
router.delete('/:id', authMiddleware, roleMiddleware("ADM"), deleteClassById);

export default router;