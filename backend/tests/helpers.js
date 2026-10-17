import { connectDB } from '../src/config/db.js';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { Car } from '../src/models/Car.js';
import { Booking } from '../src/models/Booking.js';
import { BookingLock } from '../src/models/BookingLock.js';

const MODELS = [User, Car, Booking, BookingLock];

export const setupDB = async () => {
  process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/car_rental_test';
  await connectDB();
};

export const teardownDB = async () => {
  for (const model of MODELS) {
    await model.deleteMany({});
  }
  await mongoose.connection.close();
};
