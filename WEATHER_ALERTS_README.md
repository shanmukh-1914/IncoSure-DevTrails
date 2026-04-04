# IncoSure Weather-Based Alerts Implementation

## Overview

The IncoSure application now integrated real-time weather-based alerts using the OpenWeatherMap API. The system monitors weather conditions and automatically triggers payouts when adverse weather conditions are detected.

## Features

### 1. **Real-Time Weather Monitoring**
- Fetches current weather data every 10 minutes
- Uses Geolocation API to detect user's location automatically
- Provides fallback to stored location if geolocation fails
- Displays:
  - Temperature (°C)
  - Weather condition (Sunny, Rainy, Cloudy, etc.)
  - Humidity percentage
  - Wind speed (km/h)
  - Air Quality Index (AQI)
  - City name and country

### 2. **Automatic Alert Triggers**

The system automatically triggers alerts and payouts when:

#### Heavy Rain Alert 🌧️
- **Condition**: Rain, Thunderstorm, or Heavy Rain detected
- **Payout**: ₹450
- **Status**: Automatically processed

#### Extreme Heat Alert 🔥
- **Condition**: Temperature ≥ 40°C
- **Payout**: ₹500
- **Status**: Critical severity

#### High Temperature Alert ☀️
- **Condition**: Temperature ≥ 35°C
- **Payout**: ₹300
- **Status**: High severity

#### Poor Air Quality Alert 😷
- **Condition**: AQI value > 150
- **Payout**: ₹250
- **Status**: High severity

#### Severe Wind Alert 💨
- **Condition**: Wind speed ≥ 60 km/h
- **Payout**: ₹400
- **Status**: Critical severity

#### High Wind Alert 🌬️
- **Condition**: Wind speed ≥ 40 km/h
- **Payout**: ₹200
- **Status**: High severity

### 3. **Smart Alert Management**
- Prevents duplicate notifications within 1 hour
- Stores up to 50 recent alerts in localStorage
- Displays active alerts on dashboard
- Shows loading indicators during data fetch
- Graceful error handling with fallback to mock data

### 4. **Dashboard Integration**
- **Home View**: 
  - Shows active weather alerts
  - Displays earnings protected
  - Shows payout status based on current alerts
  - Real-time weather data when available

- **Risk Monitor View**:
  - Displays current weather risks
  - Shows real-time conditions with live updates
  - Color-coded risk levels (Low, Medium, High)
  - Wind speed and temperature indicators

## API Configuration

### OpenWeatherMap API
- **API Key**: `e9c54c4ac4e3d6569161c916dc6f7f9c`
- **Endpoints Used**:
  - Current Weather: `/weather`
  - Air Pollution: `/air_pollution`
- **Update Frequency**: Every 10 minutes (auto-refresh)

### Environment
Create a `.env` file if you want to change the API key:
```
VITE_WEATHER_API_KEY=your_api_key_here
```

## File Structure

```
src/app/
├── services/
│   ├── weatherService.js       # Weather API integration
│   └── alertService.js         # Alert logic and storage
├── hooks/
│   └── useWeather.js           # Custom hooks for weather management
├── components/
│   └── AlertNotification.jsx   # Alert display components
├── screens/
│   └── DashboardScreen.jsx     # Updated with weather integration
└── data/
    └── mockData.js             # Updated with fetchCurrentWeatherData function
```

## Usage

### Auto-fetching Weather (Automatic)
Weather data is automatically fetched when the app loads:
```javascript
import { useWeather } from '../hooks/useWeather';

function MyComponent() {
  const { weather, alerts, loading, error, refreshWeather } = useWeather();
  
  // Use data...
}
```

### Checking Alerts Programmatically
```javascript
import { checkWeatherAlerts } from '../services/alertService';

const alerts = checkWeatherAlerts(weatherData);
// Returns array of triggered alerts
```

### Storing and Retrieving Alerts
```javascript
import { 
  getStoredAlerts, 
  storeAlerts, 
  clearStoredAlerts 
} from '../services/alertService';

// Get all stored alerts
const alerts = getStoredAlerts();

// Clear all alerts
clearStoredAlerts();
```

## Alert Flow

```
User Location (Geolocation API)
         ↓
Weather Data (OpenWeatherMap)
         ↓
Air Quality Data (OpenWeatherMap)
         ↓
Format Weather Data
         ↓
Check Alert Thresholds
         ↓
Prevent Duplicate Alerts (1 hour cooldown)
         ↓
Store in localStorage
         ↓
Display on Dashboard
```

## Error Handling

- **Location Permission Denied**: App falls back to last known location or mock data
- **API Failures**: Falls back to mock data with error message
- **Network Issues**: Uses cached weather data from localStorage
- **Invalid City Search**: Shows user-friendly error message

## localStorage Keys
- `lastWeatherData`: Latest fetched weather information
- `weatherAlerts`: Array of recent alerts
- `lastWeatherCity`: Last searched city name

## Loading States
- **Loading**: Yellow pulse indicator, "Updating..." text
- **Active**: Green pulse indicator, "Ready" status
- **Error**: Red alert with error message

## Testing

To test alerts with specific conditions:

1. **Test Rain Alert**: Search for a city with current rain (e.g., Mumbai during monsoon)
2. **Test Heat Alert**: Search for a hot city (e.g., Delhi in May)
3. **Test AQI Alert**: Search for a city with poor air quality (e.g., Delhi in winter)
4. **Test Wind Alert**: Search for a coastal city during storms

## Browser Compatibility

- Requires HTTPS or localhost for Geolocation API
- Supports all modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage support required

## Performance Notes
- Weather data cached for 10 minutes to reduce API calls
- Alerts stored locally to reduce storage needs
- Lazy loading of alert components
- Optimized re-renders with React hooks

## Future Enhancements

- [ ] Push notifications for critical alerts
- [ ] SMS alerts for high-severity conditions
- [ ] Historical weather data visualization
- [ ] Customizable alert thresholds
- [ ] Multiple location tracking
- [ ] Weather forecast integration (7-day)
- [ ] Offline mode with cached data
- [ ] Dark/Light mode preferences

## Support

For API issues, visit [OpenWeatherMap Documentation](https://openweathermap.org/api)

For browser geolocation issues, ensure:
- HTTPS connection (or localhost)
- Location permission granted
- Device location services enabled
