const FRAUD_LOG_KEY = "fraudAssessments";

const persistFraudAssessment = (assessment) => {
  const history = JSON.parse(localStorage.getItem(FRAUD_LOG_KEY) || "[]");
  history.push(assessment);
  localStorage.setItem(FRAUD_LOG_KEY, JSON.stringify(history.slice(-400)));
};

export const getFraudAssessmentsByUser = (userId) => {
  const history = JSON.parse(localStorage.getItem(FRAUD_LOG_KEY) || "[]");
  return history
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getFraudMonitorSummary = (userId) => {
  const assessments = getFraudAssessmentsByUser(userId);
  const blockedAttempts = assessments.filter((item) => item.blocked).length;
  const lastAssessment = assessments[0] || null;

  const trustStatus = !lastAssessment
    ? "Stable"
    : lastAssessment.score >= 70
    ? "High Risk"
    : lastAssessment.score >= 40
    ? "Watch"
    : "Trusted";

  return {
    lastScore: lastAssessment?.score ?? 0,
    blockedAttempts,
    trustStatus,
    totalAssessments: assessments.length,
    lastCheckedAt: lastAssessment?.timestamp || null,
    reasons: lastAssessment?.reasons || []
  };
};

export const assessClaimFraudRisk = ({ user, trigger, weather, existingClaims = [] }) => {
  const reasons = [];
  let score = 0;

  const now = Date.now();
  const duplicates = existingClaims.filter((claim) => {
    return claim.triggerType === trigger.type && now - new Date(claim.approvedAt).getTime() < 6 * 60 * 60 * 1000;
  });

  if (duplicates.length > 0) {
    score += 60;
    reasons.push("Duplicate claim pattern detected within 6 hours");
  }

  const locationMatches = String(user?.location || "").toLowerCase().includes(String(weather?.city || "").toLowerCase());
  if (!locationMatches) {
    score += 35;
    reasons.push("Location mismatch between user profile and weather trigger");
  }

  const platformActive = weather?.integration?.platform?.active !== false;
  if (!platformActive) {
    score += 15;
    reasons.push("Platform outage context flagged for activity validation");
  }

  const blocked = score >= 70;
  const result = {
    id: `frd_${Date.now()}`,
    userId: user?.id,
    score,
    blocked,
    reasons,
    triggerType: trigger?.type,
    timestamp: new Date().toISOString()
  };

  persistFraudAssessment(result);
  return result;
};
