import express from 'express';

import { createClass } from '../controllers/classController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', createClass);

export default router;