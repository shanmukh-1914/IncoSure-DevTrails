// Trained logistic model parameters (trained offline on synthetic disruption history)
// and embedded for frontend-only inference.
const TRAINED_RISK_MODEL_V1 = {
  version: "risk-logreg-v1",
  intercept: -0.32,
  means: {
    temperature: 33.1,
    rainHigh: 0.28,
    aqiValue: 81.5,
    windSpeed: 27.4,
    congestionHigh: 0.31,
    platformOutage: 0.11,
    locationHigh: 0.26,
    locationSafe: 0.34,
    historicalProbability: 0.56
  },
  stds: {
    temperature: 5.7,
    rainHigh: 0.45,
    aqiValue: 22.8,
    windSpeed: 11.2,
    congestionHigh: 0.46,
    platformOutage: 0.31,
    locationHigh: 0.44,
    locationSafe: 0.47,
    historicalProbability: 0.12
  },
  weights: {
    temperature: 0.61,
    rainHigh: 1.18,
    aqiValue: 0.57,
    windSpeed: 0.36,
    congestionHigh: 0.49,
    platformOutage: 0.64,
    locationHigh: 0.93,
    locationSafe: -0.82,
    historicalProbability: 1.06
  }
};

const sigmoid = (value) => 1 / (1 + Math.exp(-value));

const zNormalize = (value, mean, std) => {
  if (!std) return 0;
  return (value - mean) / std;
};

export const inferRiskWithTrainedModel = (rawFeatures = {}) => {
  const { means, stds, weights, intercept, version } = TRAINED_RISK_MODEL_V1;

  let linear = intercept;
  for (const key of Object.keys(weights)) {
    const normalized = zNormalize(rawFeatures[key] ?? 0, means[key], stds[key]);
    linear += normalized * weights[key];
  }

  const probability = sigmoid(linear);
  const riskScore = Math.max(1, Math.min(99, Math.round(probability * 100)));

  return {
    modelVersion: version,
    probability,
    riskScore,
    bucket: riskScore >= 75 ? "high" : riskScore >= 50 ? "medium" : "low"
  };
};
