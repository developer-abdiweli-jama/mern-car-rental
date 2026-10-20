import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { validate, validators, rule } from '../middleware/validate.js';

const router = Router();

router.post('/register', validate({
  name: { required: true, rules: [validators.minLength(2), validators.maxLength(100)] },
  email: { required: true, rules: [validators.email] },
  password: { required: true, rules: [rule(validators.minLength(8), 'Password must be at least 8 characters')] },
}), asyncHandler(register));
router.post('/login', validate({
  email: { required: true, rules: [validators.email] },
  password: { required: true },
}), asyncHandler(login));
router.post('/logout', logout);
router.get('/me', asyncHandler(authenticate), asyncHandler(me));

export default router;
