import { Shield, AlertTriangle, TrendingUp, Cloud, Thermometer, Wind, AlertCircle, Loader, Sun } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { AlertNotification, AlertToast } from "../components/AlertNotification";
import { useWeather, useAlerts } from "../hooks/useWeather";
import { currentRisks } from "../data/mockData";
import { useState, useEffect } from "react";
import { getActivePlan, getCurrentUser, getUserClaims, updateUser } from "../services/authService";
import { runAutoClaimEngine } from "../services/disruptionService";
import { calculateWeeklyPremium } from "../services/premiumEngine";
import { getRealtimeSummary } from "../services/realtimeDataService";
import { getFraudMonitorSummary } from "../services/fraudDetectionService";

export function DashboardScreen({ view = "home" }) {
  const [activeView, setActiveView] = useState(view);
  const { weather, loading, error } = useWeather();
  const { activeAlerts, clearAlert } = useAlerts();
  const [latestAutoClaim, setLatestAutoClaim] = useState(null);
  const [latestTrigger, setLatestTrigger] = useState(null);
  const [showCoverageInfo, setShowCoverageInfo] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [activePlan, setActivePlan] = useState(getActivePlan());
  const [claims, setClaims] = useState([]);
  const [realtimeSummary, setRealtimeSummary] = useState(getRealtimeSummary());
  const [fraudSummary, setFraudSummary] = useState(getFraudMonitorSummary(getCurrentUser()?.id));

  // Use real weather data if available, otherwise use defaults
  const displayRisks = weather?.risks || currentRisks;
  const coverageStatus = weather ? (displayRisks.some(r => r.level === "high") ? "at-risk" : "active") : "at-risk";
  const currentRisk = weather?.description || "Weather data loading...";
  const earningsProtected = user?.earningsProtected || 0;
  const todayPayout = claims.length > 0 ? claims[0].amount : 0;
  const premiumQuote = calculateWeeklyPremium({ weather, user });
  const spotlightTrust = fraudSummary?.trustStatus || "Stable";
  const liveAutomation = activePlan && realtimeSummary.totalSnapshots > 0;

  useEffect(() => {
    let mounted = true;

    const loadDashboardState = async () => {
      const currentUser = getCurrentUser();
      const plan = getActivePlan();
      const userClaims = currentUser?.id ? await getUserClaims() : [];
      if (!mounted) return;

      setUser(currentUser);
      setActivePlan(plan);
      setClaims(userClaims);

      if (currentUser?.id) {
        setFraudSummary(getFraudMonitorSummary(currentUser.id));
      }
      setRealtimeSummary(getRealtimeSummary());
    };

    loadDashboardState();

    return () => {
      mounted = false;
    };
  }, [weather]);

  useEffect(() => {
    if (!weather || !user || !activePlan) {
      return;
    }

    const engineResult = runAutoClaimEngine({
      weather,
      user,
      policy: activePlan
    });
    const createdClaims = engineResult.claims || [];
    const createdTriggers = engineResult.triggers || [];

    if (createdTriggers.length > 0) {
      setLatestTrigger(createdTriggers[0]);
    }

    if (createdClaims.length > 0) {
      const protectedAmount = createdClaims.reduce((sum, claim) => sum + claim.amount, 0);
      updateUser({ earningsProtected: (user.earningsProtected || 0) + protectedAmount });
      setLatestAutoClaim(createdClaims[0]);
      setClaims(getUserClaims());
      setUser(getCurrentUser());
    }
  }, [weather, user, activePlan]);

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-500 bg-red-900/30 border-red-700";
      case "medium":
        return "text-orange-500 bg-orange-900/30 border-orange-700";
      case "low":
        return "text-green-500 bg-green-900/30 border-green-700";
      default:
        return "text-gray-500 bg-gray-900/30 border-gray-700";
    }
  };

  const getRiskIcon = (type) => {
    switch (type) {
      case "rain":
        return Cloud;
      case "heat":
        return Thermometer;
      case "aqi":
        return Wind;
      default:
        return AlertCircle;
    }
  };

  const getRiskBadge = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1) + " Risk";
  };

  // Home View
  if (activeView === "home") {
    return (
      <div className="min-h-screen bg-gray-950 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-950 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">IncoSure</h1>
              <p className="text-gray-400 text-sm">Hey, {user?.name || "Partner"} 👋</p>
            </div>
            <div className="bg-blue-600 rounded-full p-3">
              <Shield size={24} className="text-white" />
            </div>
          </div>

          {/* Coverage Status Card */}
          <div
            className={`rounded-2xl p-6 ${
              coverageStatus === "active"
                ? "bg-green-900/30 border border-green-700"
                : "bg-orange-900/30 border border-orange-700"
            }`}>
            <div className="flex items-center gap-3 mb-2">
              {coverageStatus === "active" ? (
                <Shield size={28} className="text-green-500" />
              ) : (
                <AlertTriangle size={28} className="text-orange-500" />
              )}
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {coverageStatus === "active" ? "Coverage Active" : "At Risk"}
                </h3>
                <p className="text-gray-300 text-sm">{currentRisk}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 mt-6 space-y-4">
          {/* Loading indicator */}
          {loading && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-4 flex items-center gap-3">
              <Loader className="text-blue-500 animate-spin" size={20} />
              <span className="text-blue-300 text-sm">Updating weather data...</span>
            </div>
          )}

          {/* Error message */}
          {error && !weather && (
            <div className="bg-red-900/20 border border-red-700 rounded-2xl p-4">
              <p className="text-red-300 text-sm">
                Unable to fetch weather data. Using default values.
              </p>
            </div>
          )}

          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <AlertNotification 
              alerts={activeAlerts} 
              onDismiss={clearAlert}
              onMarkRead={() => {}}
            />
          )}

          {latestAutoClaim && (
            <AlertToast
              alert={{
                id: latestAutoClaim.id,
                type: latestAutoClaim.triggerType?.includes('heat') ? 'heat' : latestAutoClaim.triggerType?.includes('pollution') ? 'aqi' : 'rain',
                severity: "high",
                reason: latestAutoClaim.reason,
                message: `Claim Automatically Generated. ₹${latestAutoClaim.amount} ${latestAutoClaim.payoutStatus === 'credited' ? 'Credited' : 'scheduled'}.`,
                payoutAmount: latestAutoClaim.amount
              }}
              onDismiss={() => setLatestAutoClaim(null)}
            />
          )}

          {latestTrigger && (
            <AlertToast
              alert={{
                id: latestTrigger.id,
                type: latestTrigger.triggerType?.includes('heat') ? 'heat' : latestTrigger.triggerType?.includes('pollution') ? 'aqi' : 'rain',
                severity: 'high',
                reason: latestTrigger.reason,
                message: `${latestTrigger.reason} trigger created automatically`,
                payoutAmount: null
              }}
              onDismiss={() => setLatestTrigger(null)}
            />
          )}

          {/* Active Policy Snapshot */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Active Policy</p>
            {activePlan ? (
              <>
                <h3 className="text-white font-bold text-xl">Income Loss Shield (Weekly)</h3>
                <p className="text-blue-400 text-sm mt-1">Weekly Premium: ₹{activePlan.weeklyPremium || premiumQuote.weeklyPremium}</p>
                <p className="text-gray-400 text-xs mt-2">Status: {activePlan.status}</p>
              </>
            ) : (
              <p className="text-orange-300 text-sm">No active policy. Activate from Plans to enable automation.</p>
            )}
          </div>

          {/* Judge Spotlight */}
          <div className="bg-gradient-to-br from-emerald-900/35 to-cyan-950/30 border border-emerald-700/40 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-emerald-200 text-xs uppercase tracking-wide">Judge Spotlight</p>
                <h3 className="text-white text-xl font-bold mt-1">Live Parametric Engine</h3>
                <p className="text-emerald-100/80 text-sm mt-1">Weekly pricing, fraud checks, and instant payouts running in real time.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                liveAutomation ? "bg-emerald-500/20 text-emerald-200" : "bg-orange-500/20 text-orange-200"
              }`}>
                {liveAutomation ? "Automation Live" : "Policy Needed"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-gray-300 text-xs">Weekly Premium</p>
                <p className="text-white font-bold text-lg">₹{activePlan?.weeklyPremium || premiumQuote.weeklyPremium}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-gray-300 text-xs">Risk Score</p>
                <p className="text-white font-bold text-lg">{premiumQuote.predictiveRiskScore || 0}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-gray-300 text-xs">Trust Status</p>
                <p className={`font-bold text-sm mt-1 ${
                  spotlightTrust === "Trusted" || spotlightTrust === "Stable"
                    ? "text-green-300"
                    : spotlightTrust === "Watch"
                    ? "text-yellow-300"
                    : "text-red-300"
                }`}>
                  {spotlightTrust}
                </p>
              </div>
            </div>
          </div>

          {/* Earnings Protected */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Earnings Protected</p>
                <h2 className="text-3xl font-bold text-white">₹{earningsProtected.toLocaleString()}</h2>
                <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>+12% this month</span>
                </p>
              </div>
              <div className="bg-blue-600 rounded-full p-4">
                <TrendingUp size={32} className="text-white" />
              </div>
            </div>
          </div>

          {/* Today's Payout */}
          <div className={`rounded-2xl p-6 ${
            todayPayout > 0
              ? "bg-gradient-to-br from-green-900/50 to-green-950/30 border border-green-700/50"
              : "bg-gradient-to-br from-orange-900/50 to-orange-950/30 border border-orange-700/50"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${todayPayout > 0 ? "text-green-200" : "text-orange-200"}`}>
                  {todayPayout > 0 ? "Latest Auto Payout" : "Today's Payout"}
                </p>
                <h2 className="text-3xl font-bold text-white">
                  ₹{todayPayout > 0 ? todayPayout : "0"}
                </h2>
                <p className={`text-sm mt-1 ${todayPayout > 0 ? "text-green-300" : "text-orange-300"}`}>
                  {todayPayout > 0 ? "Auto-claim generated from trigger" : "No trigger-based payout yet"}
                </p>
              </div>
              <div className={`rounded-full p-4 ${todayPayout > 0 ? "bg-green-600" : "bg-orange-600"}`}>
                <Cloud size={32} className="text-white" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => setActiveView("risk")}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Cloud size={24} className="text-blue-500" />
                <span className="text-white text-sm">Check Weather</span>
              </div>
            </button>
            <button
              onClick={() => setShowCoverageInfo((previous) => !previous)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Shield size={24} className="text-green-500" />
                <span className="text-white text-sm">Coverage Info</span>
              </div>
            </button>
          </div>

          {showCoverageInfo && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-white font-semibold text-lg">Coverage Information</h3>
              {activePlan ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Coverage Type</span>
                    <span className="text-white">{activePlan.coverage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Weekly Premium</span>
                    <span className="text-blue-400 font-semibold">₹{activePlan.weeklyPremium}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Payout</span>
                    <span className="text-green-400 font-semibold">₹{activePlan.payoutAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Policy Status</span>
                    <span className="text-white capitalize">{activePlan.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Live Snapshots Stored</span>
                    <span className="text-white">{realtimeSummary.totalSnapshots}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Disruptions Detected</span>
                    <span className="text-orange-300">{realtimeSummary.disruptionsDetected}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Real-Time Update</span>
                    <span className="text-white">
                      {realtimeSummary.latestUpdate
                        ? new Date(realtimeSummary.latestUpdate).toLocaleTimeString("en-IN")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Predictive Risk Score</span>
                    <span className="text-white">{premiumQuote.predictiveRiskScore || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Model Confidence</span>
                    <span className="text-white">
                      {typeof premiumQuote.riskProbability === "number"
                        ? `${Math.round(premiumQuote.riskProbability * 100)}%`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Model Version</span>
                    <span className="text-cyan-300">{premiumQuote.modelVersion || "risk-logreg-v1"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Traffic Signal</span>
                    <span className="text-white capitalize">{weather?.integration?.traffic?.congestionLevel || "n/a"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Platform Status</span>
                    <span className="text-white capitalize">{weather?.integration?.platform?.incident || "stable"}</span>
                  </div>
                </>
              ) : (
                <p className="text-orange-300 text-sm">Activate a weekly policy to see coverage metrics.</p>
              )}
            </div>
          )}

          {/* Recent Claims History */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-3">Recent Claims</h3>
            {claims.length === 0 ? (
              <p className="text-gray-400 text-sm">No claims yet. Real-time automation is running.</p>
            ) : (
              <div className="space-y-2">
                {claims.slice(0, 3).map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-white text-sm">{claim.reason}</p>
                      <p className="text-gray-400 text-xs">{new Date(claim.approvedAt).toLocaleTimeString('en-IN')}</p>
                    </div>
                    <p className="text-green-400 font-semibold">₹{claim.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fraud Monitor */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-3">Fraud Monitor</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-gray-800/60 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Last Score</p>
                <p className="text-white font-bold text-lg">{fraudSummary?.lastScore ?? 0}</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Blocked</p>
                <p className="text-orange-300 font-bold text-lg">{fraudSummary?.blockedAttempts ?? 0}</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Trust</p>
                <p className={`font-bold text-sm mt-1 ${
                  fraudSummary?.trustStatus === "Trusted" || fraudSummary?.trustStatus === "Stable"
                    ? "text-green-400"
                    : fraudSummary?.trustStatus === "Watch"
                    ? "text-yellow-300"
                    : "text-red-400"
                }`}>
                  {fraudSummary?.trustStatus || "Stable"}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-xs">
              {fraudSummary?.lastCheckedAt
                ? `Last checked: ${new Date(fraudSummary.lastCheckedAt).toLocaleTimeString("en-IN")}`
                : "No fraud checks yet. Checks start after first auto-claim attempt."}
            </p>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Risk View
  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 px-6 pt-8 pb-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">Live Risk Monitor</h1>
        <p className="text-gray-400">Real-time weather conditions in your area</p>
      </div>

      {/* Location */}
      <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${loading ? "bg-yellow-500" : "bg-green-500"}`} />
          <span className="text-white">
            {weather ? `${weather.city}, ${weather.country}` : "Vijayawada, Andhra Pradesh"}
          </span>
          {loading && <span className="text-gray-400 text-sm ml-auto">Updating...</span>}
        </div>
        <div className="mt-3 flex items-center gap-2 text-gray-300 text-sm">
          {weather?.condition === 'Rain' || weather?.condition === 'Thunderstorm' ? (
            <Cloud size={18} className="text-blue-400 animate-bounce" />
          ) : weather?.temperature >= 38 ? (
            <Sun size={18} className="text-amber-400 animate-pulse" />
          ) : (
            <Wind size={18} className="text-cyan-400" />
          )}
          <span>{weather?.condition || 'Simulated Condition'} • updated every 10-20s</span>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="px-6 py-4">
          <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-4 flex items-center gap-3">
            <Loader className="text-blue-500 animate-spin" size={20} />
            <span className="text-blue-300 text-sm">Fetching real-time weather data...</span>
          </div>
        </div>
      )}

      {/* Risk Cards */}
      <div className="px-6 py-6 space-y-4">
        {displayRisks.map((risk) => {
          const Icon = getRiskIcon(risk.type);
          const colorClass = getRiskColor(risk.level);

          return (
            <div key={risk.type} className={`rounded-2xl p-6 border ${colorClass}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-3 ${colorClass}`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{risk.label}</h3>
                    <p className="text-gray-400 text-sm">{getRiskBadge(risk.level)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{risk.value}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    risk.level === "high"
                      ? "bg-red-500 w-4/5"
                      : risk.level === "medium"
                      ? "bg-orange-500 w-3/5"
                      : "bg-green-500 w-2/5"
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Alert Message */}
        <div className="bg-orange-900/30 border border-orange-700 rounded-2xl p-6 mt-6">
          <div className="flex gap-3">
            <AlertCircle size={24} className="text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-semibold mb-1">Payout Alert</h4>
              <p className="text-gray-300 text-sm">
                Disruption triggers (rain/heat/pollution/wind/curfew) are monitored continuously and claims are generated automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="text-white font-semibold mb-3">How it works</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• We monitor weather conditions 24/7</p>
            <p>• Automatic payouts trigger during bad conditions</p>
            <p>• No claims needed - money sent directly to UPI</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
