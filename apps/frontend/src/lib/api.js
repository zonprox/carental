/**
 * API Utility Functions
 * Centralized API communication with error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  return data
}

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: getAuthHeaders(),
      ...options
    }
    
    const response = await fetch(url, config)
    return await handleResponse(response)
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

/**
 * User API endpoints
 */
export const userAPI = {
  // Get all users
  getAll: async () => {
    return await apiRequest('/users', { method: 'GET' })
  },
  
  // Get user by ID
  getById: async (id) => {
    return await apiRequest(`/users/${id}`, { method: 'GET' })
  },
  
  // Create new user
  create: async (userData) => {
    return await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },
  
  // Update user
  update: async (id, userData) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },
  
  // Delete user
  delete: async (id) => {
    return await apiRequest(`/users/${id}`, { method: 'DELETE' })
  }
}

/**
 * Auth API endpoints
 */
export const authAPI = {
  // Login
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },
  
  // Register
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },
  
  // Verify token
  verify: async () => {
    return await apiRequest('/auth/verify', { method: 'GET' })
  }
}

/**
 * Car API endpoints
 */
export const carAPI = {
  // Get all cars
  getAll: async () => {
    return await apiRequest('/cars', { method: 'GET' })
  },
  
  // Get car by ID
  getById: async (id) => {
    return await apiRequest(`/cars/${id}`, { method: 'GET' })
  },
  
  // Create new car
  create: async (carData) => {
    return await apiRequest('/cars', {
      method: 'POST',
      body: JSON.stringify(carData)
    })
  },
  
  // Update car
  update: async (id, carData) => {
    return await apiRequest(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData)
    })
  },
  
  // Delete car
  delete: async (id) => {
    return await apiRequest(`/cars/${id}`, { method: 'DELETE' })
  }
}

export default {
  userAPI,
  authAPI,
  carAPI
}

