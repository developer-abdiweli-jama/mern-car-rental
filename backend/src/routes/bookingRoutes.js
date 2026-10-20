import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getOwnerBookings,
  checkAvailability,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validators, rule } from '../middleware/validate.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.get('/availability', validate({
  carId: { source: 'query', required: true, rules: [rule(validators.objectId, 'Invalid vehicle id')] },
  pickupDate: { source: 'query', required: true, rules: [rule(validators.dateISO, 'Invalid pickup date')] },
  returnDate: { source: 'query', required: true, rules: [rule(validators.dateISO, 'Invalid return date')] },
}), asyncHandler(checkAvailability));

router.use(asyncHandler(authenticate));

router.post(
  '/',
  validate({
    carId: { required: true, rules: [rule(validators.objectId, 'Invalid vehicle id')] },
    pickupDate: { required: true, rules: [rule(validators.dateISO, 'Invalid pickup date')] },
    returnDate: { required: true, rules: [rule(validators.dateISO, 'Invalid return date')] },
  }),
  asyncHandler(createBooking)
);

router.get('/me', asyncHandler(getMyBookings));
router.get('/owner', authorize('owner', 'admin'), asyncHandler(getOwnerBookings));
router.get('/:id', validate({
  id: { source: 'params', required: true, rules: [rule(validators.objectId, 'Invalid booking id')] },
}), asyncHandler(getBookingById));
router.put('/:id/cancel', validate({
  id: { source: 'params', required: true, rules: [rule(validators.objectId, 'Invalid booking id')] },
}), asyncHandler(cancelBooking));
router.put('/:id/status', validate({
  id: { source: 'params', required: true, rules: [rule(validators.objectId, 'Invalid booking id')] },
}), authorize('owner', 'admin'), asyncHandler(updateBookingStatus));

export default router;
