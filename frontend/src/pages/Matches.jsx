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
    <div className="relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-medium text-white">Match Results</h1>
          <p className="mt-2 text-xs text-gray-400">Follow our team's performance and upcoming matches</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-3 w-3 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search matches..."
              className="block w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-700 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-md px-3">
            <FaFilter className="text-gray-500 text-xs mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent py-1.5 text-xs text-gray-300 focus:outline-none"
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
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center">
            <p className="text-gray-400 text-xs">No matches found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match._id}
                className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
              >
                {/* Match Status Bar */}
                <div
                  className={`px-4 py-2 ${
                    new Date(match.date) > new Date()
                      ? "bg-blue-900/30 text-blue-400"
                      : match.result === "Won"
                        ? "bg-emerald-900/30 text-emerald-400"
                        : match.result === "Lost"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-amber-900/30 text-amber-400"
                  }`}
                >
                  <div className="flex items-center">
                    {new Date(match.date) > new Date() ? (
                      <FaCalendarAlt className="mr-2 text-xs" />
                    ) : match.result === "Won" ? (
                      <FaTrophy className="mr-2 text-xs" />
                    ) : match.result === "Lost" ? (
                      <FaTimesCircle className="mr-2 text-xs" />
                    ) : (
                      <FaHandshake className="mr-2 text-xs" />
                    )}
                    <span className="font-medium text-xs">
                      {new Date(match.date) > new Date()
                        ? "Upcoming Match"
                        : `${match.result} - ${new Date(match.date).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-400">Our Team</p>
                      <p className="font-medium text-white text-sm">KNGC</p>
                    </div>

                    <div className="mx-4 text-center">
                      <p className="text-xs text-gray-500">vs</p>
                    </div>

                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-400">Opponent</p>
                      <p className="font-medium text-white text-sm">{match.opponent}</p>
                    </div>
                  </div>

                  {match.score && (
                    <div className="mb-4 text-center">
                      <p className="text-sm font-medium text-white">{match.score}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between text-xs text-gray-400">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="mr-1 text-xs text-emerald-500" />
                      <span className="text-xs">{match.venue}</span>
                    </div>
                    <div>
                      <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs">{match.format}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800">
                    <Link
                      to={`/matches/${match._id}`}
                      className="inline-flex items-center justify-center w-full py-1.5 px-3 border border-transparent rounded-md text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                    >
                      <FaInfoCircle className="mr-2 text-xs" />
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
