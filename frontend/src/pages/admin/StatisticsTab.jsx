"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getTeamStatistics } from "../../features/statistics/statisticsSlice"
import { FaExclamationTriangle, FaChartBar, FaChartLine, FaTrophy } from "react-icons/fa"
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
          <h2 className="text-base font-medium text-white">Team Statistics</h2>
          <p className="mt-2 text-xs text-gray-400">Manage team and player statistics.</p>
        </div>
      </div>

      <div className="mt-8 bg-zinc-900/60 border border-purple-900/40 rounded-lg p-5 backdrop-blur-sm shadow-lg">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-purple-900/30 text-purple-400 mr-3">
            <FaChartLine className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-medium text-white">Add Historical Match Data</h3>
        </div>
        <TeamStatsForm onSuccess={handleTeamStatsSuccess} />
      </div>

      <div className="mt-8 bg-zinc-900/60 border border-cyan-900/40 rounded-lg p-5 backdrop-blur-sm shadow-lg">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-cyan-900/30 text-cyan-400 mr-3">
            <FaChartBar className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-medium text-white">Team Performance Summary</h3>
        </div>

        {isError ? (
          <div className="bg-red-900/20 p-4 rounded-md border border-red-800/50">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-4 w-4 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-red-400">Error loading statistics</h3>
                <div className="mt-2 text-xs text-red-300">
                  <p>There was an error loading the team statistics. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        ) : teamStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 p-4 rounded-lg border border-cyan-900/30 shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-1.5 rounded-full bg-cyan-900/20 text-cyan-400 mr-2">
                  <FaTrophy className="h-3 w-3" />
                </div>
                <h4 className="font-medium text-cyan-400 text-xs">Overall</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Matches</p>
                  <p className="text-sm font-medium text-white">{teamStats.overall.matches}</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Win %</p>
                  <p className="text-sm font-medium text-cyan-400">{teamStats.overall.winPercentage}%</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Wins</p>
                  <p className="text-sm font-medium text-cyan-400">{teamStats.overall.wins}</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Losses</p>
                  <p className="text-sm font-medium text-red-400">{teamStats.overall.losses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 p-4 rounded-lg border border-purple-900/30 shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-1.5 rounded-full bg-purple-900/20 text-purple-400 mr-2">
                  <FaTrophy className="h-3 w-3" />
                </div>
                <h4 className="font-medium text-purple-400 text-xs">Home</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Matches</p>
                  <p className="text-sm font-medium text-white">{teamStats.home.matches}</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Win %</p>
                  <p className="text-sm font-medium text-purple-400">{teamStats.home.winPercentage}%</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Wins</p>
                  <p className="text-sm font-medium text-purple-400">{teamStats.home.wins}</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Losses</p>
                  <p className="text-sm font-medium text-red-400">{teamStats.home.losses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 p-4 rounded-lg border border-amber-900/30 shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-1.5 rounded-full bg-amber-900/20 text-amber-400 mr-2">
                  <FaTrophy className="h-3 w-3" />
                </div>
                <h4 className="font-medium text-amber-400 text-xs">Away</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Matches</p>
                  <p className="text-sm font-medium text-white">{teamStats.away.matches}</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Win %</p>
                  <p className="text-sm font-medium text-amber-400">{teamStats.away.winPercentage}%</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Wins</p>
                  <p className="text-sm font-medium text-amber-400">{teamStats.away.wins}</p>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded-md">
                  <p className="text-xs text-gray-400">Losses</p>
                  <p className="text-sm font-medium text-red-400">{teamStats.away.losses}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-xs">No team statistics available</p>
            <p className="text-xs text-gray-500 mt-2">Add matches to generate team statistics</p>
          </div>
        )}
      </div>

      {teamStats && teamStats.topBatsmen && teamStats.topBatsmen.length > 0 && (
        <div className="mt-8 bg-zinc-900/60 border border-amber-900/40 rounded-lg p-5 backdrop-blur-sm shadow-lg">
          <h3 className="text-sm font-medium text-amber-400 mb-4">Top Batsmen</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800/70">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Runs</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Average</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Strike Rate</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Highest Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/30">
                {teamStats.topBatsmen.map((batsman) => (
                  <tr key={batsman.id} className="hover:bg-zinc-800/30 transition-all">
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-amber-300">{batsman.name}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{batsman.runs}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{batsman.average}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{batsman.strikeRate}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{batsman.highestScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {teamStats && teamStats.topBowlers && teamStats.topBowlers.length > 0 && (
        <div className="mt-8 bg-zinc-900/60 border border-cyan-900/40 rounded-lg p-5 backdrop-blur-sm shadow-lg">
          <h3 className="text-sm font-medium text-cyan-400 mb-4">Top Bowlers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800/70">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Wickets</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Economy</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Average</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Best Figures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/30">
                {teamStats.topBowlers.map((bowler) => (
                  <tr key={bowler.id} className="hover:bg-zinc-800/30 transition-all">
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-cyan-300">{bowler.name}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{bowler.wickets}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{bowler.economy}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{bowler.average}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{bowler.bestFigures}</td>
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
