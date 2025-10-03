/**
 * API Utility Functions
 * Centralized API communication with error handling
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Handle logout and redirect to login
 */
const handleLogout = () => {
  // Clear authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirect to login page
  window.location.href = "/login";
};

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  // Check for authentication errors
  if (response.status === 401 || response.status === 403) {
    // Token is invalid or expired
    console.warn("Authentication failed - redirecting to login");
    handleLogout();
    throw new Error("Authentication failed. Please login again.");
  }

  const data = await response.json();

  if (!response.ok) {
    // Check if the error message indicates token issues
    if (
      data.message &&
      (data.message.toLowerCase().includes("invalid token") ||
        data.message.toLowerCase().includes("token expired") ||
        data.message.toLowerCase().includes("unauthorized") ||
        data.message.toLowerCase().includes("access denied"))
    ) {
      console.warn("Token validation failed - redirecting to login");
      handleLogout();
      throw new Error("Session expired. Please login again.");
    }

    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);

    // If it's a network error and we have a token, it might be expired
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      const token = localStorage.getItem("token");
      if (token) {
        console.warn(
          "Network error with token present - checking token validity",
        );
        // Try to verify token
        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: getAuthHeaders(),
          });
          if (!verifyResponse.ok) {
            console.warn("Token verification failed - redirecting to login");
            handleLogout();
            throw new Error("Session expired. Please login again.");
          }
        } catch (_verifyError) {
          console.warn("Token verification error - redirecting to login");
          handleLogout();
          throw new Error("Session expired. Please login again.");
        }
      }
    }

    throw error;
  }
};

/**
 * User API endpoints
 */
export const userAPI = {
  // Get all users
  getAll: async () => {
    return await apiRequest("/users", { method: "GET" });
  },

  // Get user by ID
  getById: async (id) => {
    return await apiRequest(`/users/${id}`, { method: "GET" });
  },

  // Create new user
  create: async (userData) => {
    return await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Update user
  update: async (id, userData) => {
    return await apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  delete: async (id) => {
    return await apiRequest(`/users/${id}`, { method: "DELETE" });
  },
};

/**
 * Auth API endpoints
 */
export const authAPI = {
  // Login
  login: async (email, password) => {
    return await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  register: async (userData) => {
    return await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Verify token
  verify: async () => {
    return await apiRequest("/auth/verify", { method: "GET" });
  },
};

/**
 * Car API endpoints
 */
export const carAPI = {
  // Get all cars
  getAll: async () => {
    return await apiRequest("/cars", { method: "GET" });
  },

  // Get car by ID
  getById: async (id) => {
    return await apiRequest(`/cars/${id}`, { method: "GET" });
  },

  // Create new car
  create: async (carData) => {
    return await apiRequest("/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  },

  // Update car
  update: async (id, carData) => {
    return await apiRequest(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  },

  // Delete car
  delete: async (id) => {
    return await apiRequest(`/cars/${id}`, { method: "DELETE" });
  },
};

export default {
  userAPI,
  authAPI,
  carAPI,
};
