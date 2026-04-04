import { Cloud, CloudRain, Sun, Wind, Eye, Droplets } from 'lucide-react';

/**
 * Animated Weather Icon based on condition
 */
export function AnimatedWeatherIcon({ condition, size = 64 }) {
  const iconProps = { size, className: 'animate-pulse' };

  const getWeatherIcon = () => {
    const conditionLower = condition?.toLowerCase() || '';

    // Rain conditions
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('thunderstorm')) {
      return (
        <div className="relative">
          <CloudRain {...iconProps} className="text-blue-400" />
          <div className="absolute inset-0 animate-bounce" style={{ animationDuration: '1.5s' }}>
            <Droplets size={size / 2} className="text-blue-300" />
          </div>
        </div>
      );
    }

    // Clear/Sunny conditions
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return (
        <Sun 
          {...iconProps} 
          className="text-yellow-400 animate-spin" 
          style={{ animationDuration: '4s' }}
        />
      );
    }

    // Cloudy conditions
    if (conditionLower.includes('cloud')) {
      return (
        <Cloud {...iconProps} className="text-gray-400" />
      );
    }

    // Foggy/Misty conditions
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return (
        <div className="relative">
          <Eye {...iconProps} className="text-gray-500" />
          <Cloud size={size / 1.5} className="absolute top-0 left-0 text-gray-400 opacity-70" />
        </div>
      );
    }

    // Windy conditions
    if (conditionLower.includes('wind')) {
      return (
        <Wind 
          {...iconProps} 
          className="text-cyan-400 animate-pulse"
        />
      );
    }

    // Default
    return <Cloud {...iconProps} className="text-gray-400" />;
  };

  return (
    <div className="flex items-center justify-center">
      {getWeatherIcon()}
    </div>
  );
}

/**
 * Weather Condition Badge with appropriate colors
 */
export function WeatherConditionBadge({ condition, temp, humidity, windSpeed }) {
  const getRiskLevel = () => {
    const conditionLower = condition?.toLowerCase() || '';
    const tempNum = parseInt(temp) || 0;

    // High risk
    if (conditionLower.includes('rain') || 
        conditionLower.includes('thunderstorm') || 
        tempNum >= 40 ||
        windSpeed >= 40) {
      return { level: 'high', color: 'bg-red-900/30 text-red-300 border-red-700', emoji: '🔴' };
    }

    // Medium risk
    if (conditionLower.includes('cloud') || 
        conditionLower.includes('mist') || 
        tempNum >= 35 ||
        windSpeed >= 30) {
      return { level: 'medium', color: 'bg-yellow-900/30 text-yellow-300 border-yellow-700', emoji: '🟡' };
    }

    // Low risk
    return { level: 'low', color: 'bg-green-900/30 text-green-300 border-green-700', emoji: '🟢' };
  };

  const risk = getRiskLevel();

  return (
    <div className={`border rounded-lg px-4 py-2 ${risk.color}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{risk.emoji}</span>
        <div>
          <p className="font-semibold capitalize text-sm">
            {risk.level} Risk
          </p>
          <p className="text-xs opacity-80">
            {condition} • {temp}°C • Humidity: {humidity}% • Wind: {windSpeed} km/h
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Large weather card with animation
 */
export function WeatherCard({ weather, city }) {
  if (!weather) {
    return (
      <div className="bg-gray-800 rounded-3xl p-8 text-center animate-pulse">
        <p className="text-gray-400">Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-3xl p-8 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">
            {Math.round(weather.temperature)}°C
          </h2>
          <p className="text-blue-200 capitalize mb-4">
            {weather.description}
          </p>
          <div className="space-y-2 text-sm text-blue-300">
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>💨 Wind: {weather.windSpeed} km/h</p>
            <p>📍 {city}</p>
          </div>
        </div>
        <div className="opacity-80">
          <AnimatedWeatherIcon condition={weather.condition} size={100} />
        </div>
      </div>
    </div>
  );
}
