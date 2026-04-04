const PAYOUTS_KEY = "payoutTransactions";

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getTrafficSignal = ({ city, zone }) => {
  const congestionLevel = randomPick(["low", "medium", "high"]);
  return {
    city,
    zone,
    congestionLevel,
    blockedRoutes: congestionLevel === "high" ? 2 : congestionLevel === "medium" ? 1 : 0,
    source: "mock-traffic"
  };
};

export const getPlatformSignal = ({ deliveryType }) => {
  const incident = randomPick(["none", "none", "none", "outage", "api-latency"]);
  return {
    platform: deliveryType || "generic",
    incident,
    active: incident !== "outage",
    demandIndex: Math.floor(55 + Math.random() * 45),
    source: "mock-platform"
  };
};

export const processMockPayout = ({ claim, user }) => {
  const transaction = {
    id: `txn_${Date.now()}`,
    claimId: claim.id,
    userId: user.id,
    amount: claim.amount,
    provider: "sandbox-upi",
    status: "credited",
    timestamp: new Date().toISOString()
  };

  const history = JSON.parse(localStorage.getItem(PAYOUTS_KEY) || "[]");
  history.push(transaction);
  localStorage.setItem(PAYOUTS_KEY, JSON.stringify(history.slice(-300)));

  return transaction;
};

export const getPayoutTransactionsByUser = (userId) => {
  const history = JSON.parse(localStorage.getItem(PAYOUTS_KEY) || "[]");
  return history.filter((item) => item.userId === userId);
};
