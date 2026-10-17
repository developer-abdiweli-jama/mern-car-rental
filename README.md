# 🚗 MERN Car Rental Platform

A complete, production-ready full-stack car rental platform built with the MERN stack (MongoDB, Express, React, Node.js). Features vehicle browsing and search, real-time availability, server-side rental pricing, concurrency-safe booking, JWT authentication, role-based access (customer / owner / admin), and an owner dashboard for fleet and booking management.

## 📁 Project Structure

```
mern-car-rental/
├── backend/                # Express.js API (Node.js + MongoDB + Mongoose)
│   ├── src/
│   │   ├── config/         # DB connection, logger, multer upload config
│   │   ├── controllers/    # auth, car, booking controllers
│   │   ├── middleware/     # auth, validation, async handler, error handler
│   │   ├── models/         # User, Car, Booking, BookingLock (Mongoose)
│   │   ├── routes/         # authRoutes, carRoutes, bookingRoutes
│   │   ├── services/       # bookingService (concurrency-safe booking)
│   │   ├── server.js       # Express app entry point
│   │   └── public/uploads/ # uploaded vehicle images (served statically)
│   ├── tests/              # Jest + Supertest API tests
│   ├── .env.example        # backend environment variables (placeholders)
│   ├── package.json
│   └── eslint.config.js
├── client/                 # React 19 + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/axios.js    # Axios instance (withCredentials, baseURL)
│   │   ├── context/        # AuthProvider, useAuth (JWT session via httpOnly cookie)
│   │   ├── components/     # shared UI (Navbar, CarCard, Loader, owner UI)
│   │   ├── pages/          # Home, Cars, CarDetails, MyBookings, Login, Register, owner/*
│   │   ├── utils/imageUrl.js
│   │   ├── test/           # vitest setup
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env                # frontend environment variables (placeholders)
│   ├── vitest.config.js
│   ├── package.json
│   └── ...
├── README.md
└── LICENSE
```

## 🎯 Features

### Customer experience
- Landing page with location/date search and featured vehicles
- Vehicle browsing with search, category, and price filtering (paginated)
- Vehicle details with server-computed rental total and availability check
- Booking flow with server-side price calculation and date validation
- Booking history ("My Bookings") with status and cancellation
- Registration / login / logout (JWT session in an httpOnly cookie)

### Owner / admin experience
- Owner dashboard (cars, bookings, pending/confirmed counts, monthly revenue)
- Add a vehicle (with image upload)
- Manage cars (list, availability, delete)
- Manage bookings (confirm / complete / cancel)
- Role-protected routes (owner/admin only)

### Booking integrity (server-enforced)
- Rejects past pickup dates and return dates not after pickup
- Prevents overlapping active (pending/confirmed) bookings for the same vehicle
- Per-car atomic booking lock to serialize concurrent booking attempts
- Rental price recalculated server-side from the vehicle's current `pricePerDay`
- Validated booking status transitions (pending → confirmed/completed/cancelled)

### Security
- JWT access token in httpOnly cookie (secure/sameSite in production)
- bcrypt password hashing (salt 12)
- Role-based authorization (customer / owner / admin)
- CORS with credentials, configurable allowed origin
- Rate limiting on `/api`
- Helmet security headers, express-mongo-sanitize (NoSQL injection protection)
- Request body size limits (1 MB)
- Centralized error handler (no stack traces leaked in production)
- Input validation on all mutating endpoints

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT (httpOnly cookie), bcrypt |
| File upload | Multer (local disk, served statically) |
| Testing | Backend: Jest + Supertest; Frontend: Vitest + React Testing Library |
| Lint | ESLint (flat config) |

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 20
- MongoDB (local or remote). A local `mongod` is assumed for development.

### 1. Clone and install

```bash
# Frontend
cd client
npm install

# Backend
cd ../backend
npm install
```

### 2. Environment variables

Copy the example files and fill in values (placeholders only — do not commit real secrets).

```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd ../client
cp .env.example .env   # if present; client/.env already contains defaults
```

**`backend/.env`**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/car_rental
TEST_MONGO_URI=mongodb://127.0.0.1:27017/car_rental_test

JWT_SECRET=replace_this_with_a_strong_random_secret   # e.g. openssl rand -base64 64
JWT_EXPIRES_IN=7d

COOKIE_SECURE=false        # 'true' behind HTTPS in production
COOKIE_SAME_SITE=Lax
CORS_ORIGIN=http://localhost:5173
```

**`client/.env`**
```
VITE_CURRENCY=$
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
mongod --dbpath /path/to/data/db --port 27017
```

### 4. Run the app

Backend (terminal 1):
```bash
cd backend
npm run dev      # http://localhost:5000
```

Frontend (terminal 2):
```bash
cd client
npm run dev      # http://localhost:5173
```

## 🧪 Testing

### Backend (Jest + Supertest)
```bash
cd backend
npm test
```
Runs 27 tests covering auth, cars, bookings, overlap prevention, price calculation, authorization, and status transitions against a throwaway test database (`car_rental_test`).

### Frontend (Vitest)
```bash
cd client
npm test
```

### Lint
```bash
cd backend  && npm run lint
cd client   && npm run lint
```

### Production builds
```bash
cd backend && npm start   # builds nothing; runs src/server.js
cd client  && npm run build   # outputs to client/dist
```

## 📚 API Endpoints

Base: `http://localhost:5000/api` (all mutating endpoints require a session cookie unless noted).

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | none | Health check |
| POST | `/auth/register` | none | Register customer/owner |
| POST | `/auth/login` | none | Login (sets httpOnly cookie) |
| POST | `/auth/logout` | cookie | Logout |
| GET | `/auth/me` | cookie | Current user |
| GET | `/cars` | none | List cars (page, limit, category, location, minPrice, maxPrice, search, sort) |
| GET | `/cars/:id` | none | Vehicle detail |
| POST | `/cars` | owner/admin | Create vehicle (multipart image) |
| PUT | `/cars/:id` | owner/admin | Update vehicle |
| DELETE | `/cars/:id` | owner/admin | Delete vehicle |
| POST | `/bookings` | cookie | Create booking (concurrency-safe) |
| GET | `/bookings/me` | cookie | My bookings |
| GET | `/bookings/owner` | owner/admin | Owner's bookings |
| GET | `/bookings/availability` | none | Check availability for dates |
| GET | `/bookings/:id` | cookie | Booking detail (user/owner/admin) |
| PUT | `/bookings/:id/cancel` | cookie | Cancel booking (user/owner/admin) |
| PUT | `/bookings/:id/status` | owner/admin | Change booking status |

## 🔐 Authentication & Authorization

- Sessions use a JWT access token stored in an **httpOnly cookie** (`token`), so the token is not accessible to client-side JavaScript (XSS protection).
- `COOKIE_SECURE` must be `true` behind HTTPS; `COOKIE_SAME_SITE` defaults to `Lax`.
- Roles: `customer` (default), `owner`, `admin`.
- Customers can only view/cancel their own bookings. Owners/admins manage their vehicles and bookings. Admins can modify any vehicle/booking.

## 🗓 Booking & Availability Rules

- Pickup date must be today or later; return date must be after pickup.
- Rental duration is computed in whole days (inclusive of pickup day).
- Total price = `days × pricePerDay`, calculated server-side from the vehicle's current price (never trusted from the client).
- Overlapping active bookings (`pending`/`confirmed`) for the same vehicle are rejected with `409`.
- A per-car atomic lock serializes concurrent booking attempts.
- Status transitions: `pending → {confirmed, cancelled}`, `confirmed → {completed, cancelled}`. `completed`/`cancelled` are terminal.

## 🚀 Deployment

Build the frontend (`npm run build` in `client/`) and serve `client/dist` with a static host (Vercel, Netlify, etc.), setting `VITE_API_URL` to the production backend origin.

Run the backend (`npm start` in `backend/`) on a Node host (Render, Railway, fly.io, or a VPS) with a production MongoDB (MongoDB Atlas or self-managed). Set `NODE_ENV=production`, `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=None`, and restrict `CORS_ORIGIN` to your frontend domain.

No Redis, message queues, or Kubernetes are required; the modular monolith scales by adding database indexes and horizontal pod replicas behind a load balancer as traffic grows.

## 🧭 Known Limitations & Remaining Work

- Payments (Stripe) are not integrated; `paymentStatus` is tracked but no provider webhook is wired. This is intentionally documented rather than simulated.
- Email/SMS notifications, reviews/ratings, Google Maps, PWA, and multi-language support are out of scope for this release.
- Image uploads are stored on local disk; for multi-node deployment, move to object storage (S3/ImageKit) and serve via CDN.
- Rate limit and CORS values should be tuned for production traffic.

## 📄 License

MIT