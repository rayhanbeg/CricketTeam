"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getMatches } from "../features/matches/matchSlice"
import Spinner from "../components/layout/Spinner"
import {
  FaCalendarAlt,
  FaTrophy,
  FaTimesCircle,
  FaFilter,
  FaInfoCircle,
  FaHandshake,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa"

const Matches = () => {
  const dispatch = useDispatch()
  const { matches, isLoading } = useSelector((state) => state.matches)
  const [filter, setFilter] = useState("all")
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(getMatches())
  }, [dispatch])

  useEffect(() => {
    if (matches) {
      let filtered = [...matches]
      const now = new Date()

      if (filter === "won") filtered = filtered.filter((match) => match.result === "Won")
      else if (filter === "lost") filtered = filtered.filter((match) => match.result === "Lost")
      else if (filter === "draw") filtered = filtered.filter((match) => match.result === "Draw")
      else if (filter === "upcoming") filtered = filtered.filter((match) => new Date(match.date) > now)

      if (searchTerm) {
        filtered = filtered.filter(
          (match) =>
            match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.venue.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setFilteredMatches(filtered)
    }
  }, [matches, filter, searchTerm])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Match Results</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Follow our team's performance and upcoming matches
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search matches..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3">
            <FaFilter className="text-gray-500 dark:text-gray-400 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent py-2 text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">All Matches</option>
              <option value="upcoming">Upcoming</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="draw">Draw</option>
            </select>
          </div>
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No matches found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div 
                key={match._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Match Status Bar */}
                <div className={`px-4 py-2 ${
                  new Date(match.date) > new Date() 
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    : match.result === "Won"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : match.result === "Lost"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                }`}>
                  <div className="flex items-center">
                    {new Date(match.date) > new Date() ? (
                      <FaCalendarAlt className="mr-2" />
                    ) : match.result === "Won" ? (
                      <FaTrophy className="mr-2" />
                    ) : match.result === "Lost" ? (
                      <FaTimesCircle className="mr-2" />
                    ) : (
                      <FaHandshake className="mr-2" />
                    )}
                    <span className="font-medium">
                      {new Date(match.date) > new Date() 
                        ? "Upcoming Match" 
                        : `${match.result} - ${new Date(match.date).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Our Team</p>
                      <p className="font-bold text-gray-800 dark:text-white">KNGC</p>
                    </div>
                    
                    <div className="mx-4 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">vs</p>
                    </div>
                    
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Opponent</p>
                      <p className="font-bold text-gray-800 dark:text-white">{match.opponent}</p>
                    </div>
                  </div>

                  {match.score && (
                    <div className="mb-4 text-center">
                      <p className="text-xl font-bold text-gray-800 dark:text-white">{match.score}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="mr-1 text-green-500 dark:text-green-400" />
                      <span>{match.venue}</span>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {match.format}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/matches/${match._id}`}
                      className="inline-flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaInfoCircle className="mr-2" />
                      View Match Details
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