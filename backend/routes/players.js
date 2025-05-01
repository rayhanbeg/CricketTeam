import express from "express"
import {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerStats,
} from "../controllers/players.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.route("/").get(getPlayers)
router.route("/:id").get(getPlayer)

// Protected routes
router.use(protect)
router.use(authorize("admin"))

router.route("/").post(createPlayer)

router.route("/:id").put(updatePlayer).delete(deletePlayer)

router.route("/:id/stats").put(updatePlayerStats)

export default router
