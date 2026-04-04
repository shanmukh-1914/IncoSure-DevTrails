import { User, Bike, CreditCard, Phone, Mail, ChevronRight, LogOut, Shield } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useNavigate } from "react-router";
import { getCurrentUser, logout } from "../services/authService";

export function ProfileScreen() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const profileData = {
    name: user?.name || "Demo User",
    phone: "+91 98765 43210",
    email: user?.email || "demo@example.com",
    age: "26",
    location: user?.location || "Vijayawada",
    deliveryPlatform: user?.deliveryType || "Swiggy",
    upiId: "ravi@paytm",
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "January 2026"
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950 to-gray-900 px-6 pt-8 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-400 text-sm">Member since {profileData.memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-6 py-6 space-y-4">
        {/* Personal Info Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Personal Information</h3>
          </div>
          
          <div className="divide-y divide-gray-800">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Age</p>
                  <p className="text-white">{profileData.age} years</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{profileData.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{profileData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Platform */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Work Details</h3>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bike size={20} className="text-orange-500" />
              <div>
                <p className="text-gray-400 text-sm">Delivery Platform</p>
                <p className="text-white font-semibold">{profileData.deliveryPlatform}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-600" />
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div>
              <p className="text-gray-400 text-sm">Working Zone</p>
              <p className="text-white font-semibold">{user?.workingZone || "Zone 1"}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Payment Details</h3>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">UPI ID</p>
                <p className="text-white font-mono">{profileData.upiId}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-600" />
          </div>
        </div>

        {/* Coverage Settings */}
        <button
          onClick={() => navigate("/coverage-settings")}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-blue-500" />
            <span className="text-white">Coverage Settings</span>
          </div>
          <ChevronRight size={20} className="text-gray-600" />
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full bg-red-900/30 border border-red-700 rounded-xl px-6 py-4 flex items-center justify-center gap-3 hover:bg-red-900/50 transition-colors">
          
          <LogOut size={20} className="text-red-500" />
          <span className="text-red-500 font-semibold">Logout</span>
        </button>
      </div>

      <BottomNav />
    </div>);

}
