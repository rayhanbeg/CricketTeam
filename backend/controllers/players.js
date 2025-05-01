import Player from "../models/Player.js"
import User from "../models/User.js"
import { validationResult } from "express-validator"

// @desc    Get all players
// @route   GET /api/players
// @access  Public
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate("user", "name email")
    res.status(200).json({ success: true, count: players.length, data: players })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get single player
// @route   GET /api/players/:id
// @access  Public
export const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate("user", "name email")

    if (!player) {
      return res.status(404).json({ message: "Player not found" })
    }

    res.status(200).json({ success: true, data: player })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create new player
// @route   POST /api/players
// @access  Private/Admin
export const createPlayer = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // Check if jersey number is already taken
    const existingPlayer = await Player.findOne({ jerseyNumber: req.body.jerseyNumber })
    if (existingPlayer) {
      return res.status(400).json({ message: "Jersey number is already taken" })
    }

    // If user ID is provided, link player to user
    if (req.body.userId) {
      const user = await User.findById(req.body.userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      req.body.user = req.body.userId
    }

    const player = await Player.create(req.body)

    res.status(201).json({ success: true, data: player })
  } catch (err) {
    console.error(err.message)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value entered" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update player
// @route   PUT /api/players/:id
// @access  Private/Admin
export const updatePlayer = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    let player = await Player.findById(req.params.id)

    if (!player) {
      return res.status(404).json({ message: "Player not found" })
    }

    // Check if jersey number is already taken by another player
    if (req.body.jerseyNumber && req.body.jerseyNumber !== player.jerseyNumber) {
      const existingPlayer = await Player.findOne({ jerseyNumber: req.body.jerseyNumber })
      if (existingPlayer && existingPlayer._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Jersey number is already taken" })
      }
    }

    player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, data: player })
  } catch (err) {
    console.error(err.message)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value entered" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete player
// @route   DELETE /api/players/:id
// @access  Private/Admin
export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)

    if (!player) {
      return res.status(404).json({ message: "Player not found" })
    }

    await Player.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update player stats
// @route   PUT /api/players/:id/stats
// @access  Private/Admin
export const updatePlayerStats = async (req, res) => {
  try {
    let player = await Player.findById(req.params.id)

    if (!player) {
      return res.status(404).json({ message: "Player not found" })
    }

    player = await Player.findByIdAndUpdate(
      req.params.id,
      { stats: { ...player.stats, ...req.body } },
      { new: true, runValidators: true },
    )

    res.status(200).json({ success: true, data: player })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}
