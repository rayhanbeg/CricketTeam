

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createMatch, updateMatch, reset } from "../../features/matches/matchSlice"
import { getPlayers } from "../../features/players/playerSlice"
import { toast } from "react-toastify"
import { FaSpinner, FaPlus, FaUserPlus, FaTimes } from "react-icons/fa"

const SimpleMatchForm = ({ match = null, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
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
  const [activeTab, setActiveTab] = useState("match-details")

  const dispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.matches)
  const { players } = useSelector((state) => state.players)

  // Load players
  useEffect(() => {
    dispatch(getPlayers())
  }, [dispatch])

  // If editing, populate form with match data
  useEffect(() => {
    if (match) {
      const matchDate = match.date ? new Date(match.date).toISOString().split("T")[0] : ""

      setFormData({
        date: matchDate,
        opponent: match.opponent || "",
        format: match.format || "T20",
        result: match.result || "Won",
        score: match.score || "",
        venue: match.venue || "",
        playerPerformances: match.playerPerformances || [],
      })

      if (match.playerPerformances && match.playerPerformances.length > 0) {
        const playerIds = match.playerPerformances.map((perf) => {
          // Handle both populated and unpopulated player references
          return typeof perf.player === "object" ? perf.player._id : perf.player
        })
        setSelectedPlayers(playerIds)
      }
    }
  }, [match])

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && isSubmitting) {
      toast.success(match ? "Match updated successfully" : "Match added successfully")
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
          },
        ],
      }))
    }
  }

  const handlePlayerRemove = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    setFormData((prev) => ({
      ...prev,
      playerPerformances: prev.playerPerformances.filter((perf) => {
        // Handle both string IDs and object references
        const perfPlayerId = typeof perf.player === "object" ? perf.player._id : perf.player
        return perfPlayerId !== playerId
      }),
    }))
  }

  const handlePerformanceChange = (playerId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      playerPerformances: prev.playerPerformances.map((perf) => {
        // Handle both string IDs and object references
        const perfPlayerId = typeof perf.player === "object" ? perf.player._id : perf.player
        return perfPlayerId === playerId ? { ...perf, [field]: Number(value) || 0 } : perf
      }),
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
        })),
      }

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
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6">
          <button
            type="button"
            onClick={() => setActiveTab("match-details")}
            className={`${
              activeTab === "match-details"
                ? "border-green-500 text-green-600 dark:text-green-500"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200`}
          >
            Match Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("player-performances")}
            className={`${
              activeTab === "player-performances"
                ? "border-green-500 text-green-600 dark:text-green-500"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200`}
          >
            Player Performances
          </button>
        </nav>
      </div>

      {/* Match Details Tab */}
      <div className={activeTab === "match-details" ? "block" : "hidden"}>
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
            <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Result *
            </label>
            <select
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
      </div>

      {/* Player Performances Tab */}
      <div className={activeTab === "player-performances" ? "block" : "hidden"}>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">Add Player Performance</h3>
            <div className="relative">
              <select
                id="player"
                name="player"
                onChange={handlePlayerSelect}
                value=""
                className="pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaUserPlus className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {selectedPlayers.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Player
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Runs
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Wickets
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Catches
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Run Outs
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {selectedPlayers.map((playerId) => {
                    const player = players.find((p) => p._id === playerId)
                    const performance = formData.playerPerformances.find((perf) => {
                      // Handle both string IDs and object references
                      const perfPlayerId = typeof perf.player === "object" ? perf.player._id : perf.player
                      return perfPlayerId === playerId
                    })

                    return (
                      <tr
                        key={playerId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {player ? player.name : "Unknown Player"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {player ? player.role : "Unknown Role"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={performance?.runs || 0}
                            onChange={(e) => handlePerformanceChange(playerId, "runs", e.target.value)}
                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={performance?.wickets || 0}
                            onChange={(e) => handlePerformanceChange(playerId, "wickets", e.target.value)}
                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={performance?.catches || 0}
                            onChange={(e) => handlePerformanceChange(playerId, "catches", e.target.value)}
                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={performance?.runouts || 0}
                            onChange={(e) => handlePerformanceChange(playerId, "runouts", e.target.value)}
                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handlePlayerRemove(playerId)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors duration-150"
                          >
                            <FaTimes className="inline-block" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <FaUserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No players added</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add players to record their performance in this match
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => {
            if (activeTab === "match-details") {
              setActiveTab("player-performances")
            } else {
              setActiveTab("match-details")
            }
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
        >
          {activeTab === "match-details" ? "Next: Player Performances" : "Back to Match Details"}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-150"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> {match ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <FaPlus className={`mr-2 ${match ? "hidden" : ""}`} />
              {match ? "Update Match" : "Create Match"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default SimpleMatchForm
