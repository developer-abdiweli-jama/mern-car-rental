export type Role = 'customer' | 'owner' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Car {
  _id: string;
  owner: string | User;
  brand: string;
  model: string;
  year: number;
  category: string;
  seating_capacity: number;
  fuel_type: string;
  transmission: string;
  pricePerDay: number;
  location: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
  createdAt?: string;
}

export interface Booking {
  _id: string;
  user: string | User;
  car: string | Car;
  owner: string | User;
  pickupDate: string;
  returnDate: string;
  days: number;
  pricePerDay: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
