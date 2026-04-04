const API_KEY = "e9c54c4ac4e3d6569161c916dc6f7f9c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Get user's current location using Geolocation API
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  });
};

/**
 * Fetch weather data by coordinates
 */
export const getWeatherByCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
};

/**
 * Fetch weather data by city name
 */
export const getWeatherByCity = async (cityName) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
};

/**
 * Fetch air quality data by coordinates
 */
export const getAirQualityByCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch air quality data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Air Quality API error:", error);
    throw error;
  }
};

/**
 * Format weather data to app format
 */
export const formatWeatherData = (weatherData, pollutionData) => {
  const weather = weatherData.main;
  const wind = weatherData.wind;
  const condition = weatherData.weather[0];
  
  // Calculate AQI risk level
  let aqiLevel = "low";
  let aqiValue = 50;
  
  const openMeteoAQI = pollutionData?.openMeteo?.us_aqi;
  const openWeatherAQI = pollutionData?.openWeather?.list?.[0]?.main?.aqi;

  if (typeof openMeteoAQI === "number") {
    aqiValue = Math.round(openMeteoAQI);
    if (aqiValue >= 100) aqiLevel = "high";
    else if (aqiValue >= 60) aqiLevel = "medium";
    else aqiLevel = "low";
  } else if (openWeatherAQI) {
    aqiValue = Math.round(openWeatherAQI * 20); // Convert to 0-100 scale
    if (openWeatherAQI >= 4) aqiLevel = "high";
    else if (openWeatherAQI >= 3) aqiLevel = "medium";
    else aqiLevel = "low";
  }

  // Determine rain probability and level
  let rainLevel = "low";
  let rainValue = "0%";
  
  if (condition.main === "Rain" || condition.main === "Thunderstorm") {
    rainLevel = "high";
    rainValue = "85%";
  } else if (condition.main === "Drizzle" || condition.main === "Mist") {
    rainLevel = "medium";
    rainValue = "40%";
  }

  // Determine heat risk level
  let heatLevel = "low";
  if (weather.temp >= 40) heatLevel = "high";
  else if (weather.temp >= 35) heatLevel = "medium";

  return {
    city: weatherData.name,
    country: weatherData.sys.country,
    temperature: Math.round(weather.temp),
    feelsLike: Math.round(weather.feels_like),
    humidity: weather.humidity,
    windSpeed: Math.round(wind.speed * 3.6), // Convert m/s to km/h
    condition: condition.main,
    description: condition.description,
    icon: condition.icon,
    risks: [
      {
        type: "rain",
        level: rainLevel,
        value: rainValue,
        label: "Rain Probability",
        condition: condition.main
      },
      {
        type: "heat",
        level: heatLevel,
        value: `${Math.round(weather.temp)}°C`,
        label: "Temperature",
        condition: weather.temp
      },
      {
        type: "aqi",
        level: aqiLevel,
        value: `${aqiValue}`,
        label: "Air Quality",
        condition: aqiValue
      }
    ],
    timestamp: new Date().toISOString(),
    lat: weatherData.coord.lat,
    lon: weatherData.coord.lon
  };
};
