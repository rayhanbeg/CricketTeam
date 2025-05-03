"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createPlayer, updatePlayer } from "../../features/players/playerSlice"
import { toast } from "react-toastify"
import ImageUpload from "../ImageUpload"
import { FaSpinner } from "react-icons/fa"

const PlayerForm = ({ player = null, onSuccess = () => {} }) => {
  // Initialize form data state
  const [formData, setFormData] = useState({
    name: "",
    role: "Batsman", // Default role
    jerseyNumber: "",
    age: "",
    experience: "",
    bio: "",
    imageUrl: "",
  })

  // State for image upload and form validation
  const [uploadedImage, setUploadedImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redux hooks
  const dispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.players)

  // If editing, populate form with player data
  useEffect(() => {
    if (player) {
      // Set form data with player data
      setFormData({
        name: player.name || "",
        role: player.role || "Batsman",
        jerseyNumber: player.jerseyNumber || "",
        age: player.age || "",
        experience: player.experience || "",
        bio: player.bio || "",
        imageUrl: player.imageUrl || "",
      })
    }
  }, [player])

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && isSubmitting) {
      // Show success message
      toast.success(player ? "Player updated successfully" : "Player added successfully")
      setIsSubmitting(false)
      onSuccess()
    }

    if (isError && isSubmitting) {
      // Show error message
      toast.error(message || "Something went wrong")
      setIsSubmitting(false)
    }
  }, [isSuccess, isError, message, isSubmitting, player, onSuccess])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle image upload
  const handleImageUpload = (imageData) => {
    if (imageData) {
      // Store uploaded image data
      setUploadedImage(imageData)

      // Update form data with image URL
      setFormData((prev) => ({
        ...prev,
        imageUrl: imageData.url,
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Check required fields
    if (!formData.name.trim()) newErrors.name = "Name is required"

    // Validate jersey number
    if (!formData.jerseyNumber) newErrors.jerseyNumber = "Jersey number is required"
    else if (isNaN(formData.jerseyNumber)) newErrors.jerseyNumber = "Jersey number must be a number"

    // Validate age
    if (!formData.age) newErrors.age = "Age is required"
    else if (isNaN(formData.age)) newErrors.age = "Age must be a number"

    // Validate experience
    if (!formData.experience) newErrors.experience = "Experience is required"
    else if (isNaN(formData.experience)) newErrors.experience = "Experience must be a number"

    // Set errors and return validation result
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    // Convert numeric strings to numbers
    const playerData = {
      ...formData,
      jerseyNumber: Number.parseInt(formData.jerseyNumber),
      age: Number.parseInt(formData.age),
      experience: Number.parseInt(formData.experience),
    }

    // Update or create player
    if (player) {
      dispatch(updatePlayer({ id: player._id, playerData }))
    } else {
      dispatch(createPlayer(playerData))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
            <option value="Wicket-Keeper">Wicket-Keeper</option>
          </select>
        </div>

        <div>
          <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jersey Number *
          </label>
          <input
            type="text"
            id="jerseyNumber"
            name="jerseyNumber"
            value={formData.jerseyNumber}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.jerseyNumber ? "border-red-500" : ""
            }`}
          />
          {errors.jerseyNumber && <p className="mt-1 text-sm text-red-600">{errors.jerseyNumber}</p>}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Age *
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.age ? "border-red-500" : ""
            }`}
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Experience (years) *
          </label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.experience ? "border-red-500" : ""
            }`}
          />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Player Image</label>
        <ImageUpload
          onImageUpload={handleImageUpload}
          existingImage={formData.imageUrl ? { url: formData.imageUrl } : null}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> {player ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{player ? "Update Player" : "Create Player"}</>
          )}
        </button>
      </div>
    </form>
  )
}

export default PlayerForm
