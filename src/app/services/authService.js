/**
 * Authentication Service - Handles user registration, login, and session management
 * Uses localStorage only - no backend API calls
 */

import { calculateWeeklyPremium } from "./premiumEngine";
import { createAutoClaim, getUserClaimsById } from "./claimService";

const USERS_KEY = "app_users";
const CURRENT_USER_KEY = "app_current_user";
const AUTH_TOKEN_KEY = "app_auth_token";
const POLICIES_KEY = "userPolicies";

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requires: at least 6 characters, 1 uppercase, 1 number
 */
export const isValidPassword = (password) => {
  if (password.length < 6) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Get all registered users from localStorage
 */
export const getAllUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

/**
 * Check if user already exists
 */
export const userExists = (email) => {
  const users = getAllUsers();
  return users.some((user) => user.email === email);
};

/**
 * Sign up new user
 */
export const signUp = async (userData) => {
  const { name, email, password, confirmPassword, location, deliveryType, workingZone } = userData;

  // Validation
  if (!name || !email || !password || !confirmPassword || !location || !deliveryType || !workingZone) {
    return { success: false, error: "All fields are required" };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: "Invalid email format" };
  }

  if (!isValidPassword(password)) {
    return {
      success: false,
      error: "Password must be at least 6 characters with 1 uppercase and 1 number"
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  if (userExists(email)) {
    return { success: false, error: "User already exists with this email" };
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // Note: In production, this should be hashed
    role: email.toLowerCase().includes("admin") ? "admin" : "user",
    location,
    deliveryType,
    workingZone,
    createdAt: new Date().toISOString(),
    insurancePlan: null,
    activeCoverageDays: 0,
    earningsProtected: 0,
    lastWeatherCity: location
  };

  // Store user
  const users = getAllUsers();
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Auto-login after signup
  const token = generateToken(newUser);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return { success: true, user: newUser, token };
};

/**
 * Login user
 */
export const login = async (email, password) => {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  if (user.password !== password) {
    return { success: false, error: "Invalid password" };
  }

  // Generate token and store session
  const token = generateToken(user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return { success: true, user, token };
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  return { success: true };
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Generate simple auth token (not secure, for frontend simulation only)
 */
const generateToken = (user) => {
  return btoa(JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() }));
};

/**
 * Update user data
 */
export const updateUser = (updatedData) => {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "No user logged in" };

  const updatedUser = { ...user, ...updatedData };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  // Also update in users list
  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return { success: true, user: updatedUser };
};

/**
 * Activate insurance plan
 */
export const activateInsurancePlan = async (planType) => {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "No user logged in" };

  if (planType !== "weekly") {
    return { success: false, error: "Only weekly pricing is supported in this phase" };
  }

  const premiumQuote = calculateWeeklyPremium({ user });
  const activePlan = {
    id: `pol_${Date.now()}`,
    type: planType,
    premium: premiumQuote.weeklyPremium,
    basePremium: premiumQuote.basePremium,
    premiumBreakdown: premiumQuote.adjustments,
    coverage: "Income loss only",
    weeklyPremium: premiumQuote.weeklyPremium,
    payoutAmount: 600,
    hourlyIncomeProtection: 150,
    activatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active"
  };

  const policies = JSON.parse(localStorage.getItem(POLICIES_KEY) || "[]");
  policies.push({ ...activePlan, userId: user.id });
  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));

  return updateUser({ insurancePlan: activePlan });
};

export const getUserPolicies = () => {
  const user = getCurrentUser();
  if (!user) return [];
  const policies = JSON.parse(localStorage.getItem(POLICIES_KEY) || "[]");
  return policies.filter((policy) => policy.userId === user.id);
};

/**
 * Get active insurance plan
 */
export const getActivePlan = () => {
  const user = getCurrentUser();
  if (!user || !user.insurancePlan) return null;

  const plan = user.insurancePlan;
  const expiresAt = new Date(plan.expiresAt);
  
  if (expiresAt < new Date()) {
    // Plan expired, remove it
    updateUser({ insurancePlan: null });
    return null;
  }

  return plan;
};

/**
 * Simulate claim trigger
 */
export const triggerClaim = (amount, reason) => {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "No user logged in" };

  const plan = getActivePlan();
  if (!plan) return { success: false, error: "No active insurance plan" };

  const result = createAutoClaim({
    user,
    policy: plan,
    trigger: {
      type: "manual-trigger",
      reason,
      fixedAmount: amount,
      hoursLost: 2
    }
  });

  if (!result.success) {
    return result;
  }

  // Update user earnings protected
  const newEarnings = (user.earningsProtected || 0) + result.claim.amount;
  updateUser({ earningsProtected: newEarnings });

  return { success: true, claim: result.claim };
};

/**
 * Get user claims
 */
export const getUserClaims = () => {
  const user = getCurrentUser();
  if (!user) return [];

  return getUserClaimsById(user.id);
};
