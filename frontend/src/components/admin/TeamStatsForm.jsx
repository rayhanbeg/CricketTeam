"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addManualTeamStatistics } from "../../features/statistics/statisticsSlice"
import { getPlayers } from "../../features/players/playerSlice"
import { toast } from "react-toastify"
import { FaSpinner } from "react-icons/fa"

const TeamStatsForm = ({ onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    date: "",
    opponent: "",
    format: "T20",
    result: "Won",
    score: "",
    venue: "",
    playerPerformances: [],
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState([])

  const dispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.statistics)
  const { players } = useSelector((state) => state.players)

  // Load players
  useEffect(() => {
    dispatch(getPlayers())
  }, [dispatch])

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && isSubmitting) {
      toast.success("Team statistics added successfully")
      setIsSubmitting(false)
      setFormData({
        date: "",
        opponent: "",
        format: "T20",
        result: "Won",
        score: "",
        venue: "",
        playerPerformances: [],
      })
      setSelectedPlayers([])
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

  const handlePlayerSelect = (e) => {
    const playerId = e.target.value
    if (playerId && !selectedPlayers.includes(playerId)) {
      setSelectedPlayers([...selectedPlayers, playerId])

      setFormData((prev) => ({
        ...prev,
        playerPerformances: [
          ...prev.playerPerformances,
          {
            player: playerId,
            runs: 0,
            wickets: 0,
            catches: 0,
            runouts: 0,
            runsConceded: 0,
          },
        ],
      }))
    }
  }

  const handlePlayerRemove = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    setFormData((prev) => ({
      ...prev,
      playerPerformances: prev.playerPerformances.filter((perf) => perf.player !== playerId),
    }))
  }

  const handlePerformanceChange = (playerId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      playerPerformances: prev.playerPerformances.map((perf) =>
        perf.player === playerId ? { ...perf, [field]: Number.parseInt(value) || 0 } : perf,
      ),
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.opponent.trim()) newErrors.opponent = "Opponent is required"
    if (!formData.score.trim()) newErrors.score = "Score is required"
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

    setIsSubmitting(true)

    try {
      // Format date for API
      const matchData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        playerPerformances: formData.playerPerformances.map((perf) => ({
          player: typeof perf.player === "object" ? perf.player._id : perf.player,
          runs: Number(perf.runs) || 0,
          wickets: Number(perf.wickets) || 0,
          catches: Number(perf.catches) || 0,
          runouts: Number(perf.runouts) || 0,
          runsConceded: Number(perf.runsConceded) || 0,
        })),
      }

      dispatch(addManualTeamStatistics(matchData))
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred while submitting the form")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Historical Match Data</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add historical match data to update team and player statistics. This will automatically update player
          statistics.
        </p>
      </div>

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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="T20">T20</option>
            <option value="One Day">One Day</option>
            <option value="Test">Test</option>
            <option value="Friendly">Friendly</option>
          </select>
        </div>

        <div>
          <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Result *
          </label>
          <select
            id="result"
            name="result"
            value={formData.result}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Draw">Draw</option>
          </select>
        </div>

        <div>
          <label htmlFor="score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Score *
          </label>
          <input
            type="text"
            id="score"
            name="score"
            value={formData.score}
            onChange={handleChange}
            placeholder="e.g. 150/6 vs 145/8"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.score ? "border-red-500" : ""
            }`}
          />
          {errors.score && <p className="mt-1 text-sm text-red-600">{errors.score}</p>}
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

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Player Performances</h3>
        <div className="mt-4">
          <label htmlFor="player" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Player
          </label>
          <select
            id="player"
            name="player"
            onChange={handlePlayerSelect}
            value=""
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="">Select a player</option>
            {players &&
              players.length > 0 &&
              players
                .filter((player) => !selectedPlayers.includes(player._id))
                .map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.name} ({player.role})
                  </option>
                ))}
          </select>
        </div>

        {selectedPlayers.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Player</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Runs</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Wickets</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Catches</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Run Outs
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Runs Conceded
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {selectedPlayers.map((playerId) => {
                  const player = players.find((p) => p._id === playerId)
                  const performance = formData.playerPerformances.find((perf) => perf.player === playerId)

                  return (
                    <tr key={playerId}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {player ? player.name : "Unknown Player"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <input
                          type="number"
                          min="0"
                          value={performance?.runs || 0}
                          onChange={(e) => handlePerformanceChange(playerId, "runs", e.target.value)}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <input
                          type="number"
                          min="0"
                          value={performance?.wickets || 0}
                          onChange={(e) => handlePerformanceChange(playerId, "wickets", e.target.value)}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <input
                          type="number"
                          min="0"
                          value={performance?.catches || 0}
                          onChange={(e) => handlePerformanceChange(playerId, "catches", e.target.value)}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <input
                          type="number"
                          min="0"
                          value={performance?.runouts || 0}
                          onChange={(e) => handlePerformanceChange(playerId, "runouts", e.target.value)}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <input
                          type="number"
                          min="0"
                          value={performance?.runsConceded || 0}
                          onChange={(e) => handlePerformanceChange(playerId, "runsConceded", e.target.value)}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => handlePlayerRemove(playerId)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Adding...
            </>
          ) : (
            <>Add Match Statistics</>
          )}
        </button>
      </div>
    </form>
  )
}

export default TeamStatsForm
