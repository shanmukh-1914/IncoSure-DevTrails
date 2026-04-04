import { createAutoClaim, hasRecentClaimForTrigger } from "./claimService";
import { createTrigger, hasRecentTrigger } from "./triggerService";
import { getCoverageSettingsForUser, isTriggerCovered } from "./coverageSettingsService";

const CURFEW_HOURS = [22, 23, 0, 1, 2, 3, 4, 5];

const isCurfewWindow = () => {
  return CURFEW_HOURS.includes(new Date().getHours());
};

export const detectDisruptionTriggers = ({ weather, user }) => {
  const triggers = [];
  const rainRisk = weather?.risks?.find((risk) => risk.type === "rain");
  const aqiRisk = weather?.risks?.find((risk) => risk.type === "aqi");

  if (rainRisk?.level === "high") {
    triggers.push({
      type: "heavy-rain",
      reason: "Heavy Rain Alert",
      fixedAmount: 450,
      hoursLost: 3
    });
  }

  if ((weather?.temperature || 0) > 40) {
    triggers.push({
      type: "extreme-heat",
      reason: "Extreme Heat Alert",
      fixedAmount: 500,
      hoursLost: 4
    });
  }

  if (Number(aqiRisk?.value) >= 80 || aqiRisk?.level === "high") {
    triggers.push({
      type: "high-pollution",
      reason: "High Pollution Alert",
      fixedAmount: 300,
      hoursLost: 2
    });
  }

  if ((weather?.windSpeed || 0) >= 45) {
    triggers.push({
      type: "high-wind",
      reason: "High Wind Disruption",
      fixedAmount: 250,
      hoursLost: 2
    });
  }

  if (weather?.integration?.traffic?.congestionLevel === "high") {
    triggers.push({
      type: "traffic-gridlock",
      reason: "Traffic Gridlock Alert",
      fixedAmount: 260,
      hoursLost: 2
    });
  }

  if (weather?.integration?.platform?.incident === "outage") {
    triggers.push({
      type: "platform-outage",
      reason: "Platform API Outage",
      fixedAmount: 320,
      hoursLost: 2
    });
  }

  if ((weather?.curfewRestricted || isCurfewWindow()) && user?.workingZone) {
    triggers.push({
      type: "curfew-restriction",
      reason: weather?.curfewReason || "Curfew / Zone Restriction",
      fixedAmount: 350,
      hoursLost: 3
    });
  }

  return triggers;
};

export const runAutoClaimEngine = ({ weather, user, policy }) => {
  if (!user?.id || !policy || policy.status !== "active") {
    return [];
  }

  const coverageSettings = getCoverageSettingsForUser(user.id);
  if (!coverageSettings.triggerMonitoringEnabled) {
    return {
      claims: [],
      triggers: []
    };
  }

  const locationMatches = !!weather?.city && String(user.location || "").toLowerCase().includes(String(weather.city).toLowerCase());
  if (!locationMatches) {
    return [];
  }

  const triggers = detectDisruptionTriggers({ weather, user }).filter((trigger) =>
    isTriggerCovered(coverageSettings, trigger.type)
  );
  const createdClaims = [];
  const createdTriggers = [];

  triggers.forEach((trigger) => {
    const existingTrigger = hasRecentTrigger({
      userId: user.id,
      triggerType: trigger.type,
      withinHours: 3
    });

    if (!existingTrigger) {
      const storedTrigger = createTrigger({
        userId: user.id,
        triggerType: trigger.type,
        reason: trigger.reason,
        weatherSnapshot: {
          condition: weather?.condition,
          temp: weather?.temperature,
          aqi: weather?.risks?.find((risk) => risk.type === "aqi")?.value
        }
      });
      createdTriggers.push(storedTrigger);
    }

    const isDuplicate = hasRecentClaimForTrigger({
      userId: user.id,
      triggerType: trigger.type,
      withinHours: 6
    });

    if (!isDuplicate && coverageSettings.autoClaimEnabled) {
      const result = createAutoClaim({
        user,
        policy,
        coverageSettings,
        trigger: {
          ...trigger,
          weather
        },
        hoursLost: trigger.hoursLost
      });

      if (result.success) {
        createdClaims.push(result.claim);
      }
    }
  });

  return {
    claims: createdClaims,
    triggers: createdTriggers
  };
};
