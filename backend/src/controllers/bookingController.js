import { AppError } from '../middleware/errorHandler.js';
import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';
import { createBooking as svcCreateBooking, getOverlappingBookings } from '../services/bookingService.js';

export const createBooking = async (req, res, next) => {
  const { carId, pickupDate, returnDate } = req.body;
  const userId = req.user._id;

  let car;
  try {
    car = await Car.findById(carId);
  } catch {
    return next(AppError('Invalid vehicle id', 400));
  }
  if (!car) return next(AppError('Vehicle not found', 404));
  if (!car.isAvailable) return next(AppError('Vehicle is not available for rent', 400));

  try {
    const booking = await svcCreateBooking({ userId, carId, pickupDate, returnDate });
    return res.status(201).json({ success: true, data: { booking } });
  } catch (err) {
    return next(err);
  }
};

export const getMyBookings = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const query = { user: req.user._id };
  if (req.query.status) query.status = req.query.status;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('car', 'brand model image category year location pricePerDay isAvailable')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: { bookings, page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getBookingById = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('car', 'brand model image category year location pricePerDay isAvailable')
    .populate('owner', 'name email');
  if (!booking) return next(AppError('Booking not found', 404));

  const isOwnerOrAdmin =
    req.user.role === 'admin' ||
    booking.owner._id.toString() === req.user._id.toString();
  const isUser = booking.user._id.toString() === req.user._id.toString();

  if (!isUser && !isOwnerOrAdmin) {
    return next(AppError('Not authorized to view this booking', 403));
  }

  return res.json({ success: true, data: { booking } });
};

export const cancelBooking = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(AppError('Booking not found', 404));

  const isOwnerOrAdmin =
    req.user.role === 'admin' ||
    booking.owner.toString() === req.user._id.toString();
  const isUser = booking.user.toString() === req.user._id.toString();

  if (!isUser && !isOwnerOrAdmin) {
    return next(AppError('Not authorized to cancel this booking', 403));
  }

  if (!['pending', 'confirmed'].includes(booking.status)) {
    return next(AppError(`Cannot cancel a ${booking.status} booking`, 400));
  }

  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();

  return res.json({ success: true, data: { booking } });
};

export const updateBookingStatus = async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return next(AppError('Not authorized to change booking status', 403));
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(AppError('Booking not found', 404));

  if (req.user.role === 'owner' && booking.owner.toString() !== req.user._id.toString()) {
    return next(AppError('Not authorized to change this booking', 403));
  }

  const { status } = req.body;
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return next(AppError('Invalid status', 400));
  }

  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  if (!validTransitions[booking.status].includes(status)) {
    return next(AppError(`Cannot transition from ${booking.status} to ${status}`, 400));
  }

  booking.status = status;
  await booking.save();

  return res.json({ success: true, data: { booking } });
};

export const getOwnerBookings = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const query = { owner: req.user._id };
  if (req.query.status) query.status = req.query.status;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('user', 'name email')
      .populate('car', 'brand model image category year location pricePerDay')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: { bookings, page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const checkAvailability = async (req, res, next) => {
  const { carId, pickupDate, returnDate } = req.query;
  if (!carId || !pickupDate || !returnDate) {
    return next(AppError('carId, pickupDate and returnDate are required', 400));
  }

  const overlapping = await getOverlappingBookings(carId, pickupDate, returnDate);
  const car = await Car.findById(carId).lean();
  const available = !!(car && car.isAvailable && overlapping.length === 0);

  return res.json({ success: true, data: { available } });
};
