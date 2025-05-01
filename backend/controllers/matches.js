import Match from "../models/Match.js"
import Player from "../models/Player.js"

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 }).populate("playerPerformances.player", "name role")
    res.status(200).json({ success: true, count: matches.length, data: matches })
  } catch (err) {
    console.error("Error getting matches:", err.message)
    res.status(500).json({ success: false, message: "Server error", error: err.message })
  }
}

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
export const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate("playerPerformances.player", "name role")

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" })
    }

    res.status(200).json({ success: true, data: match })
  } catch (err) {
    console.error("Error getting match:", err.message)
    res.status(500).json({ success: false, message: "Server error", error: err.message })
  }
}

// @desc    Create new match
// @route   POST /api/matches
// @access  Private/Admin
export const createMatch = async (req, res) => {
  try {
    console.log("Creating match with data:", req.body)

    // Basic validation
    if (
      !req.body.date ||
      !req.body.opponent ||
      !req.body.format ||
      !req.body.result ||
      !req.body.score ||
      !req.body.venue
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
        missingFields: {
          date: !req.body.date,
          opponent: !req.body.opponent,
          format: !req.body.format,
          result: !req.body.result,
          score: !req.body.score,
          venue: !req.body.venue,
        },
      })
    }

    // Create match with clean data
    const matchData = {
      date: req.body.date,
      opponent: req.body.opponent,
      format: req.body.format,
      result: req.body.result,
      score: req.body.score,
      venue: req.body.venue,
      playerPerformances: req.body.playerPerformances || [],
    }

    console.log("Creating match with cleaned data:", matchData)
    const match = await Match.create(matchData)
    console.log("Match created:", match)

    // Update player stats if player performances are provided
    if (req.body.playerPerformances && req.body.playerPerformances.length > 0) {
      for (const performance of req.body.playerPerformances) {
        if (!performance.player) {
          console.log("Skipping performance without player ID")
          continue
        }

        try {
          const player = await Player.findById(performance.player)

          if (player) {
            // Initialize stats object if it doesn't exist
            player.stats = player.stats || {}

            // Update matches played
            player.stats.matches = (player.stats.matches || 0) + 1

            // Update runs if provided
            if (performance.runs) {
              player.stats.runs = (player.stats.runs || 0) + Number(performance.runs)
            }

            // Update wickets if provided
            if (performance.wickets) {
              player.stats.wickets = (player.stats.wickets || 0) + Number(performance.wickets)
            }

            // Initialize recentPerformance array if it doesn't exist
            player.recentPerformance = player.recentPerformance || []

            // Add to recent performance
            player.recentPerformance.unshift({
              match: `vs ${req.body.opponent}`,
              opponent: req.body.opponent,
              date: req.body.date,
              runs: Number(performance.runs) || 0,
              wickets: Number(performance.wickets) || 0,
            })

            // Keep only the 5 most recent performances
            if (player.recentPerformance.length > 5) {
              player.recentPerformance = player.recentPerformance.slice(0, 5)
            }

            await player.save()
            console.log(`Updated stats for player ${player.name}`)
          } else {
            console.log(`Player not found with ID: ${performance.player}`)
          }
        } catch (playerErr) {
          console.error(`Error updating player stats: ${playerErr.message}`)
          // Continue with other players even if one fails
        }
      }
    }

    res.status(201).json({ success: true, data: match })
  } catch (err) {
    console.error("Match creation error:", err)
    res.status(500).json({
      success: false,
      message: "Server error during match creation",
      error: err.message,
    })
  }
}

// @desc    Update match
// @route   PUT /api/matches/:id
// @access  Private/Admin
export const updateMatch = async (req, res) => {
  try {
    let match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" })
    }

    match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, data: match })
  } catch (err) {
    console.error("Error updating match:", err.message)
    res.status(500).json({ success: false, message: "Server error", error: err.message })
  }
}

// @desc    Delete match
// @route   DELETE /api/matches/:id
// @access  Private/Admin
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" })
    }

    await Match.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.error("Error deleting match:", err.message)
    res.status(500).json({ success: false, message: "Server error", error: err.message })
  }
}
