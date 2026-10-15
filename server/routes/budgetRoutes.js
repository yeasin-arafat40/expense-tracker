// server/routes/budgetRoutes.js
import express from 'express';
import { getBudget, upsertBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', upsertBudget);
router.get('/:month', getBudget);

export default router;