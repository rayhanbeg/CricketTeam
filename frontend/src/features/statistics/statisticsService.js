import axios from "axios"

const API_URL = "/api/statistics/"

// Get team statistics
const getTeamStatistics = async () => {
  try {
    const response = await axios.get(API_URL + "team")
    return response.data.data
  } catch (error) {
    console.error("Error fetching team statistics:", error.response?.data || error.message)
    // Return default structure instead of throwing
    return {
      overall: { matches: 0, wins: 0, losses: 0, draws: 0, winPercentage: "0.00" },
      home: { matches: 0, wins: 0, losses: 0, draws: 0, winPercentage: "0.00" },
      away: { matches: 0, wins: 0, losses: 0, draws: 0, winPercentage: "0.00" },
      recentForm: [],
      topBatsmen: [],
      topBowlers: [],
    }
  }
}

// Get player statistics
const getPlayerStatistics = async (playerId) => {
  try {
    const response = await axios.get(API_URL + "player/" + playerId)
    return response.data.data
  } catch (error) {
    console.error("Error fetching player statistics:", error.response?.data || error.message)
    throw error
  }
}

// Update player statistics
const updatePlayerStatistics = async (playerId, statsData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.put(API_URL + "player/" + playerId, statsData, config)
    return response.data.data
  } catch (error) {
    console.error("Error updating player statistics:", error.response?.data || error.message)
    throw error
  }
}

// Add manual team statistics
const addManualTeamStatistics = async (matchData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    // Ensure the data is properly formatted
    const formattedData = {
      matchData: {
        ...matchData,
        playerPerformances: matchData.playerPerformances.map((perf) => ({
          player: typeof perf.player === "object" ? perf.player._id : perf.player,
          runs: Number(perf.runs) || 0,
          wickets: Number(perf.wickets) || 0,
          catches: Number(perf.catches) || 0,
          runouts: Number(perf.runouts) || 0,
        })),
      },
    }

    const response = await axios.post(API_URL + "team/manual", formattedData, config)
    return response.data.data
  } catch (error) {
    console.error("Error adding manual team statistics:", error.response?.data || error.message)
    throw error
  }
}

const statisticsService = {
  getTeamStatistics,
  getPlayerStatistics,
  updatePlayerStatistics,
  addManualTeamStatistics,
}

export default statisticsService
