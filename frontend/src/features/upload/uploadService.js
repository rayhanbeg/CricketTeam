import axios from "axios"

// Upload image
const uploadImage = async (imageData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post("https://cricket-team-backend.vercel.app/api/upload", imageData, config)
    return response.data
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message)
    throw error
  }
}

// Delete image
const deleteImage = async (publicId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.delete(`https://cricket-team-backend.vercel.app/api/upload/${publicId}`, config)
    return response.data
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message)
    throw error
  }
}

const uploadService = {
  uploadImage,
  deleteImage,
}

export default uploadService
