const BASE_WEEKLY_PREMIUM = 50;
import { getPersonaRiskProfile } from "./riskAssessmentService";

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

export const getLocationRiskLevel = (workingZone = "", location = "") => {
  const zone = `${workingZone} ${location}`.toLowerCase();

  if (LOCATION_RISK_MAP.high.some((tag) => zone.includes(tag))) {
    return "high";
  }

  if (LOCATION_RISK_MAP.safe.some((tag) => zone.includes(tag))) {
    return "safe";
  }

  return "moderate";
};

export const getHistoricalDisruptionProbability = (deliveryType = "generic") => {
  const key = String(deliveryType || "generic").toLowerCase();
  return DELIVERY_RISK_WEIGHT[key] || DELIVERY_RISK_WEIGHT.generic;
};

export const calculateWeeklyPremium = ({ weather, location, user }) => {
  let premium = BASE_WEEKLY_PREMIUM;
  const adjustments = [];
  const personaRisk = getPersonaRiskProfile(user, weather);

  const rainRisk = weather?.risks?.find((risk) => risk.type === "rain")?.level;
  if (rainRisk === "high") {
    premium += 20;
    adjustments.push({ factor: "heavyRainRisk", delta: 20 });
  }

  const zoneRisk = getLocationRiskLevel(user?.workingZone, user?.location || location);
  if (zoneRisk === "safe") {
    premium -= 10;
    adjustments.push({ factor: "safeZone", delta: -10 });
  }

  if (zoneRisk === "high") {
    premium += 30;
    adjustments.push({ factor: "highRiskZone", delta: 30 });
  }

  const disruptionProbability = getHistoricalDisruptionProbability(user?.deliveryType);
  if (disruptionProbability >= 0.6) {
    premium += 10;
    adjustments.push({ factor: "historicalDisruption", delta: 10 });
  }

  if (disruptionProbability <= 0.45) {
    premium -= 5;
    adjustments.push({ factor: "historicalStability", delta: -5 });
  }

  if (personaRisk.predictiveRiskScore >= 75) {
    premium += 15;
    adjustments.push({ factor: "predictivePersonaHighRisk", delta: 15 });
  } else if (personaRisk.predictiveRiskScore <= 40) {
    premium -= 8;
    adjustments.push({ factor: "predictivePersonaLowRisk", delta: -8 });
  }

  premium = Math.max(30, Math.min(180, premium));

  return {
    basePremium: BASE_WEEKLY_PREMIUM,
    weeklyPremium: premium,
    adjustments,
    locationRisk: zoneRisk,
    historicalDisruptionProbability: disruptionProbability,
    predictiveRiskScore: personaRisk.predictiveRiskScore,
    riskProbability: personaRisk.riskProbability,
    modelVersion: personaRisk.modelVersion,
    personaBucket: personaRisk.bucket,
    currency: "INR"
  };
};
