
import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getProperties,
  addProperty,
  getManagers,
  assignManager,
  getPayments,
  getExpenses,
  approveExpense
} from '../controllers/landlord.controller';

const router = express.Router();

router.use(protect, authorize('landlord'));

router.route('/properties')
  .get(getProperties)
  .post(addProperty);

router.get('/managers', getManagers);
router.post('/assign-manager', assignManager);

router.get('/payments', getPayments);

router.route('/expenses')
  .get(getExpenses);

router.put('/expenses/:id/approve', approveExpense);

export default router;
