# PrimeTrade.ai Frontend Task

A modern, responsive task management web application built as part of the **PrimeTrade.ai Frontend Developer Internship Assignment**.

This project demonstrates frontend engineering skills, secure authentication, protected routing, backend integration, and clean UI/UX design.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected dashboard routes
- Secure logout flow
- Frontend-based admin role assignment during registration

### Task Management
- Create, read, update, delete (CRUD) tasks
- Role-based access (Admin / Member)
- Admin task approval and reopening
- Search and filter functionality
- Ownership-based edit and delete permissions

### UI / UX
- Modern glassmorphism design
- Fully responsive layout
- Clean dashboard experience
- Consistent branding (PrimeTrade.ai Frontend Task)

---

## Admin Feature (Frontend Only)

For this assignment, the admin role is assigned on the frontend during user registration.

Admin Rule:
- Register with the email `admin@primetrade.ai` to create an Admin account
- All other users are assigned the Member role

This approach avoids database changes and is suitable for frontend-focused assignments.
In a production system, admin roles would be enforced on the backend.

---

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt (password hashing)

---

## Project Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── api/
│ └── assets/
└── public/

backend/
├── models/
├── routes/
├── middleware/
└── server.js


---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/AarushCh/primetrade-frontend-task.git
cd primetrade-frontend-task

---

### 2. MongoDB Connection (MongoDB Compass)

This project uses MongoDB as the database and connects using Mongoose.

Steps:
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste one of the following connection strings

MongoDB Atlas:
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>

Local MongoDB:
mongodb://localhost:27017/primetrade


4. Click "Save & Connect"

Collections created automatically:
- users
- tasks

---

### 3. Backend Setup

cd backend
npm install
npm run dev

Create a `.env` file in the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


---

### 4. Frontend Setup

cd frontend
npm install
npm run dev


---

## Security Practices
- Password hashing using bcrypt
- JWT token validation middleware
- Protected API routes
- Client-side and server-side validation

---

## Scalability Notes
- Modular component structure
- Centralized API layer
- Context-based authentication management
- Easily extendable to role-based dashboards or microservices

---

## Submission Note
This project was completed as part of the **PrimeTrade.ai Frontend Developer Task** and focuses on clean UI, secure authentication, and scalable frontend-backend integration.

---

## Thank You

Thank you for taking the time to review this project and for the opportunity to complete the **PrimeTrade.ai Frontend Developer Task**.

I appreciate your consideration and would be happy to discuss the implementation, design decisions, or any part of this project in more detail.