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

const router = Router();

router.get('/availability', checkAvailability);

router.use(authenticate);

router.post(
  '/',
  validate({
    carId: { required: true, rules: [rule(validators.objectId, 'Invalid vehicle id')] },
    pickupDate: { required: true, rules: [rule(validators.dateISO, 'Invalid pickup date')] },
    returnDate: { required: true, rules: [rule(validators.dateISO, 'Invalid return date')] },
  }),
  createBooking
);

router.get('/me', getMyBookings);
router.get('/owner', authorize('owner', 'admin'), getOwnerBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/status', authorize('owner', 'admin'), updateBookingStatus);

export default router;
