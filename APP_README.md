# IncoSure - AI-Powered Insurance Platform for Delivery Workers

A modern, responsive frontend-only web application designed for gig economy workers (delivery partners) to protect their income from weather disruptions using AI-powered real-time alerts and automatic payouts.

## 🎯 Features

### 1. **Authentication System**
- ✅ User registration (Name, Email, Password)
- ✅ Secure login with form validation
- ✅ Password strength requirements (min 6 chars, 1 uppercase, 1 number)
- ✅ Email format validation
- ✅ localStorage-based user management
- ✅ Session persistence

### 2. **Real-Time Weather Monitoring**
- ✅ OpenWeatherMap API integration
- ✅ Auto-detect user location via Geolocation API
- ✅ Display: Temperature, humidity, wind speed, weather condition
- ✅ Air Quality Index (AQI) monitoring
- ✅ City search functionality
- ✅ Last searched city saved in localStorage

### 3. **Weather-Based Risk Classification**
- ✅ **Green (Low Risk)**: Sunny, clear skies
- ✅ **Yellow (Medium Risk)**: Cloudy, moderate wind, AQI 100-149
- ✅ **Red (High Risk)**: Rain, storms, extreme heat (≥40°C), poor AQI (≥150)
- ✅ Dynamic risk indicators with colors
- ✅ Animated weather icons based on conditions

### 4. **Insurance Plans**
- ✅ **Weekly Plan**: ₹49/week with ₹500 max payout
- ✅ **Monthly Plan**: ₹199/month with ₹2000 max payout
- ✅ Plan activation with localStorage storage
- ✅ Active plan status display
- ✅ Coverage days countdown
- ✅ Plan expiration tracking

### 5. **Automatic Claims & Payouts**
- ✅ **Heavy Rain**: Auto-triggers ₹450 payout
- ✅ **Extreme Heat (≥40°C)**: Auto-triggers ₹500 payout
- ✅ **High Temperature (≥35°C)**: Auto-triggers ₹300 payout
- ✅ **Poor AQI/Pollution**: Auto-triggers ₹250 payout
- ✅ **Severe Wind (≥60 km/h)**: Auto-triggers ₹400 payout
- ✅ **High Wind (≥40 km/h)**: Auto-triggers ₹200 payout
- ✅ Claim status: Approved ✅, Pending ⏳, Rejected ❌
- ✅ Claim history with timestamps
- ✅ Simulated 2-hour payout window

### 6. **Analytics Dashboard**
- ✅ Total earnings protected
- ✅ Active coverage days remaining
- ✅ Total claims count
- ✅ Weekly risk trends visualization (stacked bar chart)
- ✅ Recent claims display
- ✅ Risk level breakdown (High/Medium/Low)

### 7. **Smart Greeting Messages**
- ✅ Time-based greetings:
  - Morning (5 AM - 12 PM): "Good Morning ☀️"
  - Afternoon (12 PM - 5 PM): "Good Afternoon 🌤️"
  - Evening (5 PM - 9 PM): "Good Evening 🌆"
  - Night (9 PM - 5 AM): "Good Night 🌙"
- ✅ Weather-aware messages:
  - "Stay safe while delivering 🚴‍♂️"
  - "Heavy rain detected — High risk of income loss today"
  - "Hot day ahead! Hydrate well 💧"

### 8. **Dark Mode**
- ✅ Toggle switch in header
- ✅ localStorage persistence
- ✅ System theme detection
- ✅ Smooth CSS transitions
- ✅ Full dark theme applied

### 9. **Responsive Design**
- ✅ Mobile-first approach
- ✅ Fully responsive (320px to 1440px+)
- ✅ Touch-friendly buttons
- ✅ Optimized for all devices
- ✅ Safe area insets for notched devices

### 10. **UI/UX Design**
- ✅ Modern fintech-inspired design
- ✅ Gradient backgrounds
- ✅ Soft shadows and transparency
- ✅ Card-based layouts
- ✅ Smooth animations
- ✅ Color-coded risk levels

## 📁 Project Structure

```
src/app/
├── screens/
│   ├── AuthScreen.jsx              # Login/Signup
│   ├── DashboardScreen.jsx         # Main dashboard
│   ├── InsurancePlanScreen.jsx     # Plans selection
│   ├── AnalyticsScreen.jsx         # Stats & analytics
│   ├── ClaimsScreen.jsx            # Claim history
│   └── ProfileScreen.jsx           # User profile
│
├── components/
│   ├── BottomNav.jsx               # Navigation bar
│   ├── AlertNotification.jsx       # Alert display
│   └── WeatherIcon.jsx             # Animated weather icon
│
├── services/
│   ├── authService.js              # Auth & user management
│   ├── weatherService.js           # OpenWeatherMap API
│   └── alertService.js             # Alert logic & storage
│
├── hooks/
│   ├── useWeather.js               # Weather data hook
│   └── useDarkMode.js              # Dark mode toggle
│
├── data/
│   └── mockData.js                 # Mock data & data fetching
│
├── styles/
│   ├── index.css                   # Global styles
│   ├── tailwind.css                # Tailwind config
│   └── theme.css                   # Dark mode styles
│
└── routes.jsx                       # Route configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern web browser

### Installation

```bash
# Navigate to project frontend directory
cd IncoSure/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running the Application

```bash
cd IncoSure/frontend
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default)

## 🔐 Login Credentials (Demo)

You can create your own account or use demo credentials:
- **Email**: demo@example.com
- **Password**: Demo123

## 📋 User Flow

```
1. Sign Up → Create account (Name, Email, Password)
   ↓
2. Log In → Authenticate with email/password
   ↓
3. Dashboard → View weather alerts & risk status
   ↓
4. Select Plan → Choose Weekly (₹49) or Monthly (₹199)
   ↓
5. Activate Plan → Insurance coverage becomes active
   ↓
6. Monitor Weather → Real-time weather tracking
   ↓
7. Auto-Claims → Weather triggers automatic payouts
   ↓
8. View Analytics → Track earnings protected & claims
```

## 💾 localStorage Keys

The application uses localStorage for the following:

```javascript
// Authentication
"app_users"              // All registered users (JSON array)
"app_current_user"       // Currently logged-in user
"app_auth_token"         // Session token

// User Data
"lastWeatherData"        // Cached weather information
"lastWeatherCity"        // Last searched city
"weatherAlerts"          // Active weather alerts
"userClaims"             // Claim history
"userPlans"              // Insurance plans

// Preferences
"app_dark_mode"          // Dark mode preference (boolean)
```

## 🌤️ Weather API Configuration

### OpenWeatherMap
- **API Key**: `e9c54c4ac4e3d6569161c916dc6f7f9c`
- **Endpoints**:
  - Current Weather: `/weather`
  - Air Pollution: `/air_pollution`
- **Update Frequency**: Every 10 minutes

To use your own API key:

```javascript
// In src/app/services/weatherService.js
const API_KEY = "YOUR_API_KEY_HERE";
```

## 📊 Sample Data

### Sample User
```javascript
{
  id: "timestamp",
  name: "Ravi Kumar",
  email: "ravi@example.com",
  password: "Demo123",
  insurancePlan: {
    type: "weekly",
    premium: 49,
    coverage: "24/7 coverage",
    duration: "7 days",
    payoutAmount: 500,
    status: "active"
  },
  earningsProtected: 1200,
  activeCoverageDays: 5
}
```

### Sample Claim
```javascript
{
  id: "timestamp",
  userId: "user_id",
  amount: 450,
  reason: "Heavy Rain Alert",
  status: "approved",
  approvedAt: "2026-04-03T10:30:00Z",
  payoutAt: "2026-04-03T12:30:00Z"
}
```

## 🎨 Color Scheme

### Risk Levels
- 🟢 **Green**: Low Risk (text-green-400, bg-green-900/20)
- 🟡 **Yellow**: Medium Risk (text-yellow-400, bg-yellow-900/20)
- 🔴 **Red**: High Risk (text-red-400, bg-red-900/20)

### Status Colors
- **Approved**: Green (#10b981)
- **Pending**: Yellow (#f59e0b)
- **Rejected**: Red (#ef4444)

## 🔄 Data Flow

```
User Action
    ↓
Service Layer (authService, weatherService, alertService)
    ↓
localStorage (Persistent Data)
    ↓
Component Update
    ↓
UI Render
```

## 🧪 Testing Features

### Test Weather Alerts
1. **Heavy Rain**: Search for cities like Mumbai during monsoon
2. **Extreme Heat**: Search for Delhi in May/June
3. **Poor AQI**: Search for Delhi in winter
4. **High Wind**: Search for coastal cities during storms

### Test Claims Simulation
1. Go to Analytics → See automatically triggered claims
2. Claims are auto-triggered based on weather conditions
3. Each claim shows time, reason, amount, and status

### Test Dark Mode
1. Click moon icon in header
2. Preference saved to localStorage
3. Persists across sessions

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Icons**: Lucide React
- **Build**: Vite
- **API**: OpenWeatherMap (REST)
- **Storage**: localStorage (Browser API)
- **Location**: Geolocation API

## 🔒 Security Notes

⚠️ **Frontend-Only Application**: This is a demonstration application. In production:
- Passwords should be hashed using bcrypt or similar
- API keys should be stored securely (backend)
- Authentication should use proper JWT tokens
- Claims should be verified server-side
- Implement HTTPS/TLS encryption
- Add proper CORS and CSRF protection

## 🚀 Performance Optimizations

- ✅ Lazy loading of components
- ✅ Optimized re-renders with React.memo
- ✅ Efficient state management with hooks
- ✅ Cached weather data (10-minute intervals)
- ✅ Debounced API calls
- ✅ Optimized CSS with Tailwind
- ✅ Minified bundle size

## 📝 Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## 🐛 Known Limitations

1. **Frontend-Only**: No real backend integration
2. **Simulated Payments**: Claims are simulated, no real payouts
3. **Mock Data**: Some analytics data is pre-generated
4. **No Real Verification**: Claims not verified by actual conditions
5. **localStorage Limits**: 5-10MB depending on browser

## 📞 Support & Contributions

For issues or feature requests, please create an issue in the repository.

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

**Built with ❤️ for delivery workers and gig economy professionals**

*Stay safe, stay protected! 🛡️*
