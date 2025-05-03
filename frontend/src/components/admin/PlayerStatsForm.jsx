

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updatePlayerStatistics } from "../../features/statistics/statisticsSlice"
import { toast } from "react-toastify"
import { FaSpinner } from "react-icons/fa"

const PlayerStatsForm = ({ player, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    matches: 0,
    runs: 0,
    wickets: 0,
    average: 0,
    economy: 0,
    strikeRate: 0,
    highestScore: "0",
    bestFigures: "0/0",
    fifties: 0,
    hundreds: 0,
    fiveWickets: 0,
    rating: 0,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.statistics)

  // If editing, populate form with player stats data
  useEffect(() => {
    if (player && player.stats) {
      setFormData({
        matches: player.stats.matches || 0,
        runs: player.stats.runs || 0,
        wickets: player.stats.wickets || 0,
        average: player.stats.average || 0,
        economy: player.stats.economy || 0,
        strikeRate: player.stats.strikeRate || 0,
        highestScore: player.stats.highestScore || "0",
        bestFigures: player.stats.bestFigures || "0/0",
        fifties: player.stats.fifties || 0,
        hundreds: player.stats.hundreds || 0,
        fiveWickets: player.stats.fiveWickets || 0,
        rating: player.stats.rating || 0,
      })
    }
  }, [player])

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && isSubmitting) {
      toast.success("Player statistics updated successfully")
      setIsSubmitting(false)
      onSuccess()
    }

    if (isError && isSubmitting) {
      toast.error(message || "Something went wrong")
      setIsSubmitting(false)
    }
  }, [isSuccess, isError, message, isSubmitting, onSuccess])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "highestScore" || name === "bestFigures" ? value : Number(value),
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

    if (formData.matches < 0) newErrors.matches = "Matches cannot be negative"
    if (formData.runs < 0) newErrors.runs = "Runs cannot be negative"
    if (formData.wickets < 0) newErrors.wickets = "Wickets cannot be negative"
    if (formData.rating < 0 || formData.rating > 10) newErrors.rating = "Rating must be between 0 and 10"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    // Convert numeric strings to numbers
    const statsData = {
      ...formData,
      matches: Number(formData.matches),
      runs: Number(formData.runs),
      wickets: Number(formData.wickets),
      average: Number(formData.average),
      economy: Number(formData.economy),
      strikeRate: Number(formData.strikeRate),
      fifties: Number(formData.fifties),
      hundreds: Number(formData.hundreds),
      fiveWickets: Number(formData.fiveWickets),
      rating: Number(formData.rating),
    }

    dispatch(updatePlayerStatistics({ playerId: player._id, statsData }))
  }

  if (!player) {
    return <div>Please select a player to update statistics</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Update Statistics for {player.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update the player's statistics manually. This will override any automatically calculated values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="matches" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Matches Played
          </label>
          <input
            type="number"
            id="matches"
            name="matches"
            value={formData.matches}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.matches ? "border-red-500" : ""
            }`}
          />
          {errors.matches && <p className="mt-1 text-sm text-red-600">{errors.matches}</p>}
        </div>

        <div>
          <label htmlFor="runs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Runs
          </label>
          <input
            type="number"
            id="runs"
            name="runs"
            value={formData.runs}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.runs ? "border-red-500" : ""
            }`}
          />
          {errors.runs && <p className="mt-1 text-sm text-red-600">{errors.runs}</p>}
        </div>

        <div>
          <label htmlFor="wickets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Wickets
          </label>
          <input
            type="number"
            id="wickets"
            name="wickets"
            value={formData.wickets}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.wickets ? "border-red-500" : ""
            }`}
          />
          {errors.wickets && <p className="mt-1 text-sm text-red-600">{errors.wickets}</p>}
        </div>

        <div>
          <label htmlFor="average" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Batting Average
          </label>
          <input
            type="number"
            id="average"
            name="average"
            value={formData.average}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="economy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bowling Economy
          </label>
          <input
            type="number"
            id="economy"
            name="economy"
            value={formData.economy}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="strikeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Strike Rate
          </label>
          <input
            type="number"
            id="strikeRate"
            name="strikeRate"
            value={formData.strikeRate}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="highestScore" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Highest Score
          </label>
          <input
            type="text"
            id="highestScore"
            name="highestScore"
            value={formData.highestScore}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="bestFigures" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Best Bowling Figures
          </label>
          <input
            type="text"
            id="bestFigures"
            name="bestFigures"
            value={formData.bestFigures}
            onChange={handleChange}
            placeholder="e.g. 5/20"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="fifties" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of Fifties
          </label>
          <input
            type="number"
            id="fifties"
            name="fifties"
            value={formData.fifties}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="hundreds" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of Hundreds
          </label>
          <input
            type="number"
            id="hundreds"
            name="hundreds"
            value={formData.hundreds}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="fiveWickets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Five Wicket Hauls
          </label>
          <input
            type="number"
            id="fiveWickets"
            name="fiveWickets"
            value={formData.fiveWickets}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Player Rating (0-10)
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.rating ? "border-red-500" : ""
            }`}
          />
          {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
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
              <FaSpinner className="animate-spin mr-2" /> Updating...
            </>
          ) : (
            <>Update Statistics</>
          )}
        </button>
      </div>
    </form>
  )
}

export default PlayerStatsForm
