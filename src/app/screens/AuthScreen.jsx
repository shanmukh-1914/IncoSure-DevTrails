import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, ArrowRight, Bike, ArrowLeft, User, MapPin, Briefcase } from "lucide-react";
import { login, signUp } from "../services/authService";
import { startJudgeDemoSession } from "../services/demoService";

export function AuthScreen({ mode = "welcome" }) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    deliveryType: "Swiggy",
    workingZone: "Zone 1"
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signUp(formData);
    if (result.success) {
      navigate("/insurance-plans");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleJudgeDemo = async () => {
    setError("");
    setLoading(true);
    const result = await startJudgeDemoSession();
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Unable to start judge demo session");
    }
    setLoading(false);
  };

  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">IncoSure Access</h1>
              <p className="text-gray-400">Sign up and protect weekly gig income</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
              <button
                onClick={() => setAuthMode("login")}
                className={`py-2 rounded-lg text-sm font-semibold ${
                  authMode === "login" ? "bg-blue-600 text-white" : "text-gray-400"
                }`}>
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`py-2 rounded-lg text-sm font-semibold ${
                  authMode === "signup" ? "bg-blue-600 text-white" : "text-gray-400"
                }`}>
                Sign Up
              </button>
            </div>

            <form
              onSubmit={authMode === "login" ? handleLogin : handleSignUp}
              className="bg-gradient-to-br from-blue-900/50 to-gray-900 border border-blue-700 rounded-2xl p-6 space-y-4">
              {authMode === "signup" && (
                <>
                  <div>
                    <label className="text-gray-300 text-sm">Full Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Ravi Kumar"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">Location</label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Vijayawada"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 text-sm">Delivery Type</label>
                      <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                        <option>Swiggy</option>
                        <option>Zomato</option>
                        <option>Amazon</option>
                        <option>Flipkart</option>
                        <option>Dunzo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm">Working Zone</label>
                      <select
                        name="workingZone"
                        value={formData.workingZone}
                        onChange={handleChange}
                        className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                        <option>Zone 1</option>
                        <option>Zone 2</option>
                        <option>Zone 3</option>
                        <option>Zone 5</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-gray-300 text-sm">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="ravi@example.com"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="******"
                />
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="text-gray-300 text-sm">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="******"
                  />
                </div>
              )}

              {error && (
                <p className="text-red-300 text-sm bg-red-900/30 border border-red-700 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <span className="text-lg">
                  {loading
                    ? "Please wait..."
                    : authMode === "login"
                    ? "Login"
                    : "Create Account"}
                </span>
                <ArrowRight size={20} />
              </button>

              <button
                type="button"
                onClick={handleJudgeDemo}
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 px-6 rounded-xl text-sm font-semibold transition-colors">
                Launch 30s Judge Demo
              </button>
            </form>

            <div className="space-y-3 text-left bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <User size={16} className="text-blue-400" />
                <p className="text-white text-sm">Weekly premium is dynamically priced</p>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={16} className="text-orange-400" />
                <p className="text-white text-sm">Coverage is income loss only</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-green-400" />
                <p className="text-white text-sm">Auto-claims are zone validated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-blue-600 rounded-full p-6">
            <Shield size={64} className="text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white">IncoSure</h1>
          <p className="text-xl text-gray-300">Get paid automatically during disruptions</p>
        </div>

        <div className="py-8">
          <div className="w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br from-blue-900/30 to-orange-900/30 border border-blue-700/50 flex items-center justify-center">
            <Bike size={96} className="text-blue-400" />
          </div>
        </div>

        <div className="space-y-3 text-left bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-2 mt-1">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div>
              <p className="text-white">Automatic payouts during bad weather</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-orange-600 rounded-full p-2 mt-1">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div>
              <p className="text-white">Protect your earnings as a delivery partner</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-2 mt-1">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div>
              <p className="text-white">No claims, no paperwork</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-emerald-600 rounded-full p-2 mt-1">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div>
              <p className="text-white">One-click judge demo with pre-seeded live data</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <span className="text-lg">Get Started</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
