import { AlertTriangle, AlertCircle, Cloud, Flame, Wind, X, Bell } from 'lucide-react';

export function AlertNotification({ alerts, onDismiss, onMarkRead }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'rain':
        return <Cloud className="text-blue-500" size={20} />;
      case 'heat':
        return <Flame className="text-red-500" size={20} />;
      case 'aqi':
        return <AlertCircle className="text-purple-500" size={20} />;
      case 'wind':
        return <Wind className="text-cyan-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/30 border-red-700';
      case 'high':
        return 'bg-orange-900/30 border-orange-700';
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-700';
      default:
        return 'bg-blue-900/30 border-blue-700';
    }
  };

  const recentAlerts = alerts.slice(0, 3); // Show top 3 alerts

  return (
    <div className="px-6 py-4 space-y-3">
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Bell size={20} className="text-orange-500" />
        Active Weather Alerts
      </h3>

      {recentAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-2xl p-4 ${getAlertColor(alert.severity)}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getAlertIcon(alert.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {alert.reason}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    {alert.message}
                  </p>
                  
                  {alert.payoutAmount && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-green-400 text-xs font-semibold">
                        Payout: ₹{alert.payoutAmount}
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {alerts.length > 3 && (
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            +{alerts.length - 3} more alerts
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Toast-style alert notification (for real-time alerts)
 */
export function AlertToast({ alert, onDismiss }) {
  if (!alert) return null;

  const getToastColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 border-red-700';
      case 'high':
        return 'bg-orange-600 border-orange-700';
      case 'medium':
        return 'bg-yellow-600 border-yellow-700';
      default:
        return 'bg-blue-600 border-blue-700';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm border ${getToastColor(
        alert.severity
      )} rounded-lg p-4 shadow-lg animate-slide-in-up z-50 max-w-xs`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {alert.type === 'rain' && <Cloud className="text-white" size={20} />}
          {alert.type === 'heat' && <Flame className="text-white" size={20} />}
          {alert.type === 'aqi' && <AlertCircle className="text-white" size={20} />}
          {alert.type === 'wind' && <Wind className="text-white" size={20} />}
        </div>

        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">
            {alert.reason}
          </h4>
          <p className="text-white/90 text-xs mt-1">
            {alert.message}
          </p>
          {alert.payoutAmount && (
            <p className="text-white/80 text-xs mt-2">
              Payout: ₹{alert.payoutAmount}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="text-white/70 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
