# IncoSure Integration & Advanced Features Guide

This guide provides detailed information about how to integrate, extend, and optimize the IncoSure insurance platform for delivery workers.

## 📱 Navigation Structure

### Bottom Navigation Bar
The app uses a 5-tab bottom navigation bar:

| Icon | Route | Component | Purpose |
|------|-------|-----------|---------|
| 🏠 Home | `/home` | DashboardScreen | Main weather monitoring & alerts |
| 🛡️ Plans | `/insurance-plans` | InsurancePlanScreen | Choose & manage plans |
| 📊 Analytics | `/analytics` | AnalyticsScreen | View stats & trends |
| ✅ Claims | `/claims` | ClaimsScreen | Claim history & status |
| 👤 Profile | `/profile` | ProfileScreen | User settings & logout |

### Auth Screens
- `/` - Welcome screen (for new users)
- `/login` - Login screen (for existing users)

## 🔌 Service API References

### authService.js

#### `signUp(userData)`
Registers a new user with validation.

```javascript
import { signUp } from './services/authService';

// Parameters
const userData = {
  name: 'John Doe',        // Required, any string
  email: 'john@example.com', // Required, must be valid format
  password: 'Demo123'       // Required, min 6 chars, 1 uppercase, 1 number
};

// Returns
const result = await signUp(userData);
// {
//   success: true,
//   user: { id, name, email, createdAt },
//   message: "User registered successfully"
// }
```

#### `login(email, password)`
Authenticates user and sets session.

```javascript
const result = await login('john@example.com', 'Demo123');
// {
//   success: true,
//   user: { id, name, email, insurancePlan },
//   token: "unique_token",
//   message: "Login successful"
// }
```

#### `logout()`
Clears current user and session.

```javascript
logout();
// Clears localStorage app_current_user and app_auth_token
```

#### `getCurrentUser()`
Gets the currently logged-in user.

```javascript
const user = getCurrentUser();
// Returns user object or null
```

#### `activateInsurancePlan(planType)`
Activates a plan (weekly/monthly) for current user.

```javascript
const result = activateInsurancePlan('monthly');
// Returns
// {
//   planId: "timestamp",
//   type: "monthly",
//   premium: 199,
//   startDate: "2024-01-15",
//   expiryDate: "2024-02-15",
//   status: "active"
// }
```

#### `getActivePlan()`
Gets user's currently active plan.

```javascript
const plan = getActivePlan();
// {
//   planId: "timestamp",
//   type: "monthly",
//   expiryDate: "2024-02-15",
//   status: "active"
// }
```

#### `triggerClaim(reason, amount)`
Creates a claim with auto-approval simulation.

```javascript
const claim = triggerClaim('Heavy Rain Alert', 450);
// {
//   id: "timestamp",
//   reason: "Heavy Rain Alert",
//   amount: 450,
//   status: "approved",
//   approvedAt: "2024-01-15T10:30:00Z",
//   payoutAt: "2024-01-15T12:30:00Z"
// }
```

#### `getUserClaims()`
Gets all claims for current user sorted by date.

```javascript
const claims = getUserClaims();
// [
//   {
//     id: "timestamp",
//     reason: "Heavy Rain Alert",
//     amount: 450,
//     status: "approved",
//     approvedAt: "2024-01-15T10:30:00Z"
//   },
//   ...
// ]
```

---

### weatherService.js

#### `getUserLocation()`
Gets user's current location via Geolocation API.

```javascript
import { getUserLocation } from './services/weatherService';

const location = await getUserLocation();
// {
//   latitude: 28.7041,
//   longitude: 77.1025,
//   accuracy: 100
// }
```

#### `getWeatherByCoordinates(lat, lon)`
Fetches weather data for given coordinates.

```javascript
const weather = await getWeatherByCoordinates(28.7041, 77.1025);
// {
//   city: "Delhi",
//   temperature: 38,
//   feelsLike: 42,
//   humidity: 35,
//   windSpeed: 15,
//   condition: "Clear sky",
//   icon: "01d",
//   aqi: 85
// }
```

#### `getAirQualityByCoordinates(lat, lon)`
Fetches air quality index for given coordinates.

```javascript
const aqData = await getAirQualityByCoordinates(28.7041, 77.1025);
// {
//   aqi: 3,                    // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
//   pm25: 65.5,               // Particulate matter <= 2.5 micrometers
//   pm10: 98.2,               // Particulate matter <= 10 micrometers
//   no2: 15.8,                // Nitrogen dioxide
//   o3: 45.2,                 // Ozone
//   so2: 2.5,                 // Sulfur dioxide
//   pollutants: ["PM2.5", "PM10"]
// }
```

#### `formatWeatherData(apiResponse)`
Converts OpenWeatherMap API response to app format.

```javascript
const formatted = formatWeatherData(rawApiResponse);
// {
//   city: "Delhi",
//   temperature: 38,
//   feelsLike: 42,
//   humidity: 35,
//   windSpeed: 15,
//   condition: "Clear sky",
//   aqi: 85,
//   lastUpdated: "2024-01-15T10:30:00Z"
// }
```

---

### alertService.js

#### `checkWeatherAlerts(weatherData)`
Checks weather conditions against thresholds and returns triggered alerts.

```javascript
import { checkWeatherAlerts } from './services/alertService';

const weather = {
  temperature: 38,
  condition: 'Heavy Rain',
  windSpeed: 45,
  aqi: 180
};

const alerts = checkWeatherAlerts(weather);
// [
//   {
//     id: "timestamp",
//     type: "HEAVY_RAIN",
//     severity: "critical",
//     message: "Heavy rain detected",
//     amount: 450,
//     weatherFactor: "Heavy Rain"
//   },
//   {
//     type: "POOR_AQI",
//     severity: "high",
//     message: "Air quality is poor",
//     amount: 250,
//     weatherFactor: "AQI > 150"
//   },
//   ...
// ]
```

#### Alert Thresholds
```javascript
// The following conditions trigger alerts:

// HEAVY_RAIN - ₹450
condition.includes("rain") || condition.includes("thunder")

// EXTREME_HEAT - ₹500
temperature >= 40

// HIGH_TEMP - ₹300
temperature >= 35 && temperature < 40

// POOR_AQI - ₹250
aqi > 150

// SEVERE_WIND - ₹400
windSpeed >= 60

// HIGH_WIND - ₹200
windSpeed >= 40 && windSpeed < 60
```

#### `shouldNotifyAlert(alertId)`
Checks if alert should be shown (respects 1-hour cooldown).

```javascript
const shouldShow = shouldNotifyAlert('HEAVY_RAIN');
// true or false (prevents duplicate notifications)
```

#### `storeAlerts(alerts)`
Saves alerts to localStorage (max 50 latest).

```javascript
storeAlerts([
  { id: "1", type: "HEAVY_RAIN", amount: 450, timestamp: "2024-01-15T10:30:00Z" },
  ...
]);
```

#### `getStoredAlerts()`
Retrieves alert history from localStorage.

```javascript
const history = getStoredAlerts();
// [{id, type, amount, timestamp}, ...]
```

---

## 🪝 Custom Hooks

### useWeather.js

#### `useWeather()`
Main hook for weather management and alert checking.

```javascript
import { useWeather } from './hooks/useWeather';

function MyComponent() {
  const {
    weather,           // Current weather object
    alerts,           // Array of triggered alerts
    loading,          // Boolean - data fetching state
    error,            // Error message or null
    city,             // Current city name
    lastUpdated,      // ISO timestamp of last fetch
    refreshWeather,   // Function to manually refresh
    searchCity        // Function to search by city name
  } = useWeather();

  // Auto-fetches on mount, refreshes every 10 minutes
  // Use refreshWeather() to force immediate update
}
```

#### Example Usage
```javascript
const { weather, alerts, loading } = useWeather();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return (
  <div>
    <h2>{weather.city} - {weather.temperature}°</h2>
    <p>Alerts: {alerts.length}</p>
    {alerts.map((alert) => (
      <Alert key={alert.id} alert={alert} />
    ))}
  </div>
);
```

---

### useDarkMode.js

#### `useDarkMode()`
Hook for dark mode toggle with persistence.

```javascript
import { useDarkMode } from './hooks/useDarkMode';

function Header() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button onClick={toggle}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

**Features:**
- Persists to localStorage (app_dark_mode)
- Applies 'dark' class to html element
- Smooth CSS transitions
- Auto-detects system preference on first load

---

## 🎨 UI Components

### WeatherIcon.jsx

#### `AnimatedWeatherIcon({ condition, size })`
Displays animated weather icon based on condition.

```javascript
import { AnimatedWeatherIcon } from './components/WeatherIcon';

// Animated icons for conditions:
// - Cloud (clouds)
// - CloudRain (heavy rain, thunderstorm)
// - Sun (sunny, clear)
// - Wind (high wind)
// - Eye (low visibility)
// - Droplets (humidity)

<AnimatedWeatherIcon condition="Heavy Rain" size={48} />
<AnimatedWeatherIcon condition="Sunny" size={64} />
```

#### `WeatherConditionBadge({ condition, temperature })`
Shows color-coded risk badge.

```javascript
<WeatherConditionBadge 
  condition="Clear sky" 
  temperature={28}
/>
// Green badge - Low Risk
```

#### `WeatherCard({ weather })`
Large card displaying full weather information.

```javascript
<WeatherCard weather={{
  city: "Delhi",
  temperature: 38,
  condition: "Hot & Clear",
  humidity: 35,
  windSpeed: 15,
  aqi: 85
}} />
```

---

### AlertNotification.jsx

#### `AlertNotification({ alerts, maxAlerts })`
Card-style alert display (up to 3 recent).

```javascript
<AlertNotification 
  alerts={alerts} 
  maxAlerts={3}
/>
```

#### `AlertToast({ alert })`
Toast-style popup alert.

```javascript
<AlertToast 
  alert={{
    type: "HEAVY_RAIN",
    message: "Heavy rain detected",
    amount: 450,
    emoji: "🌧️"
  }}
/>
```

---

## 🗄️ localStorage Schema

### Authentication
```javascript
// app_users - All registered users
{
  "[user_id]": {
    id: "timestamp",
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_or_plain", // ⚠️ Not secure, for demo only
    createdAt: "2024-01-01T00:00:00Z"
  }
}

// app_current_user - Currently logged-in user
{
  id: "timestamp",
  name: "John Doe",
  email: "john@example.com"
}

// app_auth_token - Session token
"unique_jwt_or_token_string"
```

### Weather & Alerts
```javascript
// lastWeatherData - Cached weather
{
  city: "Delhi",
  temperature: 38,
  condition: "Clear sky",
  humidity: 35,
  windSpeed: 15,
  aqi: 85,
  lastUpdated: "2024-01-15T10:30:00Z"
}

// lastWeatherCity - Last searched city
"Delhi"

// weatherAlerts - Recent triggered alerts
[
  {
    id: "alert_1",
    type: "HEAVY_RAIN",
    severity: "critical",
    amount: 450,
    timestamp: "2024-01-15T10:30:00Z",
    lastNotified: "2024-01-15T10:35:00Z"
  }
]
```

### User Data
```javascript
// userClaims - All user claims
[
  {
    id: "claim_1",
    userId: "user_id",
    amount: 450,
    reason: "Heavy Rain Alert",
    status: "approved",
    approvedAt: "2024-01-15T10:30:00Z",
    payoutAt: "2024-01-15T12:30:00Z"
  }
]

// userPlans - Activated insurance plans
{
  "[plan_id]": {
    id: "plan_1",
    userId: "user_id",
    type: "monthly",
    premium: 199,
    startDate: "2024-01-15",
    expiryDate: "2024-02-15",
    status: "active"
  }
}
```

### Preferences
```javascript
// app_dark_mode - Dark mode preference
true // or false
```

---

## 🚀 Advanced Integration Scenarios

### Scenario 1: Real Backend Integration

Replace localStorage calls in services with API endpoints:

```javascript
// Before (localStorage)
const users = JSON.parse(localStorage.getItem('app_users')) || {};

// After (API)
const response = await fetch('/api/users');
const users = await response.json();
```

### Scenario 2: Real Weather API with Error Handling

Implement retry logic and fallback:

```javascript
async function fetchWeatherWithFallback(lat, lon) {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await getWeatherByCoordinates(lat, lon);
    } catch (error) {
      lastError = error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
    }
  }

  // Use cached data as fallback
  return getCachedWeatherData();
}
```

### Scenario 3: Payment Gateway Integration

Add real payout processing:

```javascript
async function processPayout(claim) {
  if (claim.amount <= 0) return;

  try {
    const response = await fetch('/api/payouts', {
      method: 'POST',
      body: JSON.stringify({
        userId: getCurrentUser().id,
        claimId: claim.id,
        amount: claim.amount,
        method: 'upi' // or 'bank_transfer'
      })
    });

    const payout = await response.json();
    
    // Update claim status
    updateClaimStatus(claim.id, 'processed', payout.transactionId);
  } catch (error) {
    console.error('Payout failed:', error);
  }
}
```

### Scenario 4: Push Notifications

Implement browser notifications for alerts:

```javascript
async function notifyAlertViaPushNotification(alert) {
  if (!('Notification' in window)) return;

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    new Notification('IncoSure Alert ⚠️', {
      body: `${alert.message} - ₹${alert.amount} payout triggered!`,
      icon: '/weather-icon.png'
    });
  }
}
```

### Scenario 5: Analytics & Reporting

Send analytics events to backend:

```javascript
async function trackEvent(eventName, eventData) {
  await fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({
      event: eventName,
      userId: getCurrentUser().id,
      timestamp: new Date().toISOString(),
      data: eventData
    })
  });
}

// Usage
trackEvent('plan_activated', {
  planType: 'monthly',
  premium: 199
});

trackEvent('claim_triggered', {
  reason: 'Heavy Rain Alert',
  amount: 450
});
```

---

## 🔐 Security Enhancements

### 1. Password Hashing
```javascript
// ❌ Current (not secure)
password: "Demo123"

// ✅ Recommended
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. JWT Tokens
```javascript
import jwt from 'jsonwebtoken';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}
```

### 3. Environment Variables
```javascript
// .env.local
VITE_API_BASE_URL=https://api.example.com
VITE_OPENWEATHER_API_KEY=your_key_here
VITE_JWT_SECRET=your_secret_here
```

### 4. HTTPS & CORS
```javascript
// Use HTTPS in production
// Implement CORS on backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  // ...
});
```

---

## 📊 Performance Optimization

### 1. Code Splitting
```javascript
import { lazy, Suspense } from 'react';

const InsurancePlanScreen = lazy(() => 
  import('./screens/InsurancePlanScreen')
);

// In route
<Suspense fallback={<LoadingSpinner />}>
  <InsurancePlanScreen />
</Suspense>
```

### 2. Memoization
```javascript
import { memo } from 'react';

export const WeatherCard = memo(({ weather }) => {
  return <div>{weather.city}</div>;
});
```

### 3. API Caching
```javascript
const weatherCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function getCachedWeather(key) {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}
```

---

## 🧪 Testing Examples

### Test Weather Alert Trigger
1. Login to app
2. Activate an insurance plan
3. Go to Dashboard (Home)
4. Search for "Mumbai" city
5. Check if rain conditions trigger ₹450 alert

### Test Claims Auto-Approval
1. Trigger a weather alert
2. Go to Claims screen
3. Verify claim shows "Approved" status
4. Check amount matches alert payout

### Test Dark Mode Persistence
1. Click dark mode toggle
2. Refresh page
3. Dark mode should persist (check localStorage)

---

## 📞 Troubleshooting

### Weather not updating
- Check OpenWeatherMap API key validity
- Verify geolocation permission granted
- Check browser console for errors

### Claims not appearing
- Ensure insurance plan is active
- Check localStorage userClaims key
- Verify alert threshold conditions

### Dark mode not applying
- Clear browser cache
- Check localStorage app_dark_mode
- Verify CSS dark mode rules applied

---

## 💡 Future Enhancements

1. **Multi-language Support**: i18n for Hindi, Spanish
2. **Machine Learning**: Predict optimal insurance plans
3. **Gamification**: Streaks, badges for safe deliveries
4. **Social Features**: Referral programs
5. **Advanced Analytics**: Heatmaps, risk prediction
6. **Offline Mode**: Service workers for offline access
7. **Real Payments**: Stripe, Razorpay integration
8. **SMS/Email Notifications**: Alert delivery
9. **Document Upload**: Insurance verification
10. **Admin Dashboard**: Claims management portal

---

**For more information, refer to APP_README.md and WEATHER_ALERTS_README.md**
