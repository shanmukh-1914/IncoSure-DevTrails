import { CheckCircle2, Shield, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useNavigate } from 'react-router';
import { activateInsurancePlan, getCurrentUser, getActivePlan } from '../services/authService';
import { useState, useEffect } from 'react';
import { calculateWeeklyPremium } from '../services/premiumEngine';

export function InsurancePlanScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [activePlan, setActivePlan] = useState(getActivePlan());
  const [loading, setLoading] = useState(false);
  const [premiumQuote, setPremiumQuote] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setActivePlan(getActivePlan());
    setPremiumQuote(calculateWeeklyPremium({ user: currentUser }));
  }, []);

  const plan = {
    type: 'weekly',
    name: 'Weekly Income Shield',
    premium: premiumQuote?.weeklyPremium || 50,
    duration: '7 days',
    coverage: 'Income loss only',
    payoutAmount: 600,
    features: [
      'Auto-triggered income-loss claims',
      'Dynamic risk-based weekly pricing',
      'No paperwork claims',
      'Payout simulation in under 2 hours'
    ],
    color: 'from-blue-900 to-blue-950',
    borderColor: 'border-blue-700'
  };

  const handleActivatePlan = async (planType) => {
    setLoading(true);
    try {
      const result = await activateInsurancePlan(planType);
      if (result.success) {
        setActivePlan(result.user.insurancePlan);
        setTimeout(() => {
          navigate('/analytics');
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const isPlanTypeActive = (planType) => {
    return activePlan?.type === planType;
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Insurance Plans</h1>
        <p className="text-blue-200">Protect your income, stay secure 🛡️</p>
      </div>

      {/* Active Plan Status */}
      {activePlan && (
        <div className="px-6 mt-6 mb-6">
          <div className="bg-green-900/30 border border-green-700 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-green-300 font-semibold">Active Plan ✅</h3>
              <p className="text-green-200 text-sm mt-1">
                Your weekly income-loss plan is active
              </p>
              <p className="text-white text-sm mt-1">Weekly Premium: ₹{activePlan.premium}</p>
              <p className="text-green-300 text-xs mt-2">
                Expires: {new Date(activePlan.expiresAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Card */}
      <div className="px-6 py-6 space-y-4">
        <div
          className={`relative bg-gradient-to-br ${plan.color} border ${plan.borderColor} rounded-3xl p-6 overflow-hidden transition-all ${
            isPlanTypeActive(plan.type) ? 'ring-2 ring-green-500' : ''
          }`}
        >

          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-white text-2xl font-bold">{plan.name}</h2>
                <p className="text-gray-300 text-sm">{plan.duration}</p>
              </div>
              <Shield className="text-white/80" size={32} />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-black/20 rounded-2xl p-4">
              <p className="text-gray-400 text-sm mb-1">Weekly Premium</p>
              <h3 className="text-white text-3xl font-bold">₹{plan.premium}</h3>
              <p className="text-gray-400 text-xs mt-1">Recalculated by risk profile</p>
            </div>

            <div className="bg-black/20 rounded-2xl p-4">
              <p className="text-gray-400 text-sm mb-1">Max Payout per Incident</p>
              <h3 className="text-green-400 text-2xl font-bold">₹{plan.payoutAmount}</h3>
            </div>

            <div className="flex items-center gap-3 bg-black/20 rounded-2xl p-4">
              <Clock className="text-blue-400 flex-shrink-0" size={20} />
              <div>
                <p className="text-gray-400 text-sm">{plan.coverage}</p>
                <p className="text-gray-300 text-xs">Weekly renewal, weather-triggered payout only</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 mb-4">
            <h4 className="text-white font-semibold text-sm mb-3">What's Included:</h4>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {premiumQuote?.adjustments?.length > 0 && (
            <div className="bg-black/20 rounded-2xl p-4 mb-6">
              <h4 className="text-white font-semibold text-sm mb-2">Premium Breakdown</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                {premiumQuote.adjustments.map((item) => (
                  <li key={item.factor} className="flex justify-between">
                    <span>{item.factor}</span>
                    <span>{item.delta > 0 ? `+₹${item.delta}` : `-₹${Math.abs(item.delta)}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => handleActivatePlan(plan.type)}
            disabled={loading || isPlanTypeActive(plan.type)}
            className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isPlanTypeActive(plan.type)
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
            } ${loading ? 'opacity-70' : ''}`}
          >
            {isPlanTypeActive(plan.type) ? (
              <>
                <CheckCircle2 size={20} />
                <span>Active</span>
              </>
            ) : (
              <>
                <span>{loading ? 'Processing...' : 'Activate Weekly Policy'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-6 py-6 space-y-4">
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-300 font-semibold text-sm mb-1">How it Works</h4>
            <p className="text-blue-200/80 text-xs">
              Weather conditions trigger auto-payouts. No claims needed. Money credited to your UPI within 2 hours.
            </p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-4 flex gap-3">
          <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-green-300 font-semibold text-sm mb-1">Income Loss Scope</h4>
            <p className="text-green-200/80 text-xs">
              This policy only protects delivery income loss due to disruptions, not health, vehicle, or accident losses.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
