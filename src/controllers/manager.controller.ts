
import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { Payment } from '../models/Payment';
import { Expense } from '../models/Expense';

export const getManagedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ manager: req.user._id })
      .populate('landlord', 'name email phone');
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadPayment = async (req: Request, res: Response) => {
  try {
    const { propertyId, ...paymentData } = req.body;
    
    // Verify manager manages this property
    const property = await Property.findOne({
      _id: propertyId,
      manager: req.user._id
    });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found or not authorized' });
    }

    const payment = await Payment.create({
      ...paymentData,
      property: propertyId
    });

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const { propertyId, ...expenseData } = req.body;
    
    // Verify manager manages this property
    const property = await Property.findOne({
      _id: propertyId,
      manager: req.user._id
    });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found or not authorized' });
    }

    const expense = await Expense.create({
      ...expenseData,
      property: propertyId,
      createdBy: req.user._id
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({
      property: { $in: await Property.find({ manager: req.user._id }).select('_id') }
    })
      .populate('tenant', 'name email')
      .populate('property', 'name');
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({
      property: { $in: await Property.find({ manager: req.user._id }).select('_id') }
    })
      .populate('property', 'name')
      .populate('approvedBy', 'name');
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePropertyUnit = async (req: Request, res: Response) => {
  try {
    const { propertyId, unitNumber, updates } = req.body;
    
    const property = await Property.findOneAndUpdate(
      {
        _id: propertyId,
        manager: req.user._id,
        'units.number': unitNumber
      },
      {
        $set: {
          'units.$.status': updates.status,
          'units.$.currentTenant': updates.currentTenant
        }
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property or unit not found' });
    }

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
