import { AppError } from '../middleware/errorHandler.js';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const cookieOptions = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: process.env.COOKIE_SAME_SITE || 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    return next(AppError('Email already registered', 400));
  }

  user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role && ['customer', 'owner', 'admin'].includes(role) ? role : 'customer',
  });

  generateToken(user._id, res);

  return res.status(201).json({ success: true, data: { user } });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return next(AppError('Invalid email or password', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(AppError('Invalid email or password', 401));
  }

  generateToken(user._id, res);

  return res.json({ success: true, data: { user } });
};

export const logout = (req, res) => {
  res.clearCookie('token', { path: '/' });
  return res.json({ success: true, message: 'Logged out' });
};

export const me = async (req, res) => {
  return res.json({ success: true, data: { user: req.user } });
};
