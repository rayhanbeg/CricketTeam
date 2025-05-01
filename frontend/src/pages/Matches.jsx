"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getMatches } from "../features/matches/matchSlice"
import Spinner from "../components/layout/Spinner"
import { FaCalendarAlt, FaTrophy, FaTimesCircle, FaFilter, FaInfoCircle, FaHandshake } from "react-icons/fa"

const Matches = () => {
  const dispatch = useDispatch()
  const { matches, isLoading } = useSelector((state) => state.matches)
  const [filter, setFilter] = useState("all") // "all", "won", "lost", "draw"
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(getMatches())
  }, [dispatch])

  useEffect(() => {
    if (matches) {
      let filtered = [...matches]

      // Apply result filter
      if (filter === "won") {
        filtered = filtered.filter((match) => match.result === "Won")
      } else if (filter === "lost") {
        filtered = filtered.filter((match) => match.result === "Lost")
      } else if (filter === "draw") {
        filtered = filtered.filter((match) => match.result === "Draw")
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (match) =>
            match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.venue.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

      setFilteredMatches(filtered)
    }
  }, [matches, filter, searchTerm])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Match History</h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-500 dark:text-gray-400">
            View all matches played by our cricket team, filter by results, and explore detailed statistics
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search by opponent or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-150"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300 text-sm"
              >
                <option value="all">All Matches</option>
                <option value="won">Won Matches</option>
                <option value="lost">Lost Matches</option>
                <option value="draw">Draw Matches</option>
              </select>
            </div>
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="mt-8 text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No matches found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try changing your search or filter criteria</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMatches.map((match) => (
              <div
                key={match._id}
                className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`px-4 py-3 text-white text-center ${
                    match.result === "Won"
                      ? "bg-gradient-to-r from-green-600 to-green-500"
                      : match.result === "Lost"
                        ? "bg-gradient-to-r from-red-600 to-red-500"
                        : "bg-gradient-to-r from-yellow-600 to-yellow-500"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {match.result === "Won" && <FaTrophy className="inline-block mr-2" />}
                    {match.result === "Lost" && <FaTimesCircle className="inline-block mr-2" />}
                    {match.result === "Draw" && <FaHandshake className="inline-block mr-2" />}
                    <span className="font-bold">{match.result}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center w-5/12">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Our Team</p>
                    </div>
                    <div className="text-center w-2/12">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">VS</p>
                    </div>
                    <div className="text-center w-5/12">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{match.opponent}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{match.score}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        <span>{new Date(match.date).toLocaleDateString()}</span>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                        {match.format}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Venue:</span> {match.venue}
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      to={`/matches/${match._id}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                    >
                      <FaInfoCircle className="mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Matches
