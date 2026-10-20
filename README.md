# 🚗 Hirgal Car Rental

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
├── client/                 # React 19 + Vite + TypeScript + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/axios.ts      # Axios instance (withCredentials, baseURL)
│   │   ├── context/          # AuthProvider, useAuth (JWT session via httpOnly cookie)
│   │   ├── components/       # shared UI (Navbar, CarCard, Loader, owner UI)
│   │   │   └── ui/           # accessible design-system primitives (Button, Input, Card, Badge, Alert, …)
│   │   ├── pages/            # Home, Cars, CarDetails, MyBookings, Login, Register, owner/*
│   │   ├── types/            # shared TypeScript types (User, Car, Booking, ApiResponse)
│   │   ├── utils/imageUrl.ts
│   │   ├── test/             # vitest setup
│   │   ├── App.tsx
│   │   └── index.css
│   ├── .env                  # frontend environment variables
│   ├── vitest.config.ts
│   ├── tsconfig.json         # strict TypeScript
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
- Customer registration / login / logout (JWT session in an httpOnly cookie)

### Owner / admin experience
- Owner dashboard (cars, bookings, pending/confirmed counts, monthly revenue)
- Add a vehicle (with image upload)
- Manage cars (list, availability, delete)
- Manage bookings (confirm / complete / cancel)
- Role-protected routes (owner/admin only; production signup cannot create privileged accounts)

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
- CORS with credentials and an explicit comma-separated origin allowlist
- Rate limiting on `/api`
- Helmet security headers, express-mongo-sanitize (NoSQL injection protection)
- Request body size limits (1 MB)
- Centralized error handler (no stack traces leaked in production)
- Input validation on all mutating endpoints

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, TypeScript (strict), Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT (httpOnly cookie), bcrypt |
| Car images | Public image URLs; optional Multer uploads with Cloudinary in production |
| Testing | Backend: Jest + Supertest; Frontend: Vitest + React Testing Library |
| Lint | ESLint (flat config) |

## 🔤 Frontend migration: JavaScript → TypeScript

The frontend was migrated from JavaScript to TypeScript while preserving all existing behavior and user data. The migration was done incrementally, keeping the app buildable at every step:

- All React components, pages, hooks, API code, and utilities are now `.ts` / `.tsx`.
- Explicit types were added for API responses, users, roles, vehicles, bookings, filters, and form data (`client/src/types/index.ts`).
- `any` is avoided; external API data is validated at the boundaries (runtime checks + type narrowing).
- Strict TypeScript checking is enabled (`tsconfig.json` `strict: true`) and enforced via `npm run typecheck`.
- ESLint was updated to work with the TypeScript parser (`typescript-eslint`) and flags `any` and unused variables.
- No backend files were migrated to TypeScript; the Express backend remains JavaScript as the requested scope was frontend-only.

Migration notes:
- `client/src/main.tsx` previously imported the deleted `./App.jsx`; it now imports `./App`.
- A new owner-scoped endpoint `GET /api/cars/mine` was added so the owner dashboard lists only that owner's vehicles (previously it listed all cars).
- A new `EditCar` page (`/owner/edit-car/:id`) lets owners update their listings.
- Dummy test fixtures previously living in `client/src/assets/assets.ts` were removed from production code.

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
DEMO_OWNER_EMAIL=owner@example.com
DEMO_OWNER_PASSWORD=change_this_password
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
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

### 5. Add portfolio demo cars

The seed command upserts six sample cars with Unsplash photos and a fleet-owner account. Set `DEMO_OWNER_EMAIL` and `DEMO_OWNER_PASSWORD` in `backend/.env`, then run:

```bash
cd backend
npm run seed
```

The command is safe to rerun: it updates those six listings instead of duplicating them. The sample photos are hotlinked from Unsplash; use real listing photos and review image rights before presenting this as a commercial fleet.

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

### Lint & TypeScript
```bash
cd backend  && npm run lint
cd client   && npm run lint
cd client   && npm run typecheck   # strict `tsc --noEmit`
```

### Production builds
```bash
cd backend && npm start   # runs src/server.js
cd client  && npm run build   # typechecks then outputs to client/dist
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
| GET | `/cars/mine` | owner/admin | List the authenticated owner's vehicles |
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
- Local cookies use `SameSite=Lax`; the Vercel + Render deployment uses secure `SameSite=None` cookies because the frontend and API have different origins.
- Roles: `customer` (default), `owner`, `admin`.
- Customers can only view/cancel their own bookings. Owners/admins manage their vehicles and bookings. Admins can modify any vehicle/booking.

## 🗓 Booking & Availability Rules

- Pickup date must be today or later; return date must be after pickup.
- Rental duration is computed in whole days (inclusive of pickup day).
- Total price = `days × pricePerDay`, calculated server-side from the vehicle's current price (never trusted from the client).
- Overlapping active bookings (`pending`/`confirmed`) for the same vehicle are rejected with `409`.
- A per-car atomic lock serializes concurrent booking attempts.
- Status transitions: `pending → {confirmed, cancelled}`, `confirmed → {completed, cancelled}`. `completed`/`cancelled` are terminal.

## 🚀 Deployment: Vercel + Render + MongoDB Atlas

The project uses Mongoose, so MongoDB Atlas is the matching database. Supabase's PostgreSQL is not a drop-in replacement for this backend.

1. Create a MongoDB Atlas database and copy its connection string. Add the Render service from `render.yaml`; set `MONGO_URI` to the Atlas string and `CORS_ORIGIN` to the exact Vercel site origin (for example `https://your-project.vercel.app`, without a trailing slash).
2. Cloudinary is optional when adding cars by image URL. To enable direct file uploads, create a Cloudinary account and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in Render. Render's free filesystem is ephemeral, so local disk is not a safe production upload store.
3. In Vercel, import the repository and set the project root directory to `client`. Set `VITE_API_URL=/api` and `VITE_CURRENCY=$`. The Vercel config proxies API and upload requests through the frontend origin, which avoids browser third-party-cookie restrictions. If Render assigns a different service URL, update both proxy destinations in `client/vercel.json`.
4. After Render is live, seed the production database from a trusted local terminal. Set `MONGO_URI`, `DEMO_OWNER_EMAIL`, and `DEMO_OWNER_PASSWORD` in `backend/.env`, then run `npm run seed` from `backend/`. Keep the owner password private and use the account only for the portfolio demo.
5. Open the Vercel site, confirm `/api/health` is healthy at the Render URL, then sign in with the seeded owner account to review the management pages.

The Render blueprint sets production cookies to `SameSite=None; Secure`. Set `CORS_ORIGIN` to the exact Vercel origin, or list multiple allowed origins separated by commas. Do not add secrets to Vercel; `VITE_*` values are public in the built app.

No Redis, message queues, or Kubernetes are required; the modular monolith scales by adding database indexes and horizontal pod replicas behind a load balancer as traffic grows.

## 🧭 Known Limitations & Remaining Work

- Payments (Stripe) are not integrated; `paymentStatus` is tracked but no provider webhook is wired. This is intentionally documented rather than simulated.
- Email/SMS notifications, reviews/ratings, Google Maps, PWA, and multi-language support are out of scope for this release.
- Local image uploads are stored on disk. Use a public HTTPS image URL for production unless Cloudinary credentials are configured for persistent file uploads.
- Rate limit and CORS values should be tuned for production traffic.

## 📄 License

MIT
