# 🏨 Hostel Leave Application

A **full-stack Hostel Leave Application System** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
The application enables students to apply for leave seamlessly while providing administrators with complete control, approval workflows, and insightful analytics.

---

## 🚀 Features

### 👨‍🎓 Student Panel
- 🔐 Secure Signup & Login (JWT + Google OAuth)
- 📝 Apply for leave with reason and date range
- 📊 Track leave status (Pending / Approved / Rejected)
- 📁 View complete leave history
- 🔒 Access protected routes

### 🛠️ Admin Panel
- 🔐 Secure Admin Authentication
- 📋 View all student leave requests
- ✅ Approve / ❌ Reject applications
- 📊 Analytics Dashboard (monthly requests, reasons, top students)
- 🗂️ Manage all leave records

---

## 🔐 Authentication & Security
- 🔑 JWT-based Authentication
- 🌐 Google OAuth Integration
- 📩 Forgot Password (secure email-based reset link)
- 🛡️ Role-based Authorization (Student / Admin)
- ⚙️ Middleware for API & route protection
- ✔️ Input validation & error handling

---

## 📱 UI & UX
- 🎨 Clean and modern dashboard UI
- 📱 Fully responsive design (Mobile / Tablet / Desktop)
- ⚡ Smooth and intuitive user experience

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js
- 🎨 Tailwind CSS
- 🔀 React Router DOM

### Backend
- 🟢 Node.js
- 🚏 Express.js

### Database
- 🍃 MongoDB

### Authentication
- 🔐 JWT (JSON Web Token)
- 🌐 Google OAuth

---

## 🌐 Live Demo
👉 https://hostel-leave-application-9tzj.vercel.app/

---

## ⚙️ Run Locally

### 📌 Prerequisites
Make sure you have installed:
- Node.js
- MongoDB (Local or MongoDB Atlas)
- Git

---

### 🔽 Clone the Repository
```bash
git clone https://github.com/vedant-kerulkar07/Hostel-Leave-Application.git
cd Hostel-Leave-Application


🔑 Environment Variables

Create a .env file inside the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLIENT_URL=http://localhost:5173

