import { CheckCircle, Clock, AlertCircle, Zap, TrendingUp, Calendar } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getUserClaims, getCurrentUser } from '../services/authService';
import { useEffect, useState } from 'react';

export function ClaimsScreen() {
  const [user] = useState(getCurrentUser());
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadClaims = async () => {
      const userClaims = await getUserClaims();
      if (!mounted) return;
      setClaims(userClaims.sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt)));
    };

    loadClaims();

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/20 border-green-700 text-green-300';
      case 'pending':
        return 'bg-yellow-900/20 border-yellow-700 text-yellow-300';
      case 'rejected':
        return 'bg-red-900/20 border-red-700 text-red-300';
      default:
        return 'bg-blue-900/20 border-blue-700 text-blue-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'pending':
        return <Clock className="text-yellow-400" size={24} />;
      case 'rejected':
        return <AlertCircle className="text-red-400" size={24} />;
      default:
        return <Zap className="text-blue-400" size={24} />;
    }
  };

  const getReasonEmoji = (reason) => {
    if (reason.includes('Rain')) return '🌧️';
    if (reason.includes('Heat')) return '🔥';
    if (reason.includes('Air')) return '😷';
    if (reason.includes('Wind')) return '💨';
    return '⚠️';
  };

  const totalApproved = claims
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-950 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Claims Status</h1>
        <p className="text-green-200">Your auto-approved weather-based payouts 💚</p>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mt-6 space-y-4">
        {/* Total Approved */}
        <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-200 text-sm mb-2">Total Approved</p>
              <h2 className="text-white text-4xl font-bold">₹{totalApproved.toLocaleString()}</h2>
              <p className="text-green-300 text-xs mt-2">{claims.filter(c => c.status === 'approved').length} claims approved</p>
            </div>
            <div className="bg-green-600 rounded-full p-4">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Total Claims</p>
            <h3 className="text-white text-2xl font-bold">{claims.length}</h3>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 text-center">
            <p className="text-green-300 text-xs mb-1">Approved</p>
            <h3 className="text-green-400 text-2xl font-bold">
              {claims.filter(c => c.status === 'approved').length}
            </h3>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-4 text-center">
            <p className="text-yellow-300 text-xs mb-1">Pending</p>
            <h3 className="text-yellow-400 text-2xl font-bold">
              {claims.filter(c => c.status === 'pending').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="px-6 py-6">
        <h3 className="text-white font-semibold text-lg mb-4">All Claims</h3>
        
        {claims.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <AlertCircle className="text-gray-600 mx-auto mb-4 opacity-50" size={40} />
            <p className="text-gray-400 mb-2">No claims yet</p>
            <p className="text-gray-500 text-sm">
              Weather-triggered claims will appear here automatically
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className={`border rounded-2xl p-6 ${getStatusColor(claim.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(claim.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-base">
                          {getReasonEmoji(claim.reason)} {claim.reason}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(claim.approvedAt).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-xl">
                          +₹{claim.amount}
                        </p>
                        <p className="text-xs capitalize opacity-70 mt-1">
                          {claim.status}
                        </p>
                      </div>
                    </div>

                    {/* Claim Details */}
                    <div className="bg-black/20 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Claim ID:</span>
                        <span className="text-gray-300 font-mono text-xs">{claim.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Triggered At:</span>
                        <span className="text-gray-300">
                          {new Date(claim.approvedAt).toLocaleTimeString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Trigger Type:</span>
                        <span className="text-gray-300 capitalize">{claim.triggerType || 'weather'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Payout Status:</span>
                        <span className={claim.payoutStatus === 'credited' ? 'text-green-300 font-semibold' : 'text-yellow-300 font-semibold'}>
                          {claim.payoutStatus || 'pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Fraud Score:</span>
                        <span className={(claim.fraudScore || 0) < 50 ? 'text-green-300 font-semibold' : 'text-orange-300 font-semibold'}>
                          {claim.fraudScore ?? 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Payment TX:</span>
                        <span className="text-gray-300 font-mono text-xs">{claim.payoutTransactionId || '-'}</span>
                      </div>
                      {claim.status === 'approved' && claim.payoutAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Payout At:</span>
                          <span className="text-green-300 font-semibold">
                            {new Date(claim.payoutAt).toLocaleTimeString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it Works Info */}
      {claims.length > 0 && (
        <div className="px-6 py-6">
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-2xl p-4">
            <h4 className="text-blue-300 font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap size={16} />
              How Auto-Claims Work
            </h4>
            <ol className="space-y-2 text-blue-200 text-xs">
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">1.</span>
                <span>We monitor weather 24/7 in your location</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">2.</span>
                <span>Heavy rain, heat, or pollution detected</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">3.</span>
                <span>Claim is auto-triggered (no paperwork!)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">4.</span>
                <span>Approved instantly ✅</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">5.</span>
                <span>Payout within 2 hours to your UPI</span>
              </li>
            </ol>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
