import { app } from '../src/server.js';
import request from 'supertest';
import { setupDB, teardownDB } from './helpers.js';
import { User } from '../src/models/User.js';
import { Car } from '../src/models/Car.js';

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
afterEach(async () => {
  await User.deleteMany({});
  await Car.deleteMany({});
});

const loginAs = async (role = 'owner') => {
  const email = `${role}-${Date.now()}@example.com`;
  const agent = request.agent(app);
  await agent.post('/api/auth/register').send({ name: role, email, password: 'password123', role });
  return agent;
};

describe('Cars API', () => {
  it('owner can create a car', async () => {
    const agent = await loginAs('owner');
    const res = await agent
      .post('/api/cars')
      .send({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2021,
        category: 'Sedan',
        seating_capacity: 5,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        pricePerDay: 130,
        location: 'Chicago',
        description: 'A nice sedan',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.car.owner).toBeDefined();
  });

  it('customer cannot create a car', async () => {
    const agent = await loginAs('customer');
    const res = await agent.post('/api/cars').send({ brand: 'X', model: 'Y', year: 2020, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission: 'Automatic', pricePerDay: 100, location: 'NY' });
    expect(res.status).toBe(403);
  });

  it('lists cars with pagination and filters', async () => {
    const agent = await loginAs('owner');
    await agent.post('/api/cars').send({ brand: 'Toyota', model: 'Corolla', year: 2021, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission: 'Automatic', pricePerDay: 130, location: 'Chicago' });
    await agent.post('/api/cars').send({ brand: 'BMW', model: 'X5', year: 2022, category: 'SUV', seating_capacity: 5, fuel_type: 'Hybrid', transmission: 'Automatic', pricePerDay: 300, location: 'New York' });

    const res = await request(app).get('/api/cars?category=SUV&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.cars.length).toBe(1);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.pages).toBe(1);
  });

  it('owner can update and delete their own car', async () => {
    const agent = await loginAs('owner');
    const created = await agent.post('/api/cars').send({ brand: 'Toyota', model: 'Corolla', year: 2021, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission: 'Automatic', pricePerDay: 130, location: 'Chicago' });
    const id = created.body.data.car._id;

    const upd = await agent.put(`/api/cars/${id}`).send({ pricePerDay: 150, isAvailable: false });
    expect(upd.status).toBe(200);
    expect(upd.body.data.car.pricePerDay).toBe(150);

    const del = await agent.delete(`/api/cars/${id}`);
    expect(del.status).toBe(200);

    const gone = await Car.findById(id);
    expect(gone).toBeNull();
  });

  it('owner cannot update another owner car', async () => {
    const agentA = await loginAs('owner');
    const created = await agentA.post('/api/cars').send({ brand: 'Toyota', model: 'Corolla', year: 2021, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission: 'Automatic', pricePerDay: 130, location: 'Chicago' });
    const id = created.body.data.car._id;

    const agentB = await loginAs('owner');
    const res = await agentB.put(`/api/cars/${id}`).send({ pricePerDay: 999 });
    expect(res.status).toBe(403);
  });

  it('admin can update any car', async () => {
    const agentA = await loginAs('owner');
    const created = await agentA.post('/api/cars').send({ brand: 'Toyota', model: 'Corolla', year: 2021, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission: 'Automatic', pricePerDay: 130, location: 'Chicago' });
    const id = created.body.data.car._id;

    const agentAdmin = await loginAs('admin');
    const res = await agentAdmin.put(`/api/cars/${id}`).send({ pricePerDay: 999 });
    expect(res.status).toBe(200);
  });

  it('404 for missing car', async () => {
    const res = await request(app).get('/api/cars/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});
