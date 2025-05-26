import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  landlord: Schema.Types.ObjectId;
  manager?: Schema.Types.ObjectId;
  units: Array<{
    number: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    rentAmount: number;
    status: 'vacant' | 'occupied' | 'maintenance';
    currentTenant?: Schema.Types.ObjectId;
  }>;
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  landlord: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  units: [{
    number: { type: String, required: true },
    type: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rentAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['vacant', 'occupied', 'maintenance'],
      default: 'vacant'
    },
    currentTenant: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  amenities: [String],
  images: [String]
}, {
  timestamps: true
});

export const Property = mongoose.model<IProperty>('Property', propertySchema);