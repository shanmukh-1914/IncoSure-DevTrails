import { activateInsurancePlan, getAllUsers, login, signUp, updateUser } from "./authService";

const DEMO_EMAIL = "judge.demo@incosure.ai";
const DEMO_PASSWORD = "Demo123";

const upsertDemoClaims = (userId) => {
  const claims = JSON.parse(localStorage.getItem("userClaims") || "[]");
  const demoExists = claims.some((claim) => claim.userId === userId && claim.meta === "judge-demo");

  if (demoExists) return;

  const now = Date.now();
  const seeded = [
    {
      id: `clm_demo_${now - 18000000}`,
      userId,
      amount: 320,
      reason: "Heavy Rain Alert",
      triggerType: "heavy-rain",
      location: "Vijayawada",
      status: "approved",
      policyId: `pol_demo_${now}`,
      approvedAt: new Date(now - 18000000).toISOString(),
      payoutAt: new Date(now - 17940000).toISOString(),
      payoutStatus: "credited",
      fraudScore: 14,
      fraudReasons: [],
      payoutTransactionId: `txn_demo_${now - 18000000}`,
      meta: "judge-demo"
    },
    {
      id: `clm_demo_${now - 7200000}`,
      userId,
      amount: 450,
      reason: "Extreme Heat Alert",
      triggerType: "extreme-heat",
      location: "Vijayawada",
      status: "approved",
      policyId: `pol_demo_${now}`,
      approvedAt: new Date(now - 7200000).toISOString(),
      payoutAt: new Date(now - 7140000).toISOString(),
      payoutStatus: "credited",
      fraudScore: 21,
      fraudReasons: [],
      payoutTransactionId: `txn_demo_${now - 7200000}`,
      meta: "judge-demo"
    }
  ];

  localStorage.setItem("userClaims", JSON.stringify([...claims, ...seeded]));
};

const upsertDemoFraud = (userId) => {
  const assessments = JSON.parse(localStorage.getItem("fraudAssessments") || "[]");
  const demoExists = assessments.some((item) => item.userId === userId && item.meta === "judge-demo");
  if (demoExists) return;

  const now = Date.now();
  const seeded = [
    {
      id: `frd_demo_${now - 7000000}`,
      userId,
      score: 21,
      blocked: false,
      reasons: [],
      triggerType: "extreme-heat",
      timestamp: new Date(now - 7000000).toISOString(),
      meta: "judge-demo"
    }
  ];

  localStorage.setItem("fraudAssessments", JSON.stringify([...assessments, ...seeded]));
};

export const startJudgeDemoSession = async () => {
  const users = getAllUsers();
  let demoUser = users.find((user) => user.email === DEMO_EMAIL);

  if (!demoUser) {
    const signup = await signUp({
      name: "Judge Demo Partner",
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      confirmPassword: DEMO_PASSWORD,
      location: "Vijayawada",
      deliveryType: "Swiggy",
      workingZone: "Zone 5"
    });

    if (!signup.success) {
      return signup;
    }

    demoUser = signup.user;
    await activateInsurancePlan("weekly");
    updateUser({ earningsProtected: 12870 });
  } else {
    const loginResult = login(DEMO_EMAIL, DEMO_PASSWORD);
    if (!loginResult.success) {
      return loginResult;
    }

    demoUser = loginResult.user;
    if (!demoUser.insurancePlan) {
      await activateInsurancePlan("weekly");
    }
    updateUser({ earningsProtected: demoUser.earningsProtected || 12870 });
  }

  upsertDemoClaims(demoUser.id);
  upsertDemoFraud(demoUser.id);

  return {
    success: true,
    user: demoUser,
    credentials: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    }
  };
};
