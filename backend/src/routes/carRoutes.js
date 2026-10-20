import { Router } from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validate, validators, rule } from '../middleware/validate.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getCars));
router.get('/:id', validate({
  id: { source: 'params', required: true, rules: [rule(validators.objectId, 'Invalid vehicle id')] },
}), asyncHandler(getCarById));

router.use(asyncHandler(authenticate));

router.post(
  '/',
  authorize('owner', 'admin'),
  upload.single('image'),
  validate({
    brand: { required: true, rules: [validators.required], message: 'Brand is required' },
    model: { required: true, rules: [validators.required], message: 'Model is required' },
    year: { required: true, rules: [validators.required, rule(validators.min(1900), 'Year must be valid')] },
    category: { required: true, rules: [validators.required, rule(validators.in(['SUV','Sedan','Hatchback','Convertible','Coupe']), 'Invalid category')] },
    seating_capacity: { required: true, rules: [validators.required, rule(validators.positiveInteger, 'Invalid seating capacity')] },
    fuel_type: { required: true, rules: [validators.required, rule(validators.in(['Gas','Petrol','Diesel','Electric','Hybrid']), 'Invalid fuel type')] },
    transmission: { required: true, rules: [validators.required, rule(validators.in(['Automatic','Manual','Semi-Automatic']), 'Invalid transmission')] },
    pricePerDay: { required: true, rules: [validators.required, rule(validators.min(0), 'Price must be positive')] },
    location: { required: true, rules: [validators.required], message: 'Location is required' },
    description: { rules: [rule(validators.maxLength(2000), 'Description too long')] },
    image: { optional: true, rules: [
      rule(validators.maxLength(2048), 'Image URL is too long'),
      rule((value) => {
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, 'Image must be a valid HTTP or HTTPS URL'),
    ] },
  }),
  asyncHandler(createCar)
);

router.put(
  '/:id',
  authorize('owner', 'admin'),
  validate({ id: { source: 'params', required: true, rules: [rule(validators.objectId, 'Invalid vehicle id')] } }),
  asyncHandler(updateCar)
);

router.delete(
  '/:id',
  authorize('owner', 'admin'),
  validate({ id: { source: 'params', required: true, rules: [rule(validators.objectId, 'Invalid vehicle id')] } }),
  asyncHandler(deleteCar)
);

export default router;
