import axios from "axios"

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL + "/api/auth/"

// Helper function to save user data in localStorage
const saveUserToLocalStorage = (data) => {
  // Create user object with token
  const userWithToken = {
    ...data.user,
    token: data.token,
  }
  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(userWithToken))
}

// Register user
const register = async (userData) => {
  try {
    // Send POST request to register endpoint
    const response = await axios.post(API_URL + "register", userData)

    // Save user data if token and user are returned
    if (response.data?.token && response.data?.user) {
      saveUserToLocalStorage(response.data)
    }

    return response.data
  } catch (error) {
    // Log error and throw it
    console.error("Registration error:", error.response?.data || error.message)
    throw error
  }
}

// Login user
const login = async (userData) => {
  try {
    // Send POST request to login endpoint
    const response = await axios.post(API_URL + "login", userData)

    // Save user data if token and user are returned
    if (response.data?.token && response.data?.user) {
      // Create user object with token
      const userWithToken = {
        ...response.data.user,
        token: response.data.token,
      }
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userWithToken))
    }

    return response.data
  } catch (error) {
    // Log error and throw it
    console.error("Login error:", error.response?.data || error.message)
    throw error
  }
}

// Get all users (admin only)
const getUsers = async (token) => {
  try {
    // Set headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    // Send GET request to users endpoint
    const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users", config)
    return response.data
  } catch (error) {
    // Log error and throw it
    console.error("Error fetching users:", error.response?.data || error.message)
    throw error
  }
}

// Logout user
const logout = () => {
  // Remove user from localStorage
  localStorage.removeItem("user")
}

// Load current user info
const loadUser = async (token) => {
  try {
    // Set headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    // Send GET request to me endpoint
    const response = await axios.get(API_URL + "me", config)
    return response.data.data
  } catch (error) {
    // Log error and throw it
    console.error("Error loading user:", error.response?.data || error.message)
    throw error
  }
}

// Export all functions
const authService = {
  register,
  login,
  logout,
  loadUser,
  getUsers,
}

export default authService
