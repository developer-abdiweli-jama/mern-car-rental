import mongoose from 'mongoose';

const bookingStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pickupDate: { type: Date, required: true, index: true },
    returnDate: { type: Date, required: true, index: true },
    days: { type: Number, required: true, min: 1 },
    pricePerDay: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: bookingStatuses,
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatuses,
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent a car from having overlapping active (pending/confirmed) bookings at the
// application level (enforced in the booking service). Index supports the overlap query.
bookingSchema.index({ car: 1, status: 1, pickupDate: 1, returnDate: 1 });
bookingSchema.index({ user: 1, status: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, status: 1, createdAt: -1 });

export const Booking = mongoose.model('Booking', bookingSchema);
