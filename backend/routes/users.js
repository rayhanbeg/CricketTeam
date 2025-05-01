import express from "express"
import { getUsers, getUser, updateUser, deleteUser } from "../controllers/users.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// Apply middleware to all routes
router.use(protect)
router.use(authorize("admin"))

// Get all users
router.route("/").get(getUsers)

// Get, update, or delete a user by id
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)

export default router
