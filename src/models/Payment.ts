import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  tenant: Schema.Types.ObjectId;
  property: Schema.Types.ObjectId;
  unit: string;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);