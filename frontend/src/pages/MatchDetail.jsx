

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getMatchById } from "../features/matches/matchSlice"
import Spinner from "../components/layout/Spinner"
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaTimesCircle,
  FaArrowLeft,
  FaHandshake,
  FaRunning,
  FaHandsHelping,
} from "react-icons/fa"

import { MdOutlineSportsCricket } from "react-icons/md"

const MatchDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { match, isLoading } = useSelector((state) => state.matches)
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    dispatch(getMatchById(id))
  }, [dispatch, id])

  if (isLoading || !match) {
    return <Spinner />
  }

  // Calculate team totals
  const teamTotals = match.playerPerformances?.reduce(
    (acc, perf) => {
      return {
        runs: acc.runs + (perf.runs || 0),
        wickets: acc.wickets + (perf.wickets || 0),
        catches: acc.catches + (perf.catches || 0),
        runouts: acc.runouts + (perf.runouts || 0),
      }
    },
    { runs: 0, wickets: 0, catches: 0, runouts: 0 },
  )

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/matches"
            className="inline-flex items-center text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            <FaArrowLeft className="mr-2 text-xs" />
            Back to Matches
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
          <div
            className={`px-4 py-3 text-white ${
              match.result === "Won"
                ? "bg-emerald-900/30"
                : match.result === "Lost"
                  ? "bg-red-900/30"
                  : "bg-amber-900/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-base font-medium flex items-center">
                {match.result === "Won" && <FaTrophy className="inline-block mr-2 text-xs" />}
                {match.result === "Lost" && <FaTimesCircle className="inline-block mr-2 text-xs" />}
                {match.result === "Draw" && <FaHandshake className="inline-block mr-2 text-xs" />}
                {match.result} against {match.opponent}
              </h1>
              <div className="text-xs mt-2 sm:mt-0 px-2 py-0.5 bg-zinc-800/30 rounded-full">{match.format} Match</div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <FaCalendarAlt className="text-gray-500 mr-2 text-xs" />
                <span className="text-gray-300 text-xs">
                  {new Date(match.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-2 text-xs" />
                <span className="text-gray-300 text-xs">{match.venue}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-zinc-800 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`${
                    activeTab === "summary"
                      ? "border-emerald-500 text-emerald-500"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors duration-200`}
                >
                  Match Summary
                </button>
                <button
                  onClick={() => setActiveTab("performances")}
                  className={`${
                    activeTab === "performances"
                      ? "border-emerald-500 text-emerald-500"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors duration-200`}
                >
                  Player Performances
                </button>
              </nav>
            </div>

            {/* Summary Tab */}
            {activeTab === "summary" && (
              <div>
                <div className="bg-zinc-800/50 p-4 rounded-lg mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-center text-center">
                    <div className="md:w-5/12 mb-4 md:mb-0">
                      <p className="text-sm font-medium text-white">Our Team</p>
                    </div>
                    <div className="md:w-2/12 mb-4 md:mb-0">
                      <p className="text-sm font-medium text-white">VS</p>
                    </div>
                    <div className="md:w-5/12">
                      <p className="text-sm font-medium text-white">{match.opponent}</p>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-base font-medium text-white">{match.score}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-emerald-900/30 text-emerald-500 mr-3">
                        <FaRunning className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Total Runs</p>
                        <p className="text-sm font-medium text-white">{teamTotals.runs}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-red-900/30 text-red-500 mr-3">
                        <MdOutlineSportsCricket className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Total Wickets</p>
                        <p className="text-sm font-medium text-white">{teamTotals.wickets}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-900/30 text-blue-500 mr-3">
                        <FaHandsHelping className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Total Catches</p>
                        <p className="text-sm font-medium text-white">{teamTotals.catches}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-amber-900/30 text-amber-500 mr-3">
                        <FaRunning className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Total Run Outs</p>
                        <p className="text-sm font-medium text-white">{teamTotals.runouts}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Player Performances Tab */}
            {activeTab === "performances" && (
              <div>
                {match.playerPerformances && match.playerPerformances.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                      <thead className="bg-zinc-800/50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                          >
                            Player
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                          >
                            Runs
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                          >
                            Wickets
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                          >
                            Catches
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                          >
                            Run Outs
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {match.playerPerformances.map((performance, index) => (
                          <tr key={index} className="hover:bg-zinc-800/30 transition-colors duration-150">
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-xs font-medium text-white">
                                    {performance.player && typeof performance.player === "object" ? (
                                      <Link
                                        to={`/players/${performance.player._id}`}
                                        className="text-emerald-500 hover:text-emerald-400 transition-colors"
                                      >
                                        {performance.player.name}
                                      </Link>
                                    ) : (
                                      "Unknown Player"
                                    )}
                                  </div>
                                  {performance.player && typeof performance.player === "object" && (
                                    <div className="text-xs text-gray-400">{performance.player.role}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  performance.runs > 50
                                    ? "bg-emerald-900/30 text-emerald-400"
                                    : "bg-zinc-800 text-gray-300"
                                }`}
                              >
                                {performance.runs || 0}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  performance.wickets > 2 ? "bg-red-900/30 text-red-400" : "bg-zinc-800 text-gray-300"
                                }`}
                              >
                                {performance.wickets || 0}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  performance.catches > 1 ? "bg-blue-900/30 text-blue-400" : "bg-zinc-800 text-gray-300"
                                }`}
                              >
                                {performance.catches || 0}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  performance.runouts > 0
                                    ? "bg-amber-900/30 text-amber-400"
                                    : "bg-zinc-800 text-gray-300"
                                }`}
                              >
                                {performance.runouts || 0}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-zinc-800/50 rounded-lg">
                    <p className="text-gray-400 text-xs">No player performance data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchDetail
