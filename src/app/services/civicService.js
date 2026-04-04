const OPEN_METEO_AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const CURFEW_API_URL = import.meta.env.VITE_CURFEW_API_URL;

export const getRealTimePollutionByCoordinates = async (latitude, longitude) => {
  const response = await fetch(
    `${OPEN_METEO_AIR_QUALITY_URL}?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10,us_aqi`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Open-Meteo air quality data");
  }

  const data = await response.json();
  return data.current || null;
};

export const fetchCurfewRestrictionStatus = async ({ city, zone }) => {
  if (!CURFEW_API_URL) {
    return {
      restricted: false,
      source: "mock-fallback",
      reason: "No curfew endpoint configured"
    };
  }

  try {
    const url = `${CURFEW_API_URL}?city=${encodeURIComponent(city || "")}&zone=${encodeURIComponent(zone || "")}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Curfew API returned non-success status");
    }

    const data = await response.json();
    return {
      restricted: Boolean(data?.restricted),
      source: "api",
      reason: data?.reason || "Restriction status from API"
    };
  } catch (error) {
    return {
      restricted: false,
      source: "api-fallback",
      reason: error.message
    };
  }
};
