import { app } from '../src/server.js';
import request from 'supertest';
import { setupDB, teardownDB } from './helpers.js';
import { User } from '../src/models/User.js';
import { Car } from '../src/models/Car.js';
import { Booking } from '../src/models/Booking.js';

let ownerAgent, customerAgent, carId;

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
afterEach(async () => {
  await User.deleteMany({});
  await Car.deleteMany({});
  await Booking.deleteMany({});
});

const loginAs = async (role) => {
  const email = `${role}-${Date.now()}@example.com`;
  const agent = request.agent(app);
  await agent.post('/api/auth/register').send({ name: role, email, password: 'password123', role });
  return agent;
};

const createCar = async (agent, overrides = {}) => {
  const res = await agent.post('/api/cars').send({
    brand: 'BMW',
    model: 'X5',
    year: 2022,
    category: 'SUV',
    seating_capacity: 5,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    pricePerDay: 300,
    location: 'New York',
    ...overrides,
  });
  return res.body.data.car._id;
};

describe('Bookings API', () => {
  beforeEach(async () => {
    ownerAgent = await loginAs('owner');
    customerAgent = await loginAs('customer');
    carId = await createCar(ownerAgent);
  });

  it('customer creates a booking with server-computed price', async () => {
    const res = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    expect(res.status).toBe(201);
    expect(res.body.data.booking.days).toBe(2);
    expect(res.body.data.booking.pricePerDay).toBe(300);
    expect(res.body.data.booking.totalPrice).toBe(600);
    expect(res.body.data.booking.status).toBe('pending');
    expect(res.body.data.booking.owner).toBeDefined();
  });

  it('rejects booking for unavailable car', async () => {
    await ownerAgent.put(`/api/cars/${carId}`).send({ isAvailable: false });
    const res = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    expect(res.status).toBe(400);
  });

  it('prevents overlapping bookings (409)', async () => {
    await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const res = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-02', returnDate: '2026-11-04' });
    expect(res.status).toBe(409);
  });

  it('allows non-overlapping booking after a confirmed one', async () => {
    await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const res = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-05', returnDate: '2026-11-07' });
    expect(res.status).toBe(201);
  });

  it('rejects past pickup date', async () => {
    const res = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2020-01-01', returnDate: '2020-01-02' });
    expect(res.status).toBe(400);
  });

  it('rejects return date not after pickup', async () => {
    const res = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-03', returnDate: '2026-11-01' });
    expect(res.status).toBe(400);
  });

  it('lists my bookings with pagination', async () => {
    await customerAgent.post('/api/bookings').send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    await customerAgent.post('/api/bookings').send({ carId, pickupDate: '2026-11-05', returnDate: '2026-11-07' });
    const res = await customerAgent.get('/api/bookings/me?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.bookings.length).toBe(2);
    expect(res.body.data.total).toBe(2);
  });

  it('customer cannot view another customer booking', async () => {
    const mine = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const id = mine.body.data.booking._id;
    const other = await loginAs('customer');
    const res = await other.get(`/api/bookings/${id}`);
    expect(res.status).toBe(403);
  });

  it('owner can view bookings for their car', async () => {
    await customerAgent.post('/api/bookings').send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const res = await ownerAgent.get('/api/bookings/owner');
    expect(res.status).toBe(200);
    expect(res.body.data.bookings.length).toBe(1);
  });

  it('customer can cancel their pending booking', async () => {
    const mine = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const id = mine.body.data.booking._id;
    const res = await customerAgent.put(`/api/bookings/${id}/cancel`);
    expect(res.status).toBe(200);
    expect(res.body.data.booking.status).toBe('cancelled');
  });

  it('owner can confirm a pending booking', async () => {
    const mine = await customerAgent
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const id = mine.body.data.booking._id;
    const res = await ownerAgent.put(`/api/bookings/${id}/status`).send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.data.booking.status).toBe('confirmed');
  });

  it('rejects invalid status transition', async () => {
    await customerAgent.post('/api/bookings').send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const id = (await Booking.findOne({ car: carId }))._id;
    await ownerAgent.put(`/api/bookings/${id}/status`).send({ status: 'completed' });
    const res = await ownerAgent.put(`/api/bookings/${id}/status`).send({ status: 'pending' });
    expect(res.status).toBe(400);
  });

  it('availability endpoint returns false for overlapping dates', async () => {
    await customerAgent.post('/api/bookings').send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    const res = await request(app).get('/api/bookings/availability').query({ carId, pickupDate: '2026-11-02', returnDate: '2026-11-04' });
    expect(res.body.data.available).toBe(false);
  });

  it('unauthenticated booking creation is rejected', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ carId, pickupDate: '2026-11-01', returnDate: '2026-11-03' });
    expect(res.status).toBe(401);
  });
});
