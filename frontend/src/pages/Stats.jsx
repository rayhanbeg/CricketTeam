"use client"

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
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium text-white">Team Statistics</h1>
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Manage Statistics
            </Link>
          )}
        </div>

        {isError ? (
          <div className="mt-8 p-4 bg-red-900/20 rounded-md border border-red-800/50">
            <p className="text-red-400 text-xs">
              Error loading statistics: {message || "Failed to fetch statistics data"}
            </p>
          </div>
        ) : teamStats ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3">
                  <dt className="text-xs font-medium text-gray-400 truncate">Total Matches</dt>
                  <dd className="mt-1 text-lg font-medium text-white">{teamStats.overall?.matches || 0}</dd>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3">
                  <dt className="text-xs font-medium text-gray-400 truncate">Wins</dt>
                  <dd className="mt-1 text-lg font-medium text-emerald-500">{teamStats.overall?.wins || 0}</dd>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3">
                  <dt className="text-xs font-medium text-gray-400 truncate">Losses</dt>
                  <dd className="mt-1 text-lg font-medium text-red-500">{teamStats.overall?.losses || 0}</dd>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3">
                  <dt className="text-xs font-medium text-gray-400 truncate">Win Percentage</dt>
                  <dd className="mt-1 text-lg font-medium text-white">{teamStats.overall?.winPercentage || 0}%</dd>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-base font-medium text-white">Top Batsmen</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-800">
                  <thead className="bg-zinc-900">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Player</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Runs</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Average</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Strike Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Highest Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                    {teamStats.topBatsmen && teamStats.topBatsmen.length > 0 ? (
                      teamStats.topBatsmen.map((player) => (
                        <tr key={player.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-white">
                            <Link to={`/players/${player.id}`} className="hover:text-emerald-500 transition-colors">
                              {player.name}
                            </Link>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.runs}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.average}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.strikeRate}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.highestScore}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-3 text-xs text-center text-gray-400">
                          No batting statistics available. Add player performance data to see statistics here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-base font-medium text-white">Top Bowlers</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-800">
                  <thead className="bg-zinc-900">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Player</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Wickets</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Economy</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Average</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Best Figures</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                    {teamStats.topBowlers && teamStats.topBowlers.length > 0 ? (
                      teamStats.topBowlers.map((player) => (
                        <tr key={player.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-white">
                            <Link to={`/players/${player.id}`} className="hover:text-emerald-500 transition-colors">
                              {player.name}
                            </Link>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.wickets}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.economy}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.average}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-300">{player.bestFigures}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-3 text-xs text-center text-gray-400">
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
          <div className="mt-8 p-6 text-center border border-zinc-800 rounded-lg bg-zinc-900/50">
            <h3 className="text-sm font-medium text-white mb-2">No Statistics Available</h3>
            <p className="text-xs text-gray-400 mb-6">
              Start adding matches and player performances to generate team statistics.
            </p>
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
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
