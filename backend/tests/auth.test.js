import { app } from '../src/server.js';
import request from 'supertest';
import { setupDB, teardownDB } from './helpers.js';
import { User } from '../src/models/User.js';

const base = '/api/auth';

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  it('registers a new customer', async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('alice@example.com');
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    await request(app).post(`${base}/register`).send({ name: 'Ab', email: 'dup@example.com', password: 'password123' });
    const res = await request(app)
      .post(`${base}/register`)
      .send({ name: 'B', email: 'dup@example.com', password: 'password123' });
    expect(res.status).toBe(400);
  });

  it('logs in and sets session cookie', async () => {
    await request(app).post(`${base}/register`).send({ name: 'Bob', email: 'bob@example.com', password: 'password123' });
    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: 'bob@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.body.data.user.email).toBe('bob@example.com');
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: 'bob@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns current user from session cookie', async () => {
    const agent = request.agent(app);
    await agent.post(`${base}/register`).send({ name: 'Carol', email: 'carol@example.com', password: 'password123' });
    const me = await agent.get(`${base}/me`);
    expect(me.status).toBe(200);
    expect(me.body.data.user.email).toBe('carol@example.com');
  });

  it('clears session on logout', async () => {
    const agent = request.agent(app);
    await agent.post(`${base}/register`).send({ name: 'Dan', email: 'dan@example.com', password: 'password123' });
    await agent.post(`${base}/logout`);
    const me = await agent.get(`${base}/me`);
    expect(me.status).toBe(401);
  });
});
