/**
 * Alert thresholds for triggering payouts
 */
const ALERT_THRESHOLDS = {
  rain: {
    conditions: ["Rain", "Thunderstorm", "Heavy Rain"],
    threshold: 50 // Probability threshold in %
  },
  heat: {
    tempHigh: 35, // Celsius - triggers payout
    tempExtreme: 40
  },
  aqi: {
    levelHigh: 150, // AQI value
    levelExtreme: 200
  },
  wind: {
    high: 40, // km/h
    severe: 60
  }
};

/**
 * Check if weather conditions warrant an alert/payout
 */
export const checkWeatherAlerts = (weatherData) => {
  const alerts = [];
  const { risks, temperature, windSpeed, condition } = weatherData;

  // Check rain alert
  const rainRisk = risks.find(r => r.type === "rain");
  if (rainRisk && rainRisk.level === "high" && ALERT_THRESHOLDS.rain.conditions.includes(condition)) {
    alerts.push({
      type: "rain",
      severity: "high",
      message: `Heavy Rain Alert! 🌧️ Rain detected in ${weatherData.city}`,
      payoutAmount: 450,
      reason: "Heavy Rain Alert"
    });
  }

  // Check heat alert
  if (temperature >= ALERT_THRESHOLDS.heat.tempExtreme) {
    alerts.push({
      type: "heat",
      severity: "critical",
      message: `Extreme Heat Alert! 🔥 Temperature reached ${temperature}°C in ${weatherData.city}`,
      payoutAmount: 500,
      reason: "Extreme Heat Alert"
    });
  } else if (temperature >= ALERT_THRESHOLDS.heat.tempHigh) {
    alerts.push({
      type: "heat",
      severity: "high",
      message: `High Temperature Alert! ☀️ It's ${temperature}°C in ${weatherData.city}`,
      payoutAmount: 300,
      reason: "High Temperature Alert"
    });
  }

  // Check air quality alert
  const aqiRisk = risks.find(r => r.type === "aqi");
  if (aqiRisk && aqiRisk.level === "high") {
    alerts.push({
      type: "aqi",
      severity: "high",
      message: `Poor Air Quality Alert! 😷 AQI is ${aqiRisk.value} in ${weatherData.city}`,
      payoutAmount: 250,
      reason: "Poor Air Quality Alert"
    });
  }

  // Check wind alert
  if (windSpeed >= ALERT_THRESHOLDS.wind.severe) {
    alerts.push({
      type: "wind",
      severity: "critical",
      message: `Severe Wind Alert! 💨 Wind speed reached ${windSpeed} km/h in ${weatherData.city}`,
      payoutAmount: 400,
      reason: "Severe Wind Alert"
    });
  } else if (windSpeed >= ALERT_THRESHOLDS.wind.high) {
    alerts.push({
      type: "wind",
      severity: "high",
      message: `High Wind Alert! 🌬️ Wind speed is ${windSpeed} km/h in ${weatherData.city}`,
      payoutAmount: 200,
      reason: "High Wind Alert"
    });
  }

  return alerts;
};

/**
 * Format alert for notification/display
 */
export const formatAlertNotification = (alert) => {
  return {
    ...alert,
    timestamp: new Date().toISOString(),
    read: false,
    id: `${alert.type}_${Date.now()}`
  };
};

/**
 * Check if we should notify user about alert
 * (Avoid duplicate notifications within 1 hour)
 */
export const shouldNotifyAlert = (alert, previousAlerts) => {
  if (!previousAlerts || previousAlerts.length === 0) {
    return true;
  }

  const lastSimilarAlert = previousAlerts.find(
    a => a.type === alert.type && a.reason === alert.reason
  );

  if (!lastSimilarAlert) {
    return true;
  }

  // Check if last alert was more than 1 hour ago
  const lastAlertTime = new Date(lastSimilarAlert.timestamp);
  const timeDiff = Date.now() - lastAlertTime.getTime();
  const oneHourMs = 60 * 60 * 1000;

  return timeDiff > oneHourMs;
};

/**
 * Store alerts in localStorage
 */
export const storeAlerts = (alerts) => {
  const existingAlerts = JSON.parse(localStorage.getItem("weatherAlerts")) || [];
  const allAlerts = [...existingAlerts, ...alerts];
  
  // Keep only last 50 alerts
  const recentAlerts = allAlerts.slice(-50);
  
  localStorage.setItem("weatherAlerts", JSON.stringify(recentAlerts));
  return recentAlerts;
};

/**
 * Get stored alerts from localStorage
 */
export const getStoredAlerts = () => {
  return JSON.parse(localStorage.getItem("weatherAlerts")) || [];
};

/**
 * Clear stored alerts
 */
export const clearStoredAlerts = () => {
  localStorage.removeItem("weatherAlerts");
};

/**
 * Get last weather data from cache
 */
export const getLastWeatherData = () => {
  return JSON.parse(localStorage.getItem("lastWeatherData")) || null;
};

/**
 * Save weather data to cache
 */
export const saveWeatherData = (weatherData) => {
  localStorage.setItem("lastWeatherData", JSON.stringify(weatherData));
};
