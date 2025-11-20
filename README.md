<p align="center">
  <img src="https://dummyimage.com/1200x400/0f0f0f/ffffff&text=🌑🚗+MERN+Car+Rental+App" alt="MERN Car Rental - Dark Banner" />
</p>

<h1 align="center">🌑🚗 MERN Car Rental App</h1>

<p align="center">
  <strong>A modern, full-stack car rental platform built with the MERN stack</strong>
</p>

<p align="center">
  Beautiful UI • Seamless booking flow • Powerful admin panel • Production-ready architecture
</p>

<p align="center">
  <a href="https://mern-car-rental.vercel.app"><strong>🚀 Live Demo</strong></a> • 
  <a href="#-features">Features</a> • 
  <a href="#-tech-stack">Tech Stack</a> • 
  <a href="#-installation">Install</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&logo=starship&logoColor=yellow&color=1a1a1a&labelColor=0d0d0d" alt="Stars" />
  <img src="https://img.shields.io/github/forks/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&logoColor=yellow&color=1a1a1a&labelColor=0d0d0d" alt="Forks" />
  <img src="https://img.shields.io/github/issues/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&logo=issuereopened&color=1a1a1a&labelColor=0d0d0d" alt="Issues" />
  <img src="https://img.shields.io/github/license/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&color=yellow&labelColor=0d0d0d" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-00ff00?style=for-the-badge" alt="PRs Welcome" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-State-8B5CF6?style=for-the-badge&logo=react-query&logoColor=white" />
</p>

## 📸 Preview

<p align="center">
  <img src="https://dummyimage.com/1600x900/0f172a/ffffff&text=Home+Page+%E2%80%94+Dark+Mode+Coming+Soon" alt="Home Page" width="100%" />
</p>

<p align="center">
  <img src="https://dummyimage.com/1600x900/0f172a/ffffff&text=Car+Details+%26+Booking+Flow" alt="Car Details" width="100%" />
</p>

<p align="center">
  <img src="https://dummyimage.com/1600x900/0f172a/ffffff&text=Admin+Dashboard+%E2%80%94+Manage+Fleet+%26+Bookings" alt="Admin Panel" width="100%" />
</p>

> ⚡ Live screenshots & GIF demo will be updated weekly as features land!

## 🎯 Features

### 👤 Customer Experience
- Browse luxury & economy vehicles with high-res images (powered by ImageKit)
- Filter by category, price, transmission, fuel type
- Real-time date picker with availability calendar
- Secure user authentication (JWT + bcrypt)
- One-click booking with instant confirmation

### 🛠 Admin Dashboard
- Add / Edit / Delete cars
- Manage bookings (approve, cancel, view details)
- Real-time fleet overview
- Protected routes (admin-only)

### 🔜 Coming Soon
- Stripe payment integration
- Email/SMS notifications (Nodemailer + Twilio)
- User dashboard with booking history
- Reviews & ratings system
- Google Maps location picker

## 🛠 Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Frontend    | React 18, Tailwind CSS, Zustand (state), React Router v6, Axios           |
| Backend     | Node.js, Express.js, MongoDB + Mongoose                                    |
| Auth        | JWT, bcryptjs                                                              |
| Image CDN   | ImageKit.io                                                                |
| Deployment  | Vercel (frontend), Render/Railway (backend)                                |
| Tools       | ESLint, Prettier, Concurrently, Nodemon                                    |

## 📁 Project Structure

```bash
mern-car-rental/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages (Home, Cars, Booking, Admin...)
│   │   ├── context/         # Auth & global state
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Helpers & constants
│   └── vite.config.js
│
├── backend/                 # Express API
│   ├── controllers/
│   ├── models/              # Mongoose schemas (User, Car, Booking)
│   ├── routes/
│   ├── middleware/          # auth, errorHandler, etc.
│   ├── config/              # DB connection
│   └── server.js
│
└── README.md
```

## ⚙️ Installation & Setup

```bash
# 1. Clone repository
git clone https://github.com/developer-abdiweli-jama/mern-car-rental.git
cd mern-car-rental

# 2. Backend setup
cd backend
npm install
cp .env.example .env    # then fill your variables

# 3. Frontend setup
cd ../client
npm install
```

### 🔑 Environment Variables (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/car-rental
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# ImageKit (optional but recommended)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

## 🚀 Running the App

Use concurrent mode (recommended):

```bash
# From root directory
npm run dev
```

Or separately:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

Frontend → http://localhost:3000  
Backend API → http://localhost:5000

## 🛤️ Roadmap

| Status     | Feature                        | ETA       |
|------------|--------------------------------|-----------|
| ✅         | Core booking system            | Live      |
| ✅         | Admin CRUD panel               | Dec 2025  |
| 🔄         | Stripe payments                | Jan 2026  |
| 🔄         | Email notifications            | Jan 2026  |
| ⏳         | Mobile-responsive PWA          | Feb 2026  |
| ⏳         | Multi-language (i18n)          | Q1 2026   |

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push & open a Pull Request

## 🎥 Tutorial Reference

Built while following & improving upon:  
[Build and Deploy a Full Stack Car Rental Application - React JS & ImageKit]([https://youtu.be/tBObk72EYYw](https://youtu.be/tBObk72EYYw?si=9u__xQukrUqQV4PK))  
(Extended with admin panel, auth, better state management, and production-grade practices)

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Abdiweli Jama Abdullahi**  
Full-Stack Developer @ HIRGAL NEXUS  
- GitHub: [@developer-abdiweli-jama](https://github.com/developer-abdiweli-jama)  
- LinkedIn: [abdiweli-jama](https://linkedin.com/in/abdiweli-jama)  
- Email: your.email@example.com

<p align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</p>
