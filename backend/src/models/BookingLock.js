import mongoose from 'mongoose';

const bookingLockSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true },
    lockedAt: { type: Date },
    expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
    heldBy: { type: String },
  },
  { timestamps: true }
);

export const BookingLock = mongoose.model('BookingLock', bookingLockSchema);
