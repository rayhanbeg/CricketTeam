

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { uploadImage, deleteImage, reset } from "../features/upload/uploadSlice"
import { toast } from "react-toastify"
import { FaUpload, FaTrash, FaSpinner } from "react-icons/fa"

const ImageUpload = ({ onImageUpload, existingImage = null }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const dispatch = useDispatch()
  const { isLoading, isSuccess, isError, message, imageUrl, publicId } = useSelector((state) => state.upload)

  // Set preview if there's an existing image
  useEffect(() => {
    if (existingImage) {
      setPreview(existingImage.url)
    }
  }, [existingImage])

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && imageUrl) {
      toast.success("Image uploaded successfully")
      onImageUpload({ url: imageUrl, public_id: publicId })
      setFile(null)
    }

    if (isError) {
      toast.error(message || "Upload failed")
    }

    return () => {
      dispatch(reset())
    }
  }, [isSuccess, isError, message, imageUrl, publicId, dispatch, onImageUpload])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed")
        return
      }

      // Validate file size (1MB = 1024 * 1024 bytes)
      if (selectedFile.size > 1024 * 1024) {
        toast.error("File size should be less than 1MB")
        return
      }

      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)
    dispatch(uploadImage(formData))
  }

  const handleDelete = () => {
    if (publicId) {
      dispatch(deleteImage(publicId))
      setPreview(null)
    } else if (existingImage?.public_id) {
      dispatch(deleteImage(existingImage.public_id))
      setPreview(null)
      onImageUpload(null)
    } else {
      setFile(null)
      setPreview(null)
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain p-2" />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete()
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 1MB)</p>
            </div>
          )}
          <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
      {file && !preview && (
        <div className="mt-4 flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading preview...</p>
        </div>
      )}
      {file && preview && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Uploading...
              </>
            ) : (
              <>Upload Image</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
