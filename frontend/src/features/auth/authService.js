import axios from "axios"

const API_URL = "https://cricket-team-backend.vercel.app/api/auth/"

// Helper function to save user data in localStorage
const saveUserToLocalStorage = (data) => {
  const userWithToken = {
    ...data.user,
    token: data.token,
  }
  localStorage.setItem("user", JSON.stringify(userWithToken))
}

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData)

    if (response.data?.token && response.data?.user) {
      saveUserToLocalStorage(response.data)
    }

    return response.data
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message)
    throw error
  }
}

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData)

    if (response.data?.token && response.data?.user) {
      const userWithToken = {
        ...response.data.user,
        token: response.data.token,
      }
      localStorage.setItem("user", JSON.stringify(userWithToken))
    }

    return response.data
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message)
    throw error
  }
}

// Get all users (admin only)
const getUsers = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get("/api/users", config)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message)
    throw error
  }
}

// Logout user
const logout = () => {
  localStorage.removeItem("user")
}

// Load current user info
const loadUser = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get(API_URL + "me", config)
    return response.data.data
  } catch (error) {
    console.error("Error loading user:", error.response?.data || error.message)
    throw error
  }
}

const authService = {
  register,
  login,
  logout,
  loadUser,
  getUsers,
}

export default authService
