import { getWeatherByCoordinates, getAirQualityByCoordinates, formatWeatherData } from '../services/weatherService';
import { checkWeatherAlerts, storeAlerts, shouldNotifyAlert } from '../services/alertService';
import { fetchCurfewRestrictionStatus, getRealTimePollutionByCoordinates } from '../services/civicService';
import { getCurrentUser } from '../services/authService';

export const payoutHistory = [
  {
    id: "1",
    date: "2026-03-18",
    reason: "Heavy Rain Alert",
    amount: 450,
    status: "completed"
  },
  {
    id: "2",
    date: "2026-03-15",
    reason: "Extreme Heat",
    amount: 300,
    status: "completed"
  },
  {
    id: "3",
    date: "2026-03-10",
    reason: "Poor Air Quality",
    amount: 250,
    status: "completed"
  },
  {
    id: "4",
    date: "2026-03-05",
    reason: "Heavy Rain Alert",
    amount: 400,
    status: "completed"
  },
  {
    id: "5",
    date: "2026-02-28",
    reason: "Extreme Heat",
    amount: 350,
    status: "completed"
  }
];

// Default mock data for current risks (fallback if API fails)
const mockCurrentRisks = [
  {
    type: "rain",
    level: "high",
    value: "85%",
    label: "Rain Probability"
  },
  {
    type: "heat",
    level: "medium",
    value: "38°C",
    label: "Temperature"
  },
  {
    type: "aqi",
    level: "low",
    value: "65",
    label: "Air Quality"
  }
];

// This will be set after fetching real weather data
export let currentRisks = mockCurrentRisks;

/**
 * Fetch real weather data and update risks
 */
export const fetchCurrentWeatherData = async (latitude, longitude) => {
  try {
    const [weatherData, openWeatherPollution, openMeteoPollution] = await Promise.all([
      getWeatherByCoordinates(latitude, longitude),
      getAirQualityByCoordinates(latitude, longitude),
      getRealTimePollutionByCoordinates(latitude, longitude).catch(() => null)
    ]);

    const combinedPollutionData = {
      openWeather: openWeatherPollution,
      openMeteo: openMeteoPollution
    };

    const formattedWeather = formatWeatherData(weatherData, combinedPollutionData);

    const user = getCurrentUser();
    const curfewStatus = await fetchCurfewRestrictionStatus({
      city: formattedWeather.city,
      zone: user?.workingZone
    });

    const weatherWithCivicContext = {
      ...formattedWeather,
      curfewRestricted: curfewStatus.restricted,
      curfewReason: curfewStatus.reason,
      curfewSource: curfewStatus.source
    };
    
    // Update current risks with real data
    currentRisks = weatherWithCivicContext.risks;
    
    // Check for alerts
    const alerts = checkWeatherAlerts(weatherWithCivicContext);
    
    // Store and notify about new alerts
    if (alerts.length > 0) {
      const previousAlerts = JSON.parse(localStorage.getItem("weatherAlerts")) || [];
      const newAlerts = alerts.filter(alert => 
        shouldNotifyAlert(alert, previousAlerts)
      );
      
      if (newAlerts.length > 0) {
        const storedAlerts = newAlerts.map(alert => ({
          ...alert,
          timestamp: new Date().toISOString(),
          read: false,
          id: `${alert.type}_${Date.now()}`
        }));
        storeAlerts(storedAlerts);
      }
    }

    return {
      weather: weatherWithCivicContext,
      civic: {
        curfewRestricted: curfewStatus.restricted,
        source: curfewStatus.source
      },
      alerts: alerts,
      risks: weatherWithCivicContext.risks
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return mock data as fallback
    return {
      weather: null,
      alerts: [],
      risks: mockCurrentRisks,
      error: error.message
    };
  }
};
