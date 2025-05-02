import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Upload image
const uploadImage = async (imageData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post(`${API_URL}/api/upload`, imageData, config)
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

    // Fix: Remove the folder path from the publicId when making the API call
    // The API expects just the ID, not the full path
    const cleanPublicId = publicId.includes("/") ? publicId.split("/").pop() : publicId

    const response = await axios.delete(`${API_URL}/api/upload/${cleanPublicId}`, config)
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
