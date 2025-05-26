
import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getManagedProperties,
  uploadPayment,
  addExpense,
  getPropertyPayments,
  getPropertyExpenses,
  updatePropertyUnit
} from '../controllers/manager.controller';

const router = express.Router();

router.use(protect, authorize('manager'));

router.get('/properties', getManagedProperties);

router.route('/payments')
  .get(getPropertyPayments)
  .post(uploadPayment);

router.route('/expenses')
  .get(getPropertyExpenses)
  .post(addExpense);

router.put('/units', updatePropertyUnit);

export default router;
