import { useState, useEffect } from 'react';
import { formatAlertNotification, getStoredAlerts, shouldNotifyAlert, storeAlerts } from '../services/alertService';
import { generateSimulatedWeather, getNextSimulationDelay } from '../services/weatherSimulationService';
import { appendWeatherSnapshot } from '../services/realtimeDataService';

/**
 * Custom hook to manage weather data and alerts
 */
export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Start simulation on component mount
  useEffect(() => {
    let timeoutId;
    let cancelled = false;

    const runSimulation = async () => {
      if (cancelled) return;

      await fetchWeather();
      timeoutId = setTimeout(runSimulation, getNextSimulationDelay());
    };

    runSimulation();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const nextWeather = generateSimulatedWeather(weather);
      setWeather(nextWeather);
      setCity(nextWeather.city);
      appendWeatherSnapshot(nextWeather);

      const existingAlerts = getStoredAlerts();
      const generatedAlerts = [];

      if (nextWeather.condition === 'Rain' || nextWeather.condition === 'Thunderstorm') {
        generatedAlerts.push(
          formatAlertNotification({
            type: 'rain',
            severity: 'high',
            message: 'Heavy Rain Detected',
            payoutAmount: 300,
            reason: 'Heavy Rain Detected'
          })
        );
      }

      if ((nextWeather.temperature || 0) >= 40) {
        generatedAlerts.push(
          formatAlertNotification({
            type: 'heat',
            severity: 'critical',
            message: `Extreme Heat Detected (${nextWeather.temperature}°C)`,
            payoutAmount: 350,
            reason: 'Extreme Heat Detected'
          })
        );
      }

      if (Number(nextWeather.risks?.find((risk) => risk.type === 'aqi')?.value || 0) >= 100) {
        generatedAlerts.push(
          formatAlertNotification({
            type: 'aqi',
            severity: 'high',
            message: 'High Pollution Disruption',
            payoutAmount: 250,
            reason: 'High Pollution Disruption'
          })
        );
      }

      const dedupedAlerts = generatedAlerts.filter((alert) => shouldNotifyAlert(alert, existingAlerts));
      if (dedupedAlerts.length > 0) {
        storeAlerts(dedupedAlerts);
      }

      setAlerts(getStoredAlerts());
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Weather simulation error:', err);
      setError(err.message);

      setAlerts(getStoredAlerts());
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    await fetchWeather();
  };

  const searchCity = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const simulated = generateSimulatedWeather(weather);
      const override = { ...simulated, city: cityName };
      setWeather(override);
      setCity(cityName);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    alerts,
    loading,
    error,
    city,
    lastUpdated,
    refreshWeather,
    searchCity
  };
};

/**
 * Hook to monitor active alerts
 */
export const useAlerts = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const alerts = getStoredAlerts();
    setActiveAlerts(alerts);
    setUnreadCount(alerts.filter(a => !a.read).length);

    const interval = setInterval(() => {
      const latest = getStoredAlerts();
      setActiveAlerts(latest);
      setUnreadCount(latest.filter(a => !a.read).length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (alertId) => {
    const alerts = getStoredAlerts();
    const updated = alerts.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    );
    localStorage.setItem('weatherAlerts', JSON.stringify(updated));
    setActiveAlerts(updated);
    setUnreadCount(updated.filter(a => !a.read).length);
  };

  const clearAlert = (alertId) => {
    const alerts = getStoredAlerts();
    const updated = alerts.filter(a => a.id !== alertId);
    localStorage.setItem('weatherAlerts', JSON.stringify(updated));
    setActiveAlerts(updated);
    setUnreadCount(updated.filter(a => !a.read).length);
  };

  return {
    activeAlerts,
    unreadCount,
    markAsRead,
    clearAlert
  };
};
