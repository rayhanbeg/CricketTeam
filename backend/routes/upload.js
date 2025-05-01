import express from "express"
import { uploadImage, deleteImage } from "../controllers/upload.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// Apply middleware to all routes
router.use(protect)
router.use(authorize("admin"))

router.post("/", uploadImage)
router.delete("/:public_id", deleteImage)

export default router
