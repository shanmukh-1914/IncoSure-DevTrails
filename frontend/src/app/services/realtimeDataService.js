const WEATHER_HISTORY_KEY = "weatherHistory";

export const appendWeatherSnapshot = (snapshot) => {
  const history = JSON.parse(localStorage.getItem(WEATHER_HISTORY_KEY) || "[]");
  history.push({
    ...snapshot,
    recordedAt: new Date().toISOString()
  });

  const trimmed = history.slice(-300);
  localStorage.setItem(WEATHER_HISTORY_KEY, JSON.stringify(trimmed));
  return trimmed;
};

export const getWeatherHistory = () => {
  return JSON.parse(localStorage.getItem(WEATHER_HISTORY_KEY) || "[]");
};

export const getRealtimeSummary = () => {
  const history = getWeatherHistory();
  const latest = history[history.length - 1] || null;

  const disruptions = history.filter((item) => {
    const rainHigh = item?.risks?.find((risk) => risk.type === "rain")?.level === "high";
    const heatHigh = item?.risks?.find((risk) => risk.type === "heat")?.level === "high";
    const aqiHigh = item?.risks?.find((risk) => risk.type === "aqi")?.level === "high";
    return rainHigh || heatHigh || aqiHigh;
  }).length;

  return {
    totalSnapshots: history.length,
    latestUpdate: latest?.recordedAt || latest?.timestamp || null,
    disruptionsDetected: disruptions
  };
};
