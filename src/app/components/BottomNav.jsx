import { Home, Activity, Shield, BarChart3, CheckCircle, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { getCurrentUser } from "../services/authService";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/insurance-plans", icon: Shield, label: "Plans" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/claims", icon: CheckCircle, label: "Claims" },
    { path: "/profile", icon: User, label: "Profile" }
  ];

  if (user?.role === "admin") {
    navItems.splice(4, 0, { path: "/admin", icon: Activity, label: "Admin" });
  }


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive ?
              "text-blue-500" :
              "text-gray-400 hover:text-gray-200"}`
              }>
              
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </button>);

        })}
      </div>
    </nav>);

}
