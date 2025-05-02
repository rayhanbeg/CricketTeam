

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
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <Link
            to="/matches"
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-150"
          >
            <FaArrowLeft className="mr-2" />
            Back to Matches
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div
            className={`px-6 py-4 text-white ${
              match.result === "Won"
                ? "bg-gradient-to-r from-green-600 to-green-500"
                : match.result === "Lost"
                  ? "bg-gradient-to-r from-red-600 to-red-500"
                  : "bg-gradient-to-r from-yellow-600 to-yellow-500"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                {match.result === "Won" && <FaTrophy className="inline-block mr-2" />}
                {match.result === "Lost" && <FaTimesCircle className="inline-block mr-2" />}
                {match.result === "Draw" && <FaHandshake className="inline-block mr-2" />}
                {match.result} against {match.opponent}
              </h1>
              <div className="text-sm mt-2 sm:mt-0 px-3 py-1 bg-white bg-opacity-20 rounded-full">
                {match.format} Match
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {new Date(match.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{match.venue}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`${
                    activeTab === "summary"
                      ? "border-green-500 text-green-600 dark:text-green-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200`}
                >
                  Match Summary
                </button>
                <button
                  onClick={() => setActiveTab("performances")}
                  className={`${
                    activeTab === "performances"
                      ? "border-green-500 text-green-600 dark:text-green-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200`}
                >
                  Player Performances
                </button>
              </nav>
            </div>

            {/* Summary Tab */}
            {activeTab === "summary" && (
              <div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-center text-center">
                    <div className="md:w-5/12 mb-4 md:mb-0">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Our Team</p>
                    </div>
                    <div className="md:w-2/12 mb-4 md:mb-0">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">VS</p>
                    </div>
                    <div className="md:w-5/12">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{match.opponent}</p>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{match.score}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                        <FaRunning className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Runs</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamTotals.runs}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4">
                        <MdOutlineSportsCricket className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Wickets</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamTotals.wickets}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                        <FaHandsHelping className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Catches</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamTotals.catches}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mr-4">
                        <FaRunning className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Run Outs</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{teamTotals.runouts}</p>
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
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {match.playerPerformances.map((performance, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {performance.player && typeof performance.player === "object" ? (
                                      <Link
                                        to={`/players/${performance.player._id}`}
                                        className="text-green-600 hover:text-green-700 transition-colors duration-150"
                                      >
                                        {performance.player.name}
                                      </Link>
                                    ) : (
                                      "Unknown Player"
                                    )}
                                  </div>
                                  {performance.player && typeof performance.player === "object" && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {performance.player.role}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  performance.runs > 50
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {performance.runs || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  performance.wickets > 2
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {performance.wickets || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  performance.catches > 1
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {performance.catches || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  performance.runouts > 0
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
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
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No player performance data available</p>
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
