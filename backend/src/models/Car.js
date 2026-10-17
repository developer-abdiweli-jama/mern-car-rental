import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxlength: 100,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      maxlength: 100,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe'],
      index: true,
    },
    seating_capacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: 1,
      max: 20,
    },
    fuel_type: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Gas', 'Petrol', 'Diesel', 'Electric', 'Hybrid'],
    },
    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
      enum: ['Automatic', 'Manual', 'Semi-Automatic'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Daily price is required'],
      min: [0, 'Price must be positive'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

carSchema.index({ owner: 1, isAvailable: 1 });
carSchema.index({ location: 1, category: 1, isAvailable: 1 });

export const Car = mongoose.model('Car', carSchema);
