import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  property: Schema.Types.ObjectId;
  category: string;
  amount: number;
  date: Date;
  description: string;
  vendor: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vendor: {
    type: String,
    required: true
  },
  receipt: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);