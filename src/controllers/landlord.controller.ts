
import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { Expense } from '../models/Expense';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ landlord: req.user._id })
      .populate('manager', 'name email phone');
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create({
      ...req.body,
      landlord: req.user._id
    });
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getManagers = async (req: Request, res: Response) => {
  try {
    const managers = await User.find({ role: 'manager' })
      .select('-password');
    res.json(managers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const assignManager = async (req: Request, res: Response) => {
  try {
    const { propertyId, managerId } = req.body;
    const property = await Property.findOneAndUpdate(
      { _id: propertyId, landlord: req.user._id },
      { manager: managerId },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({
      property: { $in: await Property.find({ landlord: req.user._id }).select('_id') }
    })
      .populate('tenant', 'name email')
      .populate('property', 'name');
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({
      property: { $in: await Property.find({ landlord: req.user._id }).select('_id') }
    })
      .populate('property', 'name')
      .populate('createdBy', 'name');
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        property: { $in: await Property.find({ landlord: req.user._id }).select('_id') }
      },
      {
        status: 'approved',
        approvedBy: req.user._id
      },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
