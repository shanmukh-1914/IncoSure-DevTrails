import { TrendingUp, Calendar, Shield, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getCurrentUser, getActivePlan, getUserClaims } from '../services/authService';
import { useEffect, useState } from 'react';

export function AnalyticsScreen() {
  const [user, setUser] = useState(getCurrentUser());
  const [activePlan, setActivePlan] = useState(getActivePlan());
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    earningsProtected: 0,
    activeCoverageDays: 0,
    totalClaims: 0,
    approvedAmount: 0
  });

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      const currentUser = getCurrentUser();
      const currentPlan = getActivePlan();
      const userClaims = await getUserClaims();
      if (!mounted) return;

      setUser(currentUser);
      setActivePlan(currentPlan);
      setClaims(userClaims);

      const activeCoverageDays = currentPlan
        ? Math.ceil((new Date(currentPlan.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

      const approvedAmount = userClaims
        .filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + c.amount, 0);

      setStats({
        earningsProtected: currentUser?.earningsProtected || 0,
        activeCoverageDays: Math.max(0, activeCoverageDays),
        totalClaims: userClaims.length,
        approvedAmount
      });
    };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  const riskTrends = [
    { day: 'Mon', highRisk: 2, mediumRisk: 1, lowRisk: 2 },
    { day: 'Tue', highRisk: 1, mediumRisk: 3, lowRisk: 1 },
    { day: 'Wed', highRisk: 3, mediumRisk: 0, lowRisk: 2 },
    { day: 'Thu', highRisk: 1, mediumRisk: 2, lowRisk: 2 },
    { day: 'Fri', highRisk: 2, mediumRisk: 1, lowRisk: 2 },
    { day: 'Sat', highRisk: 1, mediumRisk: 1, lowRisk: 3 },
    { day: 'Sun', highRisk: 0, mediumRisk: 2, lowRisk: 3 }
  ];

  const maxRiskValue = Math.max(...riskTrends.map(t => Math.max(t.highRisk, t.mediumRisk, t.lowRisk)));

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-blue-200">Your insurance & protection stats 📊</p>
      </div>

      {/* Key Stats */}
      <div className="px-6 mt-6 space-y-4">
        {/* Earnings Protected */}
        <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-200 text-sm mb-2">Earnings Protected</p>
              <h2 className="text-white text-4xl font-bold">₹{stats.earningsProtected.toLocaleString()}</h2>
              <p className="text-green-300 text-xs mt-2">Protected through active claims</p>
            </div>
            <div className="bg-green-600 rounded-full p-4">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
        </div>

        {/* Active Plan Status */}
        <div className="grid grid-cols-2 gap-4">
          {/* Coverage Days */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-200 text-xs mb-2">Active Coverage</p>
                <h3 className="text-white text-2xl font-bold">{stats.activeCoverageDays}</h3>
                <p className="text-blue-300 text-xs mt-1">Days remaining</p>
              </div>
              <Calendar className="text-blue-400" size={24} />
            </div>
          </div>

          {/* Total Claims */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-200 text-xs mb-2">Total Claims</p>
                <h3 className="text-white text-2xl font-bold">{stats.totalClaims}</h3>
                <p className="text-purple-300 text-xs mt-1">Approved payouts</p>
              </div>
              <CheckCircle2 className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Approved Amount */}
        <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border border-yellow-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-yellow-200 text-sm mb-2">Total Approved Payouts</p>
              <h2 className="text-white text-3xl font-bold">₹{stats.approvedAmount.toLocaleString()}</h2>
              <p className="text-yellow-300 text-xs mt-2">Automatic weather-triggered payouts</p>
            </div>
            <div className="bg-yellow-600 rounded-full p-4">
              <Zap className="text-white" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Trends Chart */}
      <div className="px-6 py-8">
        <h3 className="text-white font-semibold text-lg mb-6">Weekly Risk Trends</h3>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-end justify-between h-48 gap-2">
            {riskTrends.map((trend, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                {/* Stacked bar chart */}
                <div className="flex flex-col gap-1 h-40 w-full justify-end">
                  {/* High Risk */}
                  {trend.highRisk > 0 && (
                    <div
                      className="bg-red-500 rounded-t w-full"
                      style={{ height: `${(trend.highRisk / maxRiskValue) * 80}px` }}
                      title={`High: ${trend.highRisk}`}
                    />
                  )}
                  {/* Medium Risk */}
                  {trend.mediumRisk > 0 && (
                    <div
                      className="bg-yellow-500 w-full"
                      style={{ height: `${(trend.mediumRisk / maxRiskValue) * 80}px` }}
                      title={`Medium: ${trend.mediumRisk}`}
                    />
                  )}
                  {/* Low Risk */}
                  {trend.lowRisk > 0 && (
                    <div
                      className="bg-green-500 rounded-b w-full"
                      style={{ height: `${(trend.lowRisk / maxRiskValue) * 80}px` }}
                      title={`Low: ${trend.lowRisk}`}
                    />
                  )}
                </div>
                <p className="text-gray-400 text-xs font-semibold mt-2">{trend.day}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-6 justify-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-gray-400">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span className="text-gray-400">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-gray-400">Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      {claims.length > 0 && (
        <div className="px-6 py-6">
          <h3 className="text-white font-semibold text-lg mb-4">Recent Claims</h3>
          <div className="space-y-3">
            {claims.slice(0, 5).map((claim) => (
              <div key={claim.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600 rounded-full p-2">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{claim.reason}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(claim.approvedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">+₹{claim.amount}</p>
                    <p className="text-gray-500 text-xs capitalize">{claim.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {claims.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Shield className="text-gray-600 mx-auto mb-4 opacity-50" size={40} />
          <p className="text-gray-400">No claims yet. You're doing great! 🎉</p>
        </div>
      )}

      {/* Tips */}
      <div className="px-6 py-6">
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-2xl p-4">
          <h4 className="text-blue-300 font-semibold text-sm mb-3">Pro Tips:</h4>
          <ul className="space-y-2 text-blue-200 text-xs">
            <li>✓ Stay covered year-round for better protection</li>
            <li>✓ Check weather forecasts daily for risk alerts</li>
            <li>✓ Keep your UPI ID updated for faster payouts</li>
            <li>✓ Claims are auto-approved within 2 hours</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
