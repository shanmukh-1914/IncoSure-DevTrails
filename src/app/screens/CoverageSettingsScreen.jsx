import { useMemo, useState } from "react";
import { ArrowLeft, Save, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { getCurrentUser } from "../services/authService";
import { getCoverageSettingsForUser, updateCoverageSettingsForUser } from "../services/coverageSettingsService";

const TRIGGER_LABELS = {
  "heavy-rain": "Heavy Rain",
  "extreme-heat": "Extreme Heat",
  "high-pollution": "High Pollution",
  "high-wind": "High Wind",
  "traffic-gridlock": "Traffic Gridlock",
  "platform-outage": "Platform Outage",
  "curfew-restriction": "Curfew Restriction"
};

export function CoverageSettingsScreen() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const initial = useMemo(() => getCoverageSettingsForUser(user?.id), [user?.id]);

  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setSaved(false);
    setSettings((previous) => ({ ...previous, [field]: value }));
  };

  const updateTrigger = (triggerType, value) => {
    setSaved(false);
    setSettings((previous) => ({
      ...previous,
      coveredTriggerTypes: {
        ...previous.coveredTriggerTypes,
        [triggerType]: value
      }
    }));
  };

  const saveSettings = () => {
    const result = updateCoverageSettingsForUser(user?.id, settings);
    if (result.success) {
      setSaved(true);
      setSettings(result.settings);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="bg-gradient-to-br from-blue-950 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-white">Coverage Settings</h1>
        <p className="text-blue-200 text-sm mt-1">Control automation, triggers, and payout limits</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">Automation Controls</h3>

          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Trigger Monitoring</span>
            <input
              type="checkbox"
              checked={settings.triggerMonitoringEnabled}
              onChange={(event) => updateField("triggerMonitoringEnabled", event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Auto Claim Creation</span>
            <input
              type="checkbox"
              checked={settings.autoClaimEnabled}
              onChange={(event) => updateField("autoClaimEnabled", event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Instant Payout</span>
            <input
              type="checkbox"
              checked={settings.instantPayoutEnabled}
              onChange={(event) => updateField("instantPayoutEnabled", event.target.checked)}
            />
          </label>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">Coverage Limits</h3>

          <div>
            <label className="text-gray-300 text-sm">Max payout per claim</label>
            <select
              value={settings.maxPayoutPerClaim}
              onChange={(event) => updateField("maxPayoutPerClaim", Number(event.target.value))}
              className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value={300}>₹300</option>
              <option value={400}>₹400</option>
              <option value={500}>₹500</option>
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm">Weekly coverage cap</label>
            <select
              value={settings.weeklyCoverageCap}
              onChange={(event) => updateField("weeklyCoverageCap", Number(event.target.value))}
              className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value={1500}>₹1,500</option>
              <option value={2500}>₹2,500</option>
              <option value={4000}>₹4,000</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-semibold">Covered Disruptions</h3>
          {Object.entries(TRIGGER_LABELS).map(([type, label]) => (
            <label key={type} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{label}</span>
              <input
                type="checkbox"
                checked={settings.coveredTriggerTypes?.[type] ?? true}
                onChange={(event) => updateTrigger(type, event.target.checked)}
              />
            </label>
          ))}
        </div>

        <button
          onClick={saveSettings}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Coverage Settings
        </button>

        {saved && (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-3 text-green-300 text-sm flex items-center gap-2">
            <Shield size={16} />
            Coverage settings updated successfully.
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
