import axios from "axios"

const API_URL = "https://cricket-team-backend.vercel.app/api/players/"

// Get all players
const getPlayers = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data.data
  } catch (error) {
    console.error("Error fetching players:", error.response?.data || error.message)
    throw error
  }
}

// Get player by ID
const getPlayerById = async (playerId) => {
  try {
    const response = await axios.get(API_URL + playerId)
    return response.data.data
  } catch (error) {
    console.error("Error fetching player:", error.response?.data || error.message)
    throw error
  }
}

// Create new player
const createPlayer = async (playerData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post(API_URL, playerData, config)
    return response.data.data
  } catch (error) {
    console.error("Error creating player:", error.response?.data || error.message)
    throw error
  }
}

// Update player
const updatePlayer = async (playerId, playerData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.put(API_URL + playerId, playerData, config)
    return response.data.data
  } catch (error) {
    console.error("Error updating player:", error.response?.data || error.message)
    throw error
  }
}

// Delete player
const deletePlayer = async (playerId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.delete(API_URL + playerId, config)
    return response.data
  } catch (error) {
    console.error("Error deleting player:", error.response?.data || error.message)
    throw error
  }
}

// Update player stats
const updatePlayerStats = async (playerId, statsData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.put(API_URL + playerId + "/stats", statsData, config)
    return response.data.data
  } catch (error) {
    console.error("Error updating player stats:", error.response?.data || error.message)
    throw error
  }
}

const playerService = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerStats,
}

export default playerService
