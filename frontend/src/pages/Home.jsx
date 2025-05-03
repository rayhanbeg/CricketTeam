

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getMatches } from "../features/matches/matchSlice"
import { getPlayers } from "../features/players/playerSlice"
import {
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaChartLine,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaMedal,
  FaRunning,
  FaChartBar,
} from "react-icons/fa"
import { MdOutlineSportsCricket } from "react-icons/md"

import Spinner from "../components/layout/Spinner"

const Home = () => {
  const dispatch = useDispatch()
  const { matches } = useSelector((state) => state.matches)
  const { players } = useSelector((state) => state.players)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([dispatch(getMatches()), dispatch(getPlayers())])
      setIsLoading(false)
    }
    fetchData()
  }, [dispatch])

  // Get upcoming matches
  const upcomingMatches = matches
    ? matches
        .filter((match) => new Date(match.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
    : []

  // Get recent matches
  const recentMatches = matches
    ? matches
        .filter((match) => new Date(match.date) <= new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    : []

  // Get top players (by rating)
  const topPlayers = players
    ? [...players].sort((a, b) => (b.stats?.rating || 0) - (a.stats?.rating || 0)).slice(0, 4)
    : []

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1494&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        <div className="relative z-20 px-4 py-24 sm:px-6 lg:px-8 lg:py-32 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 sm:text-4xl md:text-5xl">
              Kabi Nazrul College Cricket Team
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-sm text-gray-300">
              Excellence in cricket, representing Kabi Nazrul Government College with pride and passion.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                to="/matches"
                className="rounded-md bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-xs font-medium text-white hover:from-purple-700 hover:to-purple-800 focus:outline-none transition-all duration-300 shadow-lg shadow-purple-900/20"
              >
                View Matches
              </Link>
              <Link
                to="/players"
                className="rounded-md bg-gradient-to-r from-zinc-800 to-zinc-900 px-4 py-2 text-xs font-medium text-white hover:from-zinc-700 hover:to-zinc-800 focus:outline-none transition-all duration-300 border border-zinc-700/50"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Next Match Countdown */}
      {upcomingMatches.length > 0 && (
        <div className="relative -mt-10 z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-purple-900/30 shadow-lg shadow-purple-900/10">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-sm font-medium text-white">Next Match</h2>
                  <div className="mt-2 flex items-center text-purple-400">
                    <FaCalendarAlt className="mr-2 text-xs" />
                    <span className="text-xs">
                      {new Date(upcomingMatches[0].date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-medium text-white">vs {upcomingMatches[0].opponent}</h3>
                  <div className="mt-2 flex items-center text-gray-400">
                    <FaMapMarkerAlt className="mr-2 text-xs" />
                    <span className="text-xs">{upcomingMatches[0].venue}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 mx-auto border border-purple-900/30">
                      <FaClock className="text-purple-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Coming Soon</p>
                  </div>
                  <Link
                    to={`/matches/${upcomingMatches[0]._id}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-colors shadow-lg shadow-purple-900/20"
                  >
                    Match Details <FaArrowRight className="ml-2 text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Stats Overview */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Team Performance
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xs text-gray-400">
              Our cricket team's achievements and statistics
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-4 py-5 bg-zinc-900 rounded-lg border border-zinc-800 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-900/30">
                      <FaTrophy className="text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-lg font-medium">
                      {recentMatches.filter((match) => match.result === "Won").length}
                    </p>
                    <p className="text-gray-400 text-xs">Total Wins</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-4 py-5 bg-zinc-900 rounded-lg border border-zinc-800 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 border border-cyan-900/30">
                      <MdOutlineSportsCricket className="text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-lg font-medium">{recentMatches.length}</p>
                    <p className="text-gray-400 text-xs">Matches Played</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-pink-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-4 py-5 bg-zinc-900 rounded-lg border border-zinc-800 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-900/30 to-pink-800/30 border border-pink-900/30">
                      <FaRunning className="text-pink-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-lg font-medium">
                      {recentMatches.reduce((total, match) => {
                        const scoreStr = match.score || ""
                        const ourScoreMatch = scoreStr.match(/(\d+)\s*\/\s*\d+/)
                        return total + (ourScoreMatch ? Number.parseInt(ourScoreMatch[1], 10) : 0)
                      }, 0)}
                    </p>
                    <p className="text-gray-400 text-xs">Total Runs</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-4 py-5 bg-zinc-900 rounded-lg border border-zinc-800 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-900/30 to-amber-800/30 border border-amber-900/30">
                      <FaMedal className="text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-lg font-medium">
                      {recentMatches.length > 0
                        ? Math.round(
                            (recentMatches.filter((match) => match.result === "Won").length / recentMatches.length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-gray-400 text-xs">Win Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Section with Tabs */}
      <div className="py-12 bg-zinc-900/30 backdrop-blur-sm rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Cricket Matches
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xs text-gray-400">
              Follow our team's journey through upcoming and recent matches
            </p>
          </div>

          <div className="mt-10">
            <div className="border-b border-zinc-800/50">
              <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`${
                    activeTab === "upcoming"
                      ? "border-cyan-500 text-cyan-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs transition-colors duration-200`}
                >
                  Upcoming Matches
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`${
                    activeTab === "recent"
                      ? "border-cyan-500 text-cyan-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs transition-colors duration-200`}
                >
                  Recent Results
                </button>
              </nav>
            </div>

            <div className="mt-8">
              {activeTab === "upcoming" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingMatches.length > 0 ? (
                    upcomingMatches.map((match) => (
                      <div
                        key={match._id}
                        className="bg-zinc-900/80 backdrop-blur-sm overflow-hidden rounded-lg border border-blue-900/30 hover:border-blue-700/50 transition-all duration-300 shadow-lg shadow-blue-900/5 group"
                      >
                        <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 px-4 py-3 text-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2 text-xs" />
                              <span className="font-medium text-xs">{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                            <span className="px-2 py-1 bg-zinc-800/70 rounded-full text-xs">{match.format}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center w-5/12">
                              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center border border-zinc-700/50 group-hover:border-blue-700/50 transition-all duration-300">
                                <span className="text-sm font-medium text-white">KNC</span>
                              </div>
                              <p className="mt-2 text-xs text-gray-300">Our Team</p>
                            </div>
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-full flex items-center justify-center border border-blue-900/30">
                                <span className="text-xs font-medium text-blue-400">VS</span>
                              </div>
                            </div>
                            <div className="text-center w-5/12">
                              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center border border-zinc-700/50 group-hover:border-blue-700/50 transition-all duration-300">
                                <span className="text-sm font-medium text-white">
                                  {match.opponent.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <p className="mt-2 text-xs text-gray-300">{match.opponent}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center text-gray-400 mb-2">
                              <FaMapMarkerAlt className="mr-2 text-xs text-blue-400" />
                              <span className="text-xs">{match.venue}</span>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <Link
                              to={`/matches/${match._id}`}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                            >
                              Match Details <FaArrowRight className="ml-2 text-xs" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800">
                      <FaCalendarAlt className="mx-auto h-8 w-8 text-gray-500" />
                      <h3 className="mt-2 text-xs font-medium text-white">No upcoming matches</h3>
                      <p className="mt-1 text-xs text-gray-400">Check back later for upcoming match schedules.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "recent" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentMatches.length > 0 ? (
                    recentMatches.map((match) => (
                      <div
                        key={match._id}
                        className="bg-zinc-900/80 backdrop-blur-sm overflow-hidden rounded-lg border border-cyan-900/30 hover:border-cyan-700/50 transition-all duration-300 shadow-lg shadow-cyan-900/5 group"
                      >
                        <div
                          className={`px-4 py-3 text-white ${
                            match.result === "Won"
                              ? "bg-gradient-to-r from-emerald-900/50 to-emerald-800/30"
                              : match.result === "Lost"
                                ? "bg-gradient-to-r from-red-900/50 to-red-800/30"
                                : "bg-gradient-to-r from-amber-900/50 to-amber-800/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2 text-xs" />
                              <span className="font-medium text-xs">{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                            <span className="font-medium text-xs">{match.result}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center w-5/12">
                              <p className="text-xs font-medium text-white">Our Team</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-white">VS</p>
                            </div>
                            <div className="text-center w-5/12">
                              <p className="text-xs font-medium text-white">{match.opponent}</p>
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <p className="text-sm font-medium text-white">{match.score}</p>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center text-gray-400 mb-2">
                              <FaMapMarkerAlt className="mr-2 text-xs text-cyan-400" />
                              <span className="text-xs">{match.venue}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <FaChartBar className="mr-2 text-xs text-cyan-400" />
                              <span className="text-xs">{match.format}</span>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <Link
                              to={`/matches/${match._id}`}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 transition-colors shadow-lg shadow-cyan-900/20"
                            >
                              Match Details <FaArrowRight className="ml-2 text-xs" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800">
                      <FaChartLine className="mx-auto h-8 w-8 text-gray-500" />
                      <h3 className="mt-2 text-xs font-medium text-white">No recent matches</h3>
                      <p className="mt-1 text-xs text-gray-400">Check back after our upcoming matches for results.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/matches"
                className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 transition-colors shadow-lg shadow-cyan-900/20"
              >
                View All Matches <FaArrowRight className="ml-2 text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Players Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Featured Players
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xs text-gray-400">
              Meet the stars who make our team shine on the cricket field
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topPlayers.length > 0 ? (
              topPlayers.map((player) => (
                <Link to={`/players/${player._id}`} key={player._id} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-pink-700/50 transition-all duration-300">
                    <img
                      src={player.imageUrl || `/placeholder.svg?height=320&width=240`}
                      alt={player.name}
                      className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg shadow-pink-900/20">
                        #{player.jerseyNumber}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-white group-hover:text-pink-400 transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-xs text-gray-400">{player.role}</p>
                      <div className="mt-2 flex items-center">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full">
                          <div
                            className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                            style={{ width: `${(player.stats?.rating || 0) * 10}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-400">{player.stats?.rating || 0}/10</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800">
                <FaUsers className="mx-auto h-8 w-8 text-gray-500" />
                <h3 className="mt-2 text-xs font-medium text-white">No players available</h3>
                <p className="mt-1 text-xs text-gray-400">Check back later to meet our team members.</p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/players"
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-md text-white bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 transition-colors shadow-lg shadow-purple-900/20"
            >
              View All Players <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-zinc-900/50 to-black/50 backdrop-blur-sm border-t border-zinc-800/50 rounded-xl">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-xl font-medium tracking-tight text-white">
            <span className="block">Ready to join our journey?</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-sm mt-1">
              Support our cricket team today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <Link
              to="/matches"
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-md bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-700 hover:to-zinc-800 transition-colors border border-zinc-700/50"
            >
              Upcoming Matches
            </Link>
            <Link
              to="/stats"
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-md bg-gradient-to-r from-purple-600 to-cyan-700 text-white hover:from-purple-700 hover:to-cyan-800 transition-colors shadow-lg shadow-purple-900/20"
            >
              Team Statistics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
