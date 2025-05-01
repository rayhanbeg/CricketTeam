import express from "express"
import { getMatches, getMatch, createMatch, updateMatch, deleteMatch } from "../controllers/matches.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.route("/").get(getMatches)
router.route("/:id").get(getMatch)

// Protected routes
router.use(protect)
router.use(authorize("admin"))

router.route("/").post(createMatch)
router.route("/:id").put(updateMatch).delete(deleteMatch)

export default router
