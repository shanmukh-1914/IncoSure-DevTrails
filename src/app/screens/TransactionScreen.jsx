import { CheckCircle2, Cloud, ArrowRight, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser, getUserClaims } from "../services/authService";

export function TransactionScreen({ view = "payout" }) {
  const [activeView, setActiveView] = useState(view);
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const user = getCurrentUser();
  const upiId = "ravi@paytm";

  useEffect(() => {
    let mounted = true;

    const loadClaims = async () => {
      const userClaims = await getUserClaims();
      if (!mounted) return;
      setClaims(userClaims);
    };

    loadClaims();

    return () => {
      mounted = false;
    };
  }, []);

  const latestClaim = useMemo(() => {
    if (claims.length === 0) return null;
    return [...claims].sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt))[0];
  }, [claims]);

  const payoutAmount = latestClaim?.amount || 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Payout Success View
  if (activeView === "payout") {
    return (
      <div className="min-h-screen bg-gray-950 pb-20">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Payout Success</h1>
          <p className="text-gray-400">Your earnings are protected</p>
        </div>

        {/* Success Animation */}
        <div className="px-6 py-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-green-600 rounded-full p-8">
                <CheckCircle2 size={64} className="text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Payout Triggered!</h2>
              <p className="text-gray-400">Automatic compensation processed</p>
            </div>

            {/* Amount */}
            <div className="bg-gradient-to-br from-green-900/50 to-green-950/30 border border-green-700 rounded-2xl p-8 w-full">
              <p className="text-green-200 text-center text-sm mb-2">Amount Credited</p>
              <h1 className="text-5xl font-bold text-white text-center">₹{payoutAmount}</h1>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 space-y-4">
          {/* Reason Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 rounded-full p-3">
                <Cloud size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Reason</p>
                <h3 className="text-white font-semibold">{latestClaim?.reason || "No recent claim"}</h3>
              </div>
            </div>
          </div>

          {/* UPI Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">UPI ID</span>
                <span className="text-white font-mono">{upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white">
                  {latestClaim ? new Date(latestClaim.payoutAt).toLocaleDateString("en-IN") : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time</span>
                <span className="text-white">
                  {latestClaim ? new Date(latestClaim.payoutAt).toLocaleTimeString("en-IN") : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID</span>
                <span className="text-white font-mono text-sm">{latestClaim?.id || "-"}</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6">
            <p className="text-green-200 text-center">
              ✓ Money has been credited to your account
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setActiveView("history")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <span>View All Payouts</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // History View
  const payoutHistory = claims.map((claim) => ({
    id: claim.id,
    date: claim.payoutAt || claim.approvedAt,
    reason: claim.reason,
    amount: claim.amount,
    status: claim.payoutStatus || "credited"
  }));
  const totalPayouts = payoutHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 px-6 pt-8 pb-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">Payout History</h1>
        <p className="text-gray-400">Track all your automatic payouts</p>
      </div>

      {/* Summary Card */}
      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-950/30 border border-blue-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Payouts Received</p>
              <h2 className="text-4xl font-bold text-white">₹{totalPayouts.toLocaleString()}</h2>
              <p className="text-blue-300 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={16} />
                <span>{payoutHistory.length} transactions</span>
              </p>
            </div>
            <div className="bg-blue-600 rounded-full p-4">
              <TrendingUp size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Payout List */}
      <div className="px-6 pb-6">
        <h3 className="text-white font-semibold mb-4">Recent Payouts</h3>
        <div className="space-y-3">
          {payoutHistory.map((payout) => (
            <div
              key={payout.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 rounded-full p-2">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{payout.reason}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Calendar size={14} />
                      <span>{formatDate(payout.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-bold text-lg">+₹{payout.amount}</p>
                  <span className="text-xs text-gray-500 capitalize">{payout.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state message (shown if no history) */}
        {payoutHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-400">No payout history yet</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
