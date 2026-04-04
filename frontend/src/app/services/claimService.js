import { assessClaimFraudRisk } from "./fraudDetectionService";
import { processMockPayout } from "./integrationService";
import { getCoverageSettingsForUser, getWeeklyClaimedAmount } from "./coverageSettingsService";

const CLAIMS_KEY = "userClaims";

const getAllClaims = () => {
  return JSON.parse(localStorage.getItem(CLAIMS_KEY) || "[]");
};

const saveAllClaims = (claims) => {
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
};

const getPayoutStatus = (payoutAt) => {
  return new Date(payoutAt).getTime() <= Date.now() ? "credited" : "pending";
};

export const createAutoClaim = ({ user, policy, trigger, hoursLost = 3, coverageSettings }) => {
  if (!user?.id || !policy || policy.status !== "active") {
    return { success: false, error: "User policy is inactive" };
  }

  const resolvedSettings = coverageSettings || getCoverageSettingsForUser(user.id);

  const existingClaims = getAllClaims().filter((claim) => claim.userId === user.id);
  const fraudAssessment = assessClaimFraudRisk({
    user,
    trigger,
    weather: trigger?.weather,
    existingClaims
  });

  if (fraudAssessment.blocked) {
    return { success: false, error: "Claim blocked by fraud checks", fraudAssessment };
  }

  const rawAmount = Math.max(
    trigger?.fixedAmount || 0,
    Math.round((policy.hourlyIncomeProtection || 120) * hoursLost)
  );
  const cappedAmount = Math.min(rawAmount, resolvedSettings.maxPayoutPerClaim || 500);
  const weeklyClaimed = getWeeklyClaimedAmount(user.id);
  const remainingWeekly = Math.max(0, (resolvedSettings.weeklyCoverageCap || 2500) - weeklyClaimed);
  const amount = Math.max(0, Math.min(cappedAmount, remainingWeekly));

  if (amount <= 0) {
    return { success: false, error: "Weekly coverage cap reached" };
  }

  const payoutAt = resolvedSettings.instantPayoutEnabled
    ? new Date().toISOString()
    : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  const claim = {
    id: `clm_${Date.now()}`,
    userId: user.id,
    amount,
    reason: trigger.reason,
    triggerType: trigger.type,
    location: user.location,
    status: "approved",
    policyId: policy.id,
    approvedAt: new Date().toISOString(),
    payoutAt,
    payoutStatus: resolvedSettings.instantPayoutEnabled ? "credited" : "pending",
    fraudScore: fraudAssessment.score,
    fraudReasons: fraudAssessment.reasons
  };

  if (resolvedSettings.instantPayoutEnabled) {
    const payoutTx = processMockPayout({ claim, user });
    claim.payoutTransactionId = payoutTx.id;
  }

  const claims = getAllClaims();
  claims.push(claim);
  saveAllClaims(claims);

  return { success: true, claim };
};

export const getUserClaimsById = (userId) => {
  const claims = getAllClaims().filter((claim) => claim.userId === userId);

  return claims
    .map((claim) => ({
      ...claim,
      payoutStatus: getPayoutStatus(claim.payoutAt)
    }))
    .sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt));
};

export const hasRecentClaimForTrigger = ({ userId, triggerType, withinHours = 6 }) => {
  const claims = getUserClaimsById(userId);
  const threshold = Date.now() - withinHours * 60 * 60 * 1000;

  return claims.some((claim) => {
    return (
      claim.triggerType === triggerType &&
      new Date(claim.approvedAt).getTime() >= threshold
    );
  });
};

export const getClaimStatsForUser = (userId) => {
  const claims = getUserClaimsById(userId);

  return {
    count: claims.length,
    totalApproved: claims.reduce((sum, claim) => sum + claim.amount, 0),
    totalCredited: claims
      .filter((claim) => claim.payoutStatus === "credited")
      .reduce((sum, claim) => sum + claim.amount, 0),
    pendingCount: claims.filter((claim) => claim.payoutStatus === "pending").length
  };
};
