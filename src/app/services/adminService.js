import { getAllUsers } from "./authService";

const CLAIMS_KEY = "userClaims";

const getAllClaims = () => {
  return JSON.parse(localStorage.getItem(CLAIMS_KEY) || "[]");
};

export const getAdminAnalytics = () => {
  const users = getAllUsers();
  const claims = getAllClaims();
  const activePolicies = users.filter((user) => user.insurancePlan?.status === "active");

  const triggerCounts = claims.reduce((accumulator, claim) => {
    const triggerType = claim.triggerType || "unknown";
    accumulator[triggerType] = (accumulator[triggerType] || 0) + 1;
    return accumulator;
  }, {});

  const totalPayouts = claims.reduce((sum, claim) => sum + (claim.amount || 0), 0);
  const riskZones = users.reduce((accumulator, user) => {
    const zone = user?.workingZone || "Unknown";
    accumulator[zone] = (accumulator[zone] || 0) + 1;
    return accumulator;
  }, {});

  return {
    users,
    claims,
    activePolicies,
    triggerCounts,
    riskZones,
    totals: {
      users: users.length,
      activePolicies: activePolicies.length,
      claims: claims.length,
      totalPayouts
    }
  };
};
