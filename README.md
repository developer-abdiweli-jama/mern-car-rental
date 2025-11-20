
# 🌑🚗 MERN Car Rental App

<p align="center">
  <img src="https://dummyimage.com/1200x400/0f0f0f/ffffff&text=🌑🚗+MERN+Car+Rental+App" alt="MERN Car Rental - Dark Banner" />
</p>

<p align="center">
  <strong>A modern, full-stack car rental platform built with the MERN stack.</strong>
</p>

<p align="center">
  Smooth UI • Fast booking flow • Admin control panel • Production-ready structure
</p>

<p align="center">
  <a href="https://mern-car-rental.vercel.app"><strong>🚀 Live Demo</strong></a> • 
  <a href="#-features">Features</a> • 
  <a href="#-tech-stack">Tech Stack</a> • 
  <a href="#-installation--setup">Install</a>
</p>

---

## 🏷️ Badges

<p align="center">
  <img src="https://img.shields.io/github/stars/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&color=yellow&labelColor=0d0d0d" />
  <img src="https://img.shields.io/github/forks/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&color=yellow&labelColor=0d0d0d" />
  <img src="https://img.shields.io/github/issues/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&color=orange&labelColor=0d0d0d" />
  <img src="https://img.shields.io/github/license/developer-abdiweli-jama/mern-car-rental?style=for-the-badge&color=yellow&labelColor=0d0d0d" />
  <img src="https://img.shields.io/badge/PRs-Welcome-00ff88?style=for-the-badge&labelColor=0d0d0d" />
</p>

### 🧰 Tech Versions

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-State-8B5CF6?style=for-the-badge&logo=react-query&logoColor=white" />
</p>

---

## 📸 Preview

<p align="center">
  <img src="https://dummyimage.com/1600x900/0f172a/ffffff&text=Home+Page+%E2%80%94+Dark+Mode+Coming+Soon" width="100%" />
</p>

<p align="center">
  <img src="https://dummyimage.com/1600x900/0f172a/ffffff&text=Car+Details+%26+Booking+Flow" width="100%" />
</p>

<p align="center">
  <img src="https://dummyimage.com/1600x900/0f172a/ffffff&text=Admin+Dashboard+%E2%80%94+Manage+Fleet+%26+Bookings" width="100%" />
</p>

> ⚡ Real screenshots and GIFs will be added as development continues.

---

## 🎯 Features

### 👤 Customer Features

* Clean vehicle browsing with high-quality images
* Filters for price, category, transmission and fuel
* Real-time availability calendar
* Secure user login and registration (JWT)
* Straightforward booking experience

### 🛠 Admin Dashboard

* Add, edit and delete vehicles
* Manage booking approvals
* Track fleet availability
* Protected admin-only routes

### 🔜 Coming Soon

* Secure Stripe payments
* Email/SMS notifications
* User dashboard with booking history
* Review and rating system
* Google Maps integration

---

## 🛠 Tech Stack

| Layer      | Technologies                                     |
| ---------- | ------------------------------------------------ |
| Frontend   | React 18, Tailwind, Zustand, React Router, Axios |
| Backend    | Node.js, Express, MongoDB, Mongoose              |
| Auth       | JWT, bcrypt                                      |
| CDN        | ImageKit                                         |
| Deployment | Vercel (client), Render/Railway (API)            |
| Tools      | ESLint, Prettier, Nodemon, Concurrently          |

---

## 📁 Project Structure

```bash
mern-car-rental/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

```bash
# Clone project
git clone https://github.com/developer-abdiweli-jama/mern-car-rental.git
cd mern-car-rental
```

### Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

### Frontend setup

```bash
cd ../client
npm install
```

---

## 🔑 Backend Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

---

## 🚀 Running the App

### Recommended (runs both)

```bash
npm run dev
```

### Run separately

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd client
npm run dev
```

---

## 🛤 Roadmap

| Status | Feature             | ETA      |
| ------ | ------------------- | -------- |
| ✅      | Core booking system | Live     |
| ✅      | Admin dashboard     | Dec 2025 |
| 🔄     | Stripe payments     | Jan 2026 |
| 🔄     | Email notifications | Jan 2026 |
| ⏳      | PWA support         | Feb 2026 |
| ⏳      | Multi-language      | Q1 2026  |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feat/add-feature`)
3. Commit (`git commit -m 'add: new feature'`)
4. Push and create a PR

---

## 🎥 Tutorial Reference

Project inspired by and expanded from:
[https://youtu.be/tBObk72EYYw](https://youtu.be/tBObk72EYYw)

---

## 👤 Author

**Abdiweli Jama Abdullahi**
Full-Stack Developer • HIRGAL NEXUS

* GitHub: [https://github.com/developer-abdiweli-jama](https://github.com/developer-abdiweli-jama)
* LinkedIn: [https://linkedin.com/in/abdiweli-jama](https://linkedin.com/in/abdiweli-jama)
* Email: [abdiwelijamac@gmail.com](mailto:abdiwelijamac@gmail.com)

<p align="center"><strong>⭐ Star this project if you like it!</strong></p>

