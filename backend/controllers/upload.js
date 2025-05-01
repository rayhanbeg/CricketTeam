import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// @desc    Upload image
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const file = req.files.image

    // Check file type
    if (!file.mimetype.startsWith("image")) {
      return res.status(400).json({ message: "Please upload an image file" })
    }

    // Check file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      return res.status(400).json({ message: "File size should be less than 1MB" })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "cricket-team",
      width: 500,
      crop: "scale",
    })

    // Remove temp file
    fs.unlinkSync(file.tempFilePath)

    // Return success response with file URL
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

// @desc    Delete image
// @route   DELETE /api/upload/:public_id
// @access  Private (Admin)
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params

    if (!public_id) {
      return res.status(400).json({ message: "Please provide a public_id" })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id)

    if (result.result !== "ok") {
      return res.status(400).json({ message: "Failed to delete image" })
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
