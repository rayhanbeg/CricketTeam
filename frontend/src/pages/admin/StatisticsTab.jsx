"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getTeamStatistics } from "../../features/statistics/statisticsSlice"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import TeamStatsForm from "../../components/admin/TeamStatsForm"

const StatisticsTab = () => {
  const dispatch = useDispatch()
  const { teamStats, isLoading, isError } = useSelector((state) => state.statistics)

  useEffect(() => {
    dispatch(getTeamStatistics())
  }, [dispatch])

  const handleTeamStatsSuccess = () => {
    dispatch(getTeamStatistics())
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Statistics</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Manage team and player statistics.</p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Historical Match Data</h3>
        <TeamStatsForm onSuccess={handleTeamStatsSuccess} />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Team Performance Summary</h3>

        {isError ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading statistics</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>There was an error loading the team statistics. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        ) : teamStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Overall</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamStats.overall.matches}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Win %</p>
                  <p className="text-lg font-semibold text-green-600">{teamStats.overall.winPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wins</p>
                  <p className="text-lg font-semibold text-green-600">{teamStats.overall.wins}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Losses</p>
                  <p className="text-lg font-semibold text-red-600">{teamStats.overall.losses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Home</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamStats.home.matches}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Win %</p>
                  <p className="text-lg font-semibold text-green-600">{teamStats.home.winPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wins</p>
                  <p className="text-lg font-semibold text-green-600">{teamStats.home.wins}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Losses</p>
                  <p className="text-lg font-semibold text-red-600">{teamStats.home.losses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Away</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamStats.away.matches}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Win %</p>
                  <p className="text-lg font-semibold text-green-600">{teamStats.away.winPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wins</p>
                  <p className="text-lg font-semibold text-green-600">{teamStats.away.wins}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Losses</p>
                  <p className="text-lg font-semibold text-red-600">{teamStats.away.losses}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No team statistics available</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add matches to generate team statistics</p>
          </div>
        )}
      </div>

      {teamStats && teamStats.topBatsmen && teamStats.topBatsmen.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Batsmen</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Runs</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Average</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Strike Rate
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Highest Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {teamStats.topBatsmen.map((batsman) => (
                  <tr key={batsman.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {batsman.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {batsman.runs}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {batsman.average}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {batsman.strikeRate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {batsman.highestScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {teamStats && teamStats.topBowlers && teamStats.topBowlers.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Bowlers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Wickets</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Economy</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Average</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Best Figures
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {teamStats.topBowlers.map((bowler) => (
                  <tr key={bowler.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {bowler.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {bowler.wickets}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {bowler.economy}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {bowler.average}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {bowler.bestFigures}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatisticsTab
