import express from "express"
import {
  getTeamStatistics,
  updatePlayerStatistics,
  updateTeamStatisticsManually,
  getPlayerStatistics,
} from "../controllers/statistics.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.get("/team", getTeamStatistics)
router.get("/player/:id", getPlayerStatistics)

// Protected routes - Admin only
router.use(protect)
router.use(authorize("admin"))

router.put("/player/:id", updatePlayerStatistics)
router.post("/team/manual", updateTeamStatisticsManually)

export default router
