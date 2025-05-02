

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getTeamStatistics } from "../features/statistics/statisticsSlice"
import Spinner from "../components/layout/Spinner"
import { Link } from "react-router-dom"

const Stats = () => {
  const dispatch = useDispatch()
  const { teamStats, isLoading, isError, message } = useSelector((state) => state.statistics)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getTeamStatistics())
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Statistics</h1>
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Manage Statistics
            </Link>
          )}
        </div>

        {isError ? (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-red-800 dark:text-red-200">
              Error loading statistics: {message || "Failed to fetch statistics data"}
            </p>
          </div>
        ) : teamStats ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Matches</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {teamStats.overall?.matches || 0}
                  </dd>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Wins</dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-600">{teamStats.overall?.wins || 0}</dd>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Losses</dt>
                  <dd className="mt-1 text-3xl font-semibold text-red-600">{teamStats.overall?.losses || 0}</dd>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Win Percentage</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {teamStats.overall?.winPercentage || 0}%
                  </dd>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Batsmen</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Player
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Runs
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Average
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Strike Rate
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Highest Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {teamStats.topBatsmen && teamStats.topBatsmen.length > 0 ? (
                      teamStats.topBatsmen.map((player) => (
                        <tr key={player.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            <Link to={`/players/${player.id}`} className="hover:underline">
                              {player.name}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.runs}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.average}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.strikeRate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.highestScore}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                          No batting statistics available. Add player performance data to see statistics here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Bowlers</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Player
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Wickets
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Economy
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Average
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Best Figures
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {teamStats.topBowlers && teamStats.topBowlers.length > 0 ? (
                      teamStats.topBowlers.map((player) => (
                        <tr key={player.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            <Link to={`/players/${player.id}`} className="hover:underline">
                              {player.name}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.wickets}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.economy}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.average}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {player.bestFigures}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                          No bowling statistics available. Add player performance data to see statistics here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-8 p-8 text-center border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Statistics Available</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start adding matches and player performances to generate team statistics.
            </p>
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Match Data
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Stats
