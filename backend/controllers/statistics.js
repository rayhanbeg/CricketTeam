import Player from "../models/Player.js"
import Match from "../models/Match.js"

// @desc    Get team statistics
// @route   GET /api/statistics/team
// @access  Public
export const getTeamStatistics = async (req, res) => {
  try {
    // Get all matches
    const matches = await Match.find()

    // Calculate team statistics
    const totalMatches = matches.length
    const wins = matches.filter((match) => match.result === "Won").length
    const losses = matches.filter((match) => match.result === "Lost").length
    const draws = matches.filter((match) => match.result === "Draw").length

    // Calculate win percentage based on wins, losses, and draws
    const winPercentage = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(2) : 0

    // Get recent form (last 5 matches)
    const recentMatches = matches.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    const recentForm = recentMatches.map((match) => match.result)

    // Calculate home and away record
    const homeMatches = matches.filter((match) => match.venue.toLowerCase().includes("home"))
    const awayMatches = matches.filter((match) => !match.venue.toLowerCase().includes("home"))

    const homeWins = homeMatches.filter((match) => match.result === "Won").length
    const homeLosses = homeMatches.filter((match) => match.result === "Lost").length
    const homeDraws = homeMatches.filter((match) => match.result === "Draw").length

    const awayWins = awayMatches.filter((match) => match.result === "Won").length
    const awayLosses = awayMatches.filter((match) => match.result === "Lost").length
    const awayDraws = awayMatches.filter((match) => match.result === "Draw").length

    // Calculate home and away win percentages
    const homeWinPercentage = homeMatches.length > 0 ? ((homeWins / homeMatches.length) * 100).toFixed(2) : 0
    const awayWinPercentage = awayMatches.length > 0 ? ((awayWins / awayMatches.length) * 100).toFixed(2) : 0

    // Get top performers
    const players = await Player.find()

    // Handle case when no players exist
    const topBatsmen =
      players.length > 0 ? [...players].sort((a, b) => (b.stats?.runs || 0) - (a.stats?.runs || 0)).slice(0, 5) : []

    const topBowlers =
      players.length > 0
        ? [...players].sort((a, b) => (b.stats?.wickets || 0) - (a.stats?.wickets || 0)).slice(0, 5)
        : []

    const teamStats = {
      overall: {
        matches: totalMatches,
        wins,
        losses,
        draws,
        winPercentage,
      },
      home: {
        matches: homeMatches.length,
        wins: homeWins,
        losses: homeLosses,
        draws: homeDraws,
        winPercentage: homeWinPercentage,
      },
      away: {
        matches: awayMatches.length,
        wins: awayWins,
        losses: awayLosses,
        draws: awayDraws,
        winPercentage: awayWinPercentage,
      },
      recentForm,
      topBatsmen: topBatsmen.map((player) => ({
        id: player._id,
        name: player.name,
        runs: player.stats?.runs || 0,
        average: player.stats?.average || 0,
        strikeRate: player.stats?.strikeRate || 0,
        highestScore: player.stats?.highestScore || "0",
      })),
      topBowlers: topBowlers.map((player) => ({
        id: player._id,
        name: player.name,
        wickets: player.stats?.wickets || 0,
        economy: player.stats?.economy || 0,
        average: player.stats?.average || 0,
        bestFigures: player.stats?.bestFigures || "0/0",
      })),
    }

    res.status(200).json({ success: true, data: teamStats })
  } catch (err) {
    console.error("Statistics error:", err.message)
    // Return a default structure instead of throwing an error
    res.status(200).json({
      success: true,
      data: {
        overall: { matches: 0, wins: 0, losses: 0, draws: 0, winPercentage: "0.00" },
        home: { matches: 0, wins: 0, losses: 0, draws: 0, winPercentage: "0.00" },
        away: { matches: 0, wins: 0, losses: 0, draws: 0, winPercentage: "0.00" },
        recentForm: [],
        topBatsmen: [],
        topBowlers: [],
      },
    })
  }
}

// @desc    Update player statistics
// @route   PUT /api/statistics/player/:id
// @access  Private/Admin
export const updatePlayerStatistics = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)

    if (!player) {
      return res.status(404).json({ message: "Player not found" })
    }

    // Update player stats
    player.stats = {
      ...player.stats,
      ...req.body,
    }

    // Calculate derived statistics if needed
    if (player.stats.matches > 0) {
      // Calculate batting average if runs and matches are provided
      if (req.body.runs !== undefined) {
        player.stats.average = (player.stats.runs / player.stats.matches).toFixed(2)
      }

      // Calculate bowling average if wickets are provided
      if (req.body.wickets !== undefined && player.stats.wickets > 0) {
        player.stats.economy = (player.stats.runs / player.stats.wickets / player.stats.matches).toFixed(2)
      }
    }

    await player.save()

    res.status(200).json({ success: true, data: player })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update team statistics manually (for historical data)
// @route   POST /api/statistics/team/manual
// @access  Private/Admin
export const updateTeamStatisticsManually = async (req, res) => {
  try {
    const { matchData } = req.body

    if (!matchData) {
      return res.status(400).json({ message: "Match data is required" })
    }

    // Create a new match with the provided data
    const match = await Match.create(matchData)

    // Update player statistics if player performances are included
    if (matchData.playerPerformances && matchData.playerPerformances.length > 0) {
      for (const performance of matchData.playerPerformances) {
        if (!performance.player) continue

        const player = await Player.findById(performance.player)

        if (player) {
          // Initialize stats object if it doesn't exist
          player.stats = player.stats || {}

          // Update matches played
          player.stats.matches = (player.stats.matches || 0) + 1

          // Update runs if provided
          if (performance.runs) {
            player.stats.runs = (player.stats.runs || 0) + performance.runs

            // Update highest score if applicable
            const currentHighest = Number.parseInt(player.stats.highestScore || "0")
            if (performance.runs > currentHighest) {
              player.stats.highestScore = performance.runs.toString()
            }

            // Update fifties and hundreds
            if (performance.runs >= 100) {
              player.stats.hundreds = (player.stats.hundreds || 0) + 1
            } else if (performance.runs >= 50) {
              player.stats.fifties = (player.stats.fifties || 0) + 1
            }
          }

          // Update wickets if provided
          if (performance.wickets) {
            player.stats.wickets = (player.stats.wickets || 0) + performance.wickets

            // Update best figures if applicable
            const currentBestStr = player.stats.bestFigures || "0/0"
            const currentBest = currentBestStr.split("/").map(Number)
            const currentBestWickets = currentBest[0] || 0
            const currentBestRuns = currentBest[1] || 0

            if (
              performance.wickets > currentBestWickets ||
              (performance.wickets === currentBestWickets && performance.runsConceded < currentBestRuns)
            ) {
              player.stats.bestFigures = `${performance.wickets}/${performance.runsConceded || 0}`
            }

            // Update five wicket hauls
            if (performance.wickets >= 5) {
              player.stats.fiveWickets = (player.stats.fiveWickets || 0) + 1
            }
          }

          // Calculate averages
          if (player.stats.matches > 0) {
            player.stats.average = (player.stats.runs / player.stats.matches).toFixed(2)

            if (player.stats.wickets > 0) {
              player.stats.economy = (player.stats.runs / player.stats.wickets / player.stats.matches).toFixed(2)
            }
          }

          await player.save()
        }
      }
    }

    res.status(201).json({ success: true, data: match })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get player statistics
// @route   GET /api/statistics/player/:id
// @access  Public
export const getPlayerStatistics = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)

    if (!player) {
      return res.status(404).json({ message: "Player not found" })
    }

    // Get player's match performances
    const matches = await Match.find({
      "playerPerformances.player": player._id,
    }).sort({ date: -1 })

    const performances = matches.map((match) => {
      const playerPerf = match.playerPerformances.find((p) => p.player.toString() === player._id.toString())

      return {
        matchId: match._id,
        date: match.date,
        opponent: match.opponent,
        result: match.result,
        runs: playerPerf?.runs || 0,
        wickets: playerPerf?.wickets || 0,
        catches: playerPerf?.catches || 0,
        runouts: playerPerf?.runouts || 0,
      }
    })

    // Calculate form (last 5 matches)
    const recentForm = performances.slice(0, 5)

    // Calculate trends
    const runsTrend = calculateTrend(performances.map((p) => p.runs))
    const wicketsTrend = calculateTrend(performances.map((p) => p.wickets))

    const playerStats = {
      player: {
        id: player._id,
        name: player.name,
        role: player.role,
        jerseyNumber: player.jerseyNumber,
        imageUrl: player.imageUrl,
      },
      stats: player.stats,
      performances,
      recentForm,
      trends: {
        runs: runsTrend,
        wickets: wicketsTrend,
      },
    }

    res.status(200).json({ success: true, data: playerStats })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Helper function to calculate trend (positive or negative)
const calculateTrend = (values) => {
  if (values.length < 2) return 0

  const recentValues = values.slice(0, 3)
  const olderValues = values.slice(3, 6)

  const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length
  const olderAvg =
    olderValues.length > 0 ? olderValues.reduce((sum, val) => sum + val, 0) / olderValues.length : recentAvg

  return recentAvg - olderAvg
}
