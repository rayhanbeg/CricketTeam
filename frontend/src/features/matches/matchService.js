import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL + "/api/matches/"

// Get all matches
const getMatches = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data.data
  } catch (error) {
    console.error("Error fetching matches:", error.response?.data || error.message)
    throw error
  }
}

// Get match by ID
const getMatchById = async (matchId) => {
  try {
    const response = await axios.get(API_URL + matchId)
    return response.data.data
  } catch (error) {
    console.error("Error fetching match:", error.response?.data || error.message)
    throw error
  }
}

// Create new match
const createMatch = async (matchData, token) => {
  try {
    console.log("Creating match with data:", matchData)

    // Ensure token is valid
    if (!token) {
      throw new Error("Authentication token is missing")
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }

    // Ensure the data is properly formatted
    const formattedData = {
      ...matchData,
      // Check if playerPerformances exists before mapping
      playerPerformances: matchData.playerPerformances
        ? matchData.playerPerformances.map((perf) => ({
            player: typeof perf.player === "object" ? perf.player._id : perf.player,
            runs: Number(perf.runs) || 0,
            wickets: Number(perf.wickets) || 0,
            catches: Number(perf.catches) || 0,
            runouts: Number(perf.runouts) || 0,
          }))
        : [], // Default to empty array if undefined
    }

    console.log("Sending formatted data:", formattedData)

    const response = await axios.post(API_URL, formattedData, config)
    console.log("Match created successfully:", response.data)
    return response.data.data
  } catch (error) {
    console.error("Error creating match:", error)
    console.error("Error details:", error.response?.data || error.message)
    throw error
  }
}

// Update match
const updateMatch = async (matchId, matchData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing")
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }

    // Ensure the data is properly formatted
    const formattedData = {
      ...matchData,
      // Check if playerPerformances exists before mapping
      playerPerformances: matchData.playerPerformances
        ? matchData.playerPerformances.map((perf) => ({
            player: typeof perf.player === "object" ? perf.player._id : perf.player,
            runs: Number(perf.runs) || 0,
            wickets: Number(perf.wickets) || 0,
            catches: Number(perf.catches) || 0,
            runouts: Number(perf.runouts) || 0,
          }))
        : [], // Default to empty array if undefined
    }

    const response = await axios.put(API_URL + matchId, formattedData, config)
    return response.data.data
  } catch (error) {
    console.error("Error updating match:", error.response?.data || error.message)
    throw error
  }
}

// Delete match
const deleteMatch = async (matchId, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing")
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.delete(API_URL + matchId, config)
    return response.data
  } catch (error) {
    console.error("Error deleting match:", error.response?.data || error.message)
    throw error
  }
}

const matchService = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
}

export default matchService
