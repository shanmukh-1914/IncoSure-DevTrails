
  # IncoSure

  This is a frontend-only implementation of IncoSure. The original project design is available at https://www.figma.com/design/11uUfF1go6sJTDTKZlwZGj/IncoSure.

  ## 🚀 Quick Start (Frontend-Only)

  **All data is stored in the browser's localStorage - no backend or database required!**

  ### Running the Application

  ```bash
  cd frontend
  npm install              # Install dependencies
  npm run dev              # Start development server at http://localhost:5173
  ```

  ### Building for Production

  ```bash
  cd frontend
  npm run build            # Creates optimized production build
  ```

  ## 📋 Features

  ✅ User Authentication (Registration & Login)  
  ✅ Insurance Policy Management  
  ✅ Claims Processing  
  ✅ Weather Monitoring & Alerts  
  ✅ Risk Assessment & Analytics  
  ✅ Admin Dashboard  
  ✅ Dark Mode & Responsive Design  
  ✅ All data persisted in browser localStorage  

  ## ⚙️ Environment Configuration

  The application is pre-configured with `.env.local`:
  ```
  VITE_USE_BACKEND=false
  ```

  This disables all backend API calls and uses localStorage for data persistence.

  ## 📁 Project Structure

  ```
  IncoSure/
  ├── frontend/              # React + Vite frontend application
  │   ├── .env.local        # ← Disables backend (VITE_USE_BACKEND=false)
  │   ├── .env.example      # Environment variables reference
  │   ├── package.json      # Frontend dependencies
  │   ├── vite.config.js    # Vite configuration
  │   └── src/
  │       └── app/
  │           ├── services/ # API services with localStorage fallback
  │           ├── screens/  # UI screens
  │           └── components/
  ├── pom.xml              # Maven config (minimal, frontend-only)
  ├── src/main/resources/  # Minimal Spring Boot config
  └── FRONTEND_ONLY_SETUP.md  # Detailed setup guide
  ```

  ## 📚 Documentation

  - [FRONTEND_ONLY_SETUP.md](FRONTEND_ONLY_SETUP.md) - Comprehensive frontend-only setup guide
  - [APP_README.md](APP_README.md) - Application features documentation
  - [TESTING.md](TESTING.md) - Testing guidelines
  - [WEATHER_ALERTS_README.md](WEATHER_ALERTS_README.md) - Weather alerts documentation

  ## 🔧 Backend (Removed)

  This is a **frontend-only** application. The following have been removed:
  - ❌ Spring Boot REST API
  - ❌ MySQL Database
  - ❌ JPA/Hibernate ORM
  - ❌ Database Migrations
  - ❌ Spring Security

  All functionality is available through the browser-based frontend with data stored in localStorage.

  ## 💾 Data Storage

  User data is stored in browser localStorage:
  - User accounts and authentication
  - Insurance policies
  - Claims history
  - Preferences and settings

  Each browser/device has its own data store. Clear localStorage to reset.

  ## 🎯 Demo Credentials

  Create an account with any email/password combination following the validation rules, or use admin features with emails containing "admin".
  