import { getCurrentUser } from "./authService";
import { getPlatformSignal, getTrafficSignal } from "./integrationService";

const WEATHER_CONDITIONS = [
  { condition: "Clear", description: "clear sky", icon: "01d", tempRange: [28, 35], rainRisk: "low" },
  { condition: "Rain", description: "moderate rain", icon: "10d", tempRange: [23, 30], rainRisk: "high" },
  { condition: "Thunderstorm", description: "storm activity", icon: "11d", tempRange: [24, 31], rainRisk: "high" },
  { condition: "Haze", description: "dust and haze", icon: "50d", tempRange: [33, 41], rainRisk: "low" }
];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getAQIRisk = () => {
  const value = randomBetween(45, 140);
  return {
    value,
    level: value >= 100 ? "high" : value >= 70 ? "medium" : "low"
  };
};

const toRainValue = (level) => {
  if (level === "high") return `${randomBetween(70, 92)}%`;
  if (level === "medium") return `${randomBetween(35, 60)}%`;
  return `${randomBetween(5, 25)}%`;
};

export const generateSimulatedWeather = (previousWeather = null) => {
  const user = getCurrentUser();
  const pool = [...WEATHER_CONDITIONS];

  if (previousWeather?.condition && Math.random() > 0.45) {
    const same = pool.find((item) => item.condition === previousWeather.condition);
    if (same) {
      pool.unshift(same);
    }
  }

  const selected = pool[randomBetween(0, pool.length - 1)];
  const temperature = randomBetween(selected.tempRange[0], selected.tempRange[1]);
  const aqi = getAQIRisk();
  const windSpeed = randomBetween(12, 55);
  const heatLevel = temperature >= 40 ? "high" : temperature >= 35 ? "medium" : "low";
  const rainLevel = selected.rainRisk === "high" ? "high" : Math.random() > 0.65 ? "medium" : "low";
  const traffic = getTrafficSignal({ city: user?.location || "Vijayawada", zone: user?.workingZone || "Zone 1" });
  const platform = getPlatformSignal({ deliveryType: user?.deliveryType || "generic" });

  return {
    city: user?.location || "Vijayawada",
    country: "IN",
    temperature,
    feelsLike: temperature + randomBetween(0, 3),
    humidity: randomBetween(45, 92),
    windSpeed,
    condition: selected.condition,
    description: selected.description,
    icon: selected.icon,
    curfewRestricted: Math.random() > 0.82,
    curfewReason: "Curfew / Zone Restriction",
    integration: {
      traffic,
      platform,
      weatherApi: "simulated-weather"
    },
    risks: [
      {
        type: "rain",
        level: rainLevel,
        value: toRainValue(rainLevel),
        label: "Rain Probability",
        condition: selected.condition
      },
      {
        type: "heat",
        level: heatLevel,
        value: `${temperature}°C`,
        label: "Temperature",
        condition: temperature
      },
      {
        type: "aqi",
        level: aqi.level,
        value: `${aqi.value}`,
        label: "Air Quality",
        condition: aqi.value
      }
    ],
    timestamp: new Date().toISOString()
  };
};

export const getNextSimulationDelay = () => randomBetween(10000, 20000);
