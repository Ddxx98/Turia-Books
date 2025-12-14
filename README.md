# Turia Books - Employee Attendance System

A comprehensive employee attendance tracking system with Role-Based Access Control (RBAC), real-time punch-in/out functionality, and dynamic business hours configuration.

## 🚀 Features

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Dashboard access, manage business hours, view all attendance records, view analytics.
  - **Employee**: Punch in/out, view personal attendance history, view office timings.
- **Attendance Tracking**:
  - Real-time Punch In/Out.
  - Automatic status calculation (Early, On-time, Late) based on configured business hours.
  - Daily total hours calculation.
  - Single punch-out restriction per day.
- **Business Hours Settings**:
  - Configurable Start Time, End Time, and Grace Time.
  - Dynamic application of settings to attendance status.
- **Security**:
  - JWT-based authentication.
  - Password hashing with bcrypt.
  - Protected routes for both frontend and backend.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Driver**: `pg` (node-postgres)
- **Authentication**: JSON Web Tokens (JWT)

### Frontend
- **Framework**: Next.js (React)
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📂 Project Structure

```
Turia-Books/
├── turia-backend/     # Node.js/Express Backend
│   ├── controllers/   # API Logic
│   ├── models/        # Database Schema & Connection
│   ├── routes/        # API Routes
│   └── ...
└── turia-frontend/    # Next.js Frontend
    ├── src/app/       # Pages & Layouts
    ├── src/components/# Reusable UI Components
    └── ...
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd turia-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=3001
   DATABASE_URL=postgres://user:password@localhost:5432/turia_db
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server will automatically create the necessary database tables on startup.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd turia-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Documentation

### Authentication

#### `POST /api/register`
Register a new user.
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "role": "employee" }`
- **Response**: Created employee object.

#### `POST /api/login`
Authenticate a user.
- **Body**: `{ "email": "john@example.com", "password": "password123" }`
- **Response**: `{ "token": "jwt_token", "role": "employee" }`

### Attendance

#### `POST /api/punchIn`
Record punch-in time.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "date": "YYYY-MM-DD", "punchInTime": "ISO_STRING" }`
- **Response**: Attendance record with calculated status.

#### `POST /api/punchOut`
Record punch-out time.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "date": "YYYY-MM-DD", "punchOutTime": "ISO_STRING" }`
- **Response**: Updated attendance record with total hours.
- **Note**: Users can only punch out once per day.

#### `GET /api/attendance`
Fetch attendance records.
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `date`, `name`, `status`
- **Response**: Array of attendance records.

### Settings (Business Hours)

#### `GET /api/settings`
Fetch current business hours.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "startTime": "09:00", "endTime": "18:00", "graceTime": 10 }`

#### `PUT /api/settings`
Update business hours (Admin only).
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "startTime": "HH:mm", "endTime": "HH:mm", "graceTime": number }`
- **Response**: Updated settings.

## 🔄 App Workflow

1. **Registration**: User registers as an 'employee' or 'admin'.
2. **Login**: User logs in and receives a JWT.
   - **Admin** is redirected to `/dashboard`.
   - **Employee** is redirected to `/attendance`.
3. **Employee Actions**:
   - View Office Timings on the attendance page.
   - Click "Punch In" to mark attendance. Status (On-time/Late) is calculated instantly.
   - Click "Punch Out" at the end of the day. Total hours are calculated.
4. **Admin Actions**:
   - View Dashboard with attendance statistics.
   - View list of all employee attendance records.
   - Go to "Settings" to configure Office Start Time, End Time, and Grace Period.
