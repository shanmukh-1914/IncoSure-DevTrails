# Frontend-Only Setup Guide

## Overview
**IncoSure** is now configured to run as a **frontend-only application**. All data is stored in the browser's `localStorage` with no backend API calls required.

## Key Features
- ✅ **Fully Functional UI**: All screens and features work without a backend
- ✅ **Local Storage**: User data, policies, and claims are persisted in browser storage
- ✅ **No Database Required**: MySQL and Spring Boot backend services are removed
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Mock Data**: Pre-loaded sample data for demo purposes

## Running the Application

### Quick Start
```bash
cd frontend
npm install  # or pnpm install
npm run dev  # Starts Vite dev server at http://localhost:5173
```

### Build for Production
```bash
cd frontend
npm run build
```

## Environment Configuration
The frontend is configured with `.env.local`:
```
VITE_USE_BACKEND=false
```

This environment variable disables all backend API calls. The application will use localStorage for data persistence instead.

## File Structure
```
frontend/
├── .env.local          # Frontend environment config (VITE_USE_BACKEND=false)
├── package.json        # Frontend dependencies (React, Vite, TailwindCSS)
├── vite.config.js      # Vite configuration
└── src/
    └── app/
        ├── services/   # All services have fallback logic for frontend-only mode
        ├── screens/    # UI screens for all features
        ├── components/ # Reusable React components
        └── modules/    # Business logic modules
```

## Data Persistence
All user data is stored in browser localStorage:
- `app_users`: Registered users
- `app_current_user`: Currently logged-in user
- `app_auth_token`: Authentication token
- `userPolicies`: Insurance policies
- Plus other feature-specific data

## Features Available
- ✅ User Registration & Login (stored in localStorage)
- ✅ Insurance Policies Management
- ✅ Claims Processing
- ✅ Weather Alerts (simulated)
- ✅ Risk Assessment
- ✅ Analytics Dashboard
- ✅ Admin Panel
- ✅ Dark Mode / Theme Toggle
- ✅ Responsive Navigation

## Backend Configuration (Disabled)
The following have been removed or disabled:
- ❌ Spring Boot Web Server
- ❌ MySQL Database
- ❌ JPA/Hibernate ORM
- ❌ REST API Endpoints
- ❌ Database Migrations
- ❌ Spring Security

The `application.properties` file is minimal and disables all database auto-configuration.

## Development Notes
- The application automatically uses localStorage when `VITE_USE_BACKEND=false`
- Services like `authService.js`, `claimService.js`, etc., have built-in fallback logic
- Mock data in `frontend/src/app/data/mockData.js` can be imported for quick testing
- Browser DevTools → Storage → Local Storage to view persisted data

## Testing Admin Features
Use email containing "admin" to access admin features:
- Example: `admin@example.com`

## Clearing Data
To reset all stored data:
1. Open DevTools (F12)
2. Go to Storage → Local Storage
3. Find the entry for http://localhost:5173 (or your domain)
4. Clear all `app_` prefixed keys
5. Or use: `localStorage.clear()` in console

## Notes
- This is a **demo/prototype** application
- Passwords are stored in plain text in localStorage (for demo only)
- No actual insurance processing occurs
- All data is lost when browser storage is cleared
