import { createBrowserRouter, Navigate } from "react-router";
import { AuthScreen } from "./screens/AuthScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TransactionScreen } from "./screens/TransactionScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { InsurancePlanScreen } from "./screens/InsurancePlanScreen";
import { AnalyticsScreen } from "./screens/AnalyticsScreen";
import { ClaimsScreen } from "./screens/ClaimsScreen";
import { AdminAnalyticsScreen } from "./screens/AdminAnalyticsScreen";
import { CoverageSettingsScreen } from "./screens/CoverageSettingsScreen";
import { getCurrentUser, isAuthenticated } from "./services/authService";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Wrapper components to pass props via routes
const WelcomeScreenRoute = () => <PublicOnlyRoute><AuthScreen mode="welcome" /></PublicOnlyRoute>;
const LoginScreenRoute = () => <PublicOnlyRoute><AuthScreen mode="login" /></PublicOnlyRoute>;
const HomeScreenRoute = () => <ProtectedRoute><DashboardScreen view="home" /></ProtectedRoute>;
const RiskScreenRoute = () => <ProtectedRoute><DashboardScreen view="risk" /></ProtectedRoute>;
const PayoutScreenRoute = () => <ProtectedRoute><TransactionScreen view="payout" /></ProtectedRoute>;
const HistoryScreenRoute = () => <ProtectedRoute><TransactionScreen view="history" /></ProtectedRoute>;
const InsurancePlanRoute = () => <ProtectedRoute><InsurancePlanScreen /></ProtectedRoute>;
const AnalyticsRoute = () => <ProtectedRoute><AnalyticsScreen /></ProtectedRoute>;
const ClaimsRoute = () => <ProtectedRoute><ClaimsScreen /></ProtectedRoute>;
const ProfileRoute = () => <ProtectedRoute><ProfileScreen /></ProtectedRoute>;
const CoverageSettingsRoute = () => <ProtectedRoute><CoverageSettingsScreen /></ProtectedRoute>;
const AdminRoute = () => <AdminProtectedRoute><AdminAnalyticsScreen /></AdminProtectedRoute>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomeScreenRoute
  },
  {
    path: "/login",
    Component: LoginScreenRoute
  },
  {
    path: "/home",
    Component: HomeScreenRoute
  },
  {
    path: "/risk",
    Component: RiskScreenRoute
  },
  {
    path: "/insurance-plans",
    Component: InsurancePlanRoute
  },
  {
    path: "/analytics",
    Component: AnalyticsRoute
  },
  {
    path: "/claims",
    Component: ClaimsRoute
  },
  {
    path: "/profile",
    Component: ProfileRoute
  },
  {
    path: "/coverage-settings",
    Component: CoverageSettingsRoute
  },
  {
    path: "/admin",
    Component: AdminRoute
  }
]);
