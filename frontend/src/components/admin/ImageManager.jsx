"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import ImageUpload from "../ImageUpload"
import { toast } from "react-toastify"

const ImageManager = () => {
  const [uploadedImages, setUploadedImages] = useState([])
  const { user } = useSelector((state) => state.auth)

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setUploadedImages([...uploadedImages, imageData])
      toast.success("Image uploaded successfully")
    }
  }

  const handleImageDelete = (publicId) => {
    setUploadedImages(uploadedImages.filter((img) => img.public_id !== publicId))
    toast.success("Image removed from list")
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <p className="font-bold">Access Denied</p>
        <p>You need admin privileges to access this feature.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Image Manager</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Upload images for players, matches, or other content. Only JPG, JPEG, and PNG files under 1MB are allowed.
      </p>

      <ImageUpload onImageUpload={handleImageUpload} />

      {uploadedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Uploaded Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <button
                    onClick={() => handleImageDelete(image.public_id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageManager
