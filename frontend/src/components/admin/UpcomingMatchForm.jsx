

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createMatch, updateMatch, reset } from "../../features/matches/matchSlice"
import { toast } from "react-toastify"
import { FaSpinner } from "react-icons/fa"

const UpcomingMatchForm = ({ match = null, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 1 week from now
    opponent: "",
    format: "T20",
    venue: "",
    result: "Upcoming",
    score: "TBD",
    playerPerformances: [], // Explicitly set an empty array
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.matches)
  const { user } = useSelector((state) => state.auth)

  // If editing, populate form with match data
  useEffect(() => {
    if (match) {
      const matchDate = match.date ? new Date(match.date).toISOString().split("T")[0] : ""

      setFormData({
        date: matchDate,
        opponent: match.opponent || "",
        format: match.format || "T20",
        venue: match.venue || "",
        result: "Upcoming",
        score: "TBD",
        playerPerformances: match.playerPerformances || [], // Use existing or empty array
      })
    }
  }, [match])

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && isSubmitting) {
      toast.success(match ? "Upcoming match updated successfully" : "Upcoming match added successfully")
      setIsSubmitting(false)
      dispatch(reset())
      onSuccess()
    }

    if (isError && isSubmitting) {
      toast.error(message || "Something went wrong")
      setIsSubmitting(false)
      dispatch(reset())
    }

    // Cleanup function
    return () => {
      if (isSuccess || isError) {
        dispatch(reset())
      }
    }
  }, [isSuccess, isError, message, isSubmitting, match, onSuccess, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.opponent.trim()) newErrors.opponent = "Opponent is required"
    if (!formData.venue.trim()) newErrors.venue = "Venue is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    if (!user || !user.token) {
      toast.error("You must be logged in to create a match")
      return
    }

    setIsSubmitting(true)

    try {
      // Format date for API
      const matchData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        playerPerformances: [], // Ensure this is always set
      }

      console.log("Submitting match data:", matchData)

      if (match) {
        dispatch(updateMatch({ id: match._id, matchData }))
      } else {
        dispatch(createMatch(matchData))
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred while submitting the form")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.date ? "border-red-500" : ""
            }`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="opponent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Opponent *
          </label>
          <input
            type="text"
            id="opponent"
            name="opponent"
            value={formData.opponent}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.opponent ? "border-red-500" : ""
            }`}
          />
          {errors.opponent && <p className="mt-1 text-sm text-red-600">{errors.opponent}</p>}
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Format *
          </label>
          <select
            id="format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <option value="T20">T20</option>
            <option value="One Day">One Day</option>
            <option value="Test">Test</option>
            <option value="Friendly">Friendly</option>
          </select>
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Venue *
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.venue ? "border-red-500" : ""
            }`}
          />
          {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> {match ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{match ? "Update Upcoming Match" : "Create Upcoming Match"}</>
          )}
        </button>
      </div>
    </form>
  )
}

export default UpcomingMatchForm
