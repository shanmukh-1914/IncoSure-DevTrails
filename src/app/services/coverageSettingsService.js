const COVERAGE_SETTINGS_KEY = "coverageSettings";

const DEFAULT_SETTINGS = {
  triggerMonitoringEnabled: true,
  autoClaimEnabled: true,
  instantPayoutEnabled: true,
  maxPayoutPerClaim: 500,
  weeklyCoverageCap: 2500,
  coveredTriggerTypes: {
    "heavy-rain": true,
    "extreme-heat": true,
    "high-pollution": true,
    "high-wind": true,
    "traffic-gridlock": true,
    "platform-outage": true,
    "curfew-restriction": true
  }
};

const getAllCoverageSettings = () => {
  return JSON.parse(localStorage.getItem(COVERAGE_SETTINGS_KEY) || "{}");
};

const saveAllCoverageSettings = (settingsByUser) => {
  localStorage.setItem(COVERAGE_SETTINGS_KEY, JSON.stringify(settingsByUser));
};

export const getCoverageSettingsForUser = (userId) => {
  if (!userId) return { ...DEFAULT_SETTINGS };
  const all = getAllCoverageSettings();
  return {
    ...DEFAULT_SETTINGS,
    ...(all[userId] || {}),
    coveredTriggerTypes: {
      ...DEFAULT_SETTINGS.coveredTriggerTypes,
      ...(all[userId]?.coveredTriggerTypes || {})
    }
  };
};

export const updateCoverageSettingsForUser = (userId, updates) => {
  if (!userId) return { success: false, error: "Missing user id" };

  const all = getAllCoverageSettings();
  const existing = getCoverageSettingsForUser(userId);
  all[userId] = {
    ...existing,
    ...updates,
    coveredTriggerTypes: {
      ...existing.coveredTriggerTypes,
      ...(updates.coveredTriggerTypes || {})
    }
  };

  saveAllCoverageSettings(all);
  return { success: true, settings: all[userId] };
};

export const isTriggerCovered = (settings, triggerType) => {
  return settings?.coveredTriggerTypes?.[triggerType] !== false;
};

export const getWeeklyClaimedAmount = (userId) => {
  const claims = JSON.parse(localStorage.getItem("userClaims") || "[]");
  const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return claims
    .filter((claim) => claim.userId === userId && new Date(claim.approvedAt).getTime() >= threshold)
    .reduce((sum, claim) => sum + (claim.amount || 0), 0);
};
