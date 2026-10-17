import { AppError } from '../middleware/errorHandler.js';
import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';
import { BookingLock } from '../models/BookingLock.js';

const ACTIVE_STATUSES = ['pending', 'confirmed'];
const LOCK_TTL_MS = 30 * 1000;

const computeDays = (pickupDate, returnDate) => {
  const start = new Date(pickupDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(returnDate);
  end.setUTCHours(0, 0, 0, 0);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return days < 1 ? 1 : days;
};

const now = () => new Date();

/**
 * Acquire a short-lived per-car booking lock atomically. Only one request can
 * hold the lock for a given car at a time, which serializes the check-then-act
 * and prevents overlapping bookings under concurrent requests on standalone
 * MongoDB (no transactions).
 */
const acquireLock = async (carId, userId) => {
  const deadline = new Date(Date.now() + LOCK_TTL_MS);
  const lock = await BookingLock.findOneAndUpdate(
    {
      carId,
      $or: [{ expiresAt: { $lt: now() } }, { lockedAt: null }],
    },
    {
      $set: { lockedAt: now(), expiresAt: deadline, heldBy: userId },
      $setOnInsert: { carId },
    },
    { upsert: true, new: true }
  );
  return lock ? String(lock._id) : null;
};

const releaseLock = async (lockId) => {
  if (!lockId) return;
  try {
    await BookingLock.deleteOne({ _id: lockId });
  } catch {
    // best effort
  }
};

/**
 * Create a booking concurrency-safely.
 *
 * Flow:
 * 1. Validate input dates and that the car exists and is available.
 * 2. Atomically acquire a per-car lock (findOneAndUpdate upsert).
 * 3. Re-verify availability inside the lock, then reject any overlapping
 *    active booking for the same car/date range.
 * 4. Compute the total price server-side from the car's current pricePerDay.
 * 5. Insert the booking and release the lock.
 *
 * Contention on the lock is retried with backoff.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.carId
 * @param {string|Date} params.pickupDate
 * @param {string|Date} params.returnDate
 * @returns {Promise<import('mongoose').Document>}
 */
const createBooking = async ({ userId, carId, pickupDate, returnDate }) => {
  let car;
  try {
    car = await Car.findById(carId).lean();
  } catch {
    throw AppError('Invalid vehicle id', 400);
  }
  if (!car) throw AppError('Vehicle not found', 404);
  if (!car.isAvailable) throw AppError('Vehicle is not available for rent', 400);

  const start = new Date(pickupDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(returnDate);
  end.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (start < today) throw AppError('Pickup date must be today or in the future', 400);
  if (end <= start) throw AppError('Return date must be after the pickup date', 400);

  let lockId;
  let lastError;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    lockId = await acquireLock(carId, userId);
    if (lockId) break;
    lastError = AppError('Vehicle is being booked by another request, please retry', 409);
    await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
  }

  if (!lockId) throw lastError;

  try {
    // Re-verify car still available (could have been disabled while waiting).
    const fresh = await Car.findById(carId);
    if (!fresh || !fresh.isAvailable) {
      throw AppError('Vehicle is not available for rent', 400);
    }

    const overlapping = await Booking.findOne(
      {
        car: carId,
        status: { $in: ACTIVE_STATUSES },
        pickupDate: { $lt: end },
        returnDate: { $gt: start },
      }
    );
    if (overlapping) {
      throw AppError('Vehicle is already booked for the selected dates', 409);
    }

    const days = computeDays(start, end);
    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      user: userId,
      car: carId,
      owner: car.owner,
      pickupDate: start,
      returnDate: end,
      days,
      pricePerDay: car.pricePerDay,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
    });

    return booking;
  } finally {
    await releaseLock(lockId);
  }
};

const getOverlappingBookings = async (carId, pickupDate, returnDate, excludeId) => {
  const start = new Date(pickupDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(returnDate);
  end.setUTCHours(0, 0, 0, 0);

  const query = {
    car: carId,
    status: { $in: ACTIVE_STATUSES },
    pickupDate: { $lt: end },
    returnDate: { $gt: start },
  };
  if (excludeId) query._id = { $ne: excludeId };

  return Booking.find(query);
};

export { createBooking, getOverlappingBookings, computeDays, ACTIVE_STATUSES };
