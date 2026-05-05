# PratikCDL Hotel Booking

A React frontend hotel booking project with a simple Express backend for login, registration, and authentication.

## Features

- Responsive hotel booking UI built with React
- Room search, filters, and booking flow
- User login and registration
- Protected booking flow for authenticated users
- Profile page for signed-in users
- Backend auth server using Express, JWT, and bcrypt

## Project Structure

- `src/` — React frontend source files
- `src/pages/` — Page views including Home, Rooms, Booking, Profile, Login, Register
- `src/components/` — Shared UI components like Navbar and RoomCard
- `backend/` — Express auth server
  - `server.js` — auth endpoints
  - `users.json` — local user storage

## Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

## Run Locally

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend in a second terminal:
   ```bash
   cd ..
   npm start
   ```

3. Open the app in the browser:
   ```
   http://localhost:3000
   ```

## Build

To create a production build:
```bash
npm run build
```

## Notes

- The frontend uses `proxy` in `package.json` to forward `/api` requests to the backend at `http://localhost:5000`.
- The backend stores users in `backend/users.json` for development only.
- Do not use the local storage auth implementation for production without a secure backend.
