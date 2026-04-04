import { useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated } from "../services/authService";

export function SessionLockChip() {
  const [session, setSession] = useState({
    authenticated: isAuthenticated(),
    user: getCurrentUser()
  });

  useEffect(() => {
    const refresh = () => {
      setSession({
        authenticated: isAuthenticated(),
        user: getCurrentUser()
      });
    };

    const interval = setInterval(refresh, 800);
    window.addEventListener("focus", refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (!session.authenticated) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 rounded-full border border-emerald-700 bg-emerald-900/85 px-3 py-1.5 shadow-md backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-100 text-xs font-semibold">Signed in{session.user?.name ? ` • ${session.user.name}` : ""}</span>
      </div>
    </div>
  );
}
