import { inferRiskWithTrainedModel } from "./mlRiskModelService";

const LOCATION_RISK_MAP = {
  safe: ["zone a", "zone 1", "residential", "low-traffic"],
  high: ["zone c", "zone 5", "industrial", "flood", "old city", "high-traffic"]
};

const DELIVERY_RISK_WEIGHT = {
  swiggy: 0.65,
  zomato: 0.62,
  amazon: 0.45,
  flipkart: 0.48,
  dunzo: 0.58,
  zepto: 0.6,
  generic: 0.5
};

const getLocationRiskLevelInternal = (workingZone = "", location = "") => {
  const zone = `${workingZone} ${location}`.toLowerCase();
  if (LOCATION_RISK_MAP.high.some((tag) => zone.includes(tag))) return "high";
  if (LOCATION_RISK_MAP.safe.some((tag) => zone.includes(tag))) return "safe";
  return "moderate";
};

const getHistoricalDisruptionProbabilityInternal = (deliveryType = "generic") => {
  const key = String(deliveryType || "generic").toLowerCase();
  return DELIVERY_RISK_WEIGHT[key] || DELIVERY_RISK_WEIGHT.generic;
};

export const getPersonaRiskProfile = (user = {}, weather = {}) => {
  const locationRisk = getLocationRiskLevelInternal(user?.workingZone, user?.location);
  const historicalProbability = getHistoricalDisruptionProbabilityInternal(user?.deliveryType);
  const rainLevel = weather?.risks?.find((risk) => risk.type === "rain")?.level;
  const aqiValue = Number(weather?.risks?.find((risk) => risk.type === "aqi")?.value || 70);

  const features = {
    temperature: Number(weather?.temperature || 32),
    rainHigh: rainLevel === "high" ? 1 : 0,
    aqiValue,
    windSpeed: Number(weather?.windSpeed || 24),
    congestionHigh: weather?.integration?.traffic?.congestionLevel === "high" ? 1 : 0,
    platformOutage: weather?.integration?.platform?.incident === "outage" ? 1 : 0,
    locationHigh: locationRisk === "high" ? 1 : 0,
    locationSafe: locationRisk === "safe" ? 1 : 0,
    historicalProbability
  };

  const inference = inferRiskWithTrainedModel(features);

  return {
    persona: user?.deliveryType || "generic",
    locationRisk,
    historicalProbability,
    predictiveRiskScore: inference.riskScore,
    riskProbability: inference.probability,
    bucket: inference.bucket,
    modelVersion: inference.modelVersion,
    modelFeatures: features
  };
};
