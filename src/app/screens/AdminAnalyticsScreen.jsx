import { useEffect, useMemo, useState } from "react";
import { Users, Shield, Zap, IndianRupee, AlertCircle } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { getAdminAnalytics } from "../services/adminService";

export function AdminAnalyticsScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(getAdminAnalytics());
  }, []);

  const triggerEntries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.triggerCounts).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const zoneEntries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.riskZones || {}).sort((a, b) => b[1] - a[1]);
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 pb-20 px-6 pt-8">
        <p className="text-gray-300">Loading admin analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Analytics</h1>
        <p className="text-gray-300 text-sm">System-wide policy, trigger, and payout snapshot</p>
      </div>

      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Users</span>
            <Users size={18} className="text-blue-400" />
          </div>
          <p className="text-white text-2xl font-bold mt-2">{data.totals.users}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Active Policies</span>
            <Shield size={18} className="text-green-400" />
          </div>
          <p className="text-white text-2xl font-bold mt-2">{data.totals.activePolicies}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Auto Claims</span>
            <Zap size={18} className="text-yellow-400" />
          </div>
          <p className="text-white text-2xl font-bold mt-2">{data.totals.claims}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Payouts</span>
            <IndianRupee size={18} className="text-emerald-400" />
          </div>
          <p className="text-white text-2xl font-bold mt-2">₹{data.totals.totalPayouts}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-3">Trigger Counts</h3>
          {triggerEntries.length === 0 ? (
            <p className="text-gray-400 text-sm">No triggers recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {triggerEntries.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 capitalize">{name.replaceAll("-", " ")}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-3">Recent Claims</h3>
          {data.claims.length === 0 ? (
            <p className="text-gray-400 text-sm">No claims found.</p>
          ) : (
            <div className="space-y-2">
              {data.claims
                .slice()
                .sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt))
                .slice(0, 6)
                .map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between border border-gray-800 rounded-xl p-3">
                    <div>
                      <p className="text-white text-sm">{claim.reason}</p>
                      <p className="text-gray-400 text-xs">{claim.userId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">₹{claim.amount}</p>
                      <p className="text-gray-500 text-xs">{claim.payoutStatus || "pending"}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-3">Risk Zones</h3>
          {zoneEntries.length === 0 ? (
            <p className="text-gray-400 text-sm">No zone distribution available yet.</p>
          ) : (
            <div className="space-y-2">
              {zoneEntries.map(([zone, count]) => (
                <div key={zone} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{zone}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-2xl p-4 flex gap-2">
          <AlertCircle size={16} className="text-blue-300 mt-0.5" />
          <p className="text-blue-200 text-xs">
            Admin mode is local prototype only. Promote role by setting user.role to "admin" in localStorage for demo.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
