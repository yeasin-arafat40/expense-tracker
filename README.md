# 💰 Expense Tracker

A full-stack MERN application for personal finance management — track income, expenses, and budgets with interactive charts.

### 🌐 [Live Demo](https://expensetrackeryeasin.netlify.app) · 📁 [Source Code](https://github.com/yeasin-arafat40/expense-tracker)

---

## ✨ Features

- 🔐 **Authentication** — Register/Login with JWT + bcrypt
- 💸 **Transactions** — Add, edit, delete income/expense with filters
- 📊 **Dashboard** — Stats + Pie chart + Bar chart (Recharts)
- 🎯 **Budget** — Monthly budget with progress warnings
- 🌙 **Dark Mode** — Toggle with localStorage
- 📱 **Responsive** — Mobile, tablet, desktop
- 🔔 **Toast Notifications** — All actions
- 👤 **Profile** — Update info, change password

---

## 🛠️ Tech Stack

**Frontend:** React.jsx · Vite · Vanilla CSS · React Router · Axios · Recharts · Context API

**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT · bcryptjs

**Deploy:** Netlify (frontend) · Render (backend) · MongoDB Atlas (database)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/stats` | Get chart data |
| GET | `/api/budget/:month` | Get budget |
| POST | `/api/budget` | Save budget |

---

## 🚀 Run Locally

**1. Clone repo**
```bash
git clone https://github.com/yeasin-arafat40/expense-tracker.git
cd expense-tracker
```

**2. Backend setup**
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

**3. Frontend setup**
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Open: **http://localhost:5173**

---

## 📁 Project Structure

```
expense-tracker/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
│
└── server/          # Express backend
    ├── models/
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── config/
    ├── server.js
    └── package.json
```

---

## 👨‍💻 Author

**Yeasin Arafat**

- GitHub: [@yeasin-arafat40](https://github.com/yeasin-arafat40)
- LinkedIn: [your-linkedin](https://www.linkedin.com/in/yeasin-arafat-237a7834a)
- Email: yeasin4376@gmail.com

---

⭐ If you like this project, give it a star!