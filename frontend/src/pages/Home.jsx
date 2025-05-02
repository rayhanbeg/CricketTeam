

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
import { MdOutlineSportsCricket } from "react-icons/md";

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
    <div className="overflow-auto bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-700/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/Ffj5WWP/alessandro-bogliari-o-Ds-Axe-R5g4-unsplash.jpg')] bg-cover bg-center"></div>
        <div className="relative z-20 px-4 py-24 sm:px-6 lg:px-8 lg:py-32 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg">
              Kabi Nazrul College Cricket Team
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-green-100">
              Excellence in cricket, representing Kabi Nazrul Government College with pride and passion.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                to="/matches"
                className="rounded-md bg-green-600 px-5 py-3 text-base font-medium text-white shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
              >
                View Matches
              </Link>
              <Link
                to="/players"
                className="rounded-md bg-white/20 backdrop-blur-sm px-5 py-3 text-base font-medium text-white shadow-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Next Match</h2>
                  <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      {new Date(upcomingMatches[0].date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                    vs {upcomingMatches[0].opponent}
                  </h3>
                  <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{upcomingMatches[0].venue}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mx-auto">
                      <FaClock className="text-2xl text-green-600 dark:text-green-400" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Coming Soon</p>
                  </div>
                  <Link
                    to={`/matches/${upcomingMatches[0]._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Match Details <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Stats Overview */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Team Performance
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Our cricket team's achievements and statistics
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-5 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-gray-200/10 rounded-lg leading-none flex items-top justify-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                      <FaTrophy className="text-2xl text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white text-2xl font-bold">
                      {recentMatches.filter((match) => match.result === "Won").length}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">Total Wins</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-5 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-gray-200/10 rounded-lg leading-none flex items-top justify-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                      <MdOutlineSportsCricket className="text-2xl text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white text-2xl font-bold">{recentMatches.length}</p>
                    <p className="text-slate-600 dark:text-slate-300">Matches Played</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-5 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-gray-200/10 rounded-lg leading-none flex items-top justify-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                      <FaRunning className="text-2xl text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white text-2xl font-bold">
                      {recentMatches.reduce((total, match) => {
                        const scoreStr = match.score || ""
                        const ourScoreMatch = scoreStr.match(/(\d+)\s*\/\s*\d+/)
                        return total + (ourScoreMatch ? Number.parseInt(ourScoreMatch[1], 10) : 0)
                      }, 0)}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">Total Runs</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-5 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-gray-200/10 rounded-lg leading-none flex items-top justify-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                      <FaMedal className="text-2xl text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white text-2xl font-bold">
                      {recentMatches.length > 0
                        ? Math.round(
                            (recentMatches.filter((match) => match.result === "Won").length / recentMatches.length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">Win Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Section with Tabs */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Cricket Matches
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Follow our team's journey through upcoming and recent matches
            </p>
          </div>

          <div className="mt-10">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`${
                    activeTab === "upcoming"
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
                >
                  Upcoming Matches
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`${
                    activeTab === "recent"
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
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
                        className="bg-white dark:bg-gray-700 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 text-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2" />
                              <span className="font-medium">{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                              {match.format}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center w-5/12">
                              <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-700 dark:text-gray-200">KNC</span>
                              </div>
                              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Our Team</p>
                            </div>
                            <div className="text-center">
                              <div className="w-10 h-10 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">VS</span>
                              </div>
                            </div>
                            <div className="text-center w-5/12">
                              <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-700 dark:text-gray-200">
                                  {match.opponent.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{match.opponent}</p>
                            </div>
                          </div>
                          <div className="mt-6">
                            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                              <FaMapMarkerAlt className="mr-2 text-green-500 dark:text-green-400" />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                          <div className="mt-6 text-center">
                            <Link
                              to={`/matches/${match._id}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                              Match Details <FaArrowRight className="ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming matches</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Check back later for upcoming match schedules.
                      </p>
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
                        className="bg-white dark:bg-gray-700 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div
                          className={`px-4 py-3 text-white ${
                            match.result === "Won"
                              ? "bg-gradient-to-r from-green-600 to-green-500"
                              : match.result === "Lost"
                                ? "bg-gradient-to-r from-red-600 to-red-500"
                                : "bg-gradient-to-r from-yellow-600 to-yellow-500"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2" />
                              <span className="font-medium">{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                            <span className="font-bold">{match.result}</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center w-5/12">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">Our Team</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">VS</p>
                            </div>
                            <div className="text-center w-5/12">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{match.opponent}</p>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{match.score}</p>
                          </div>
                          <div className="mt-6">
                            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                              <FaMapMarkerAlt className="mr-2 text-green-500 dark:text-green-400" />
                              <span>{match.venue}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <FaChartBar className="mr-2 text-green-500 dark:text-green-400" />
                              <span>{match.format}</span>
                            </div>
                          </div>
                          <div className="mt-6 text-center">
                            <Link
                              to={`/matches/${match._id}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                              Match Details <FaArrowRight className="ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <FaChartLine className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recent matches</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Check back after our upcoming matches for results.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/matches"
                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-all duration-200"
              >
                View All Matches <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Players Section */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Players
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Meet the stars who make our team shine on the cricket field
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {topPlayers.length > 0 ? (
              topPlayers.map((player) => (
                <Link to={`/players/${player._id}`} key={player._id} className="group relative">
                  <div className="relative w-full h-80 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <img
                      src={player.imageUrl || `/placeholder.svg?height=320&width=240`}
                      alt={player.name}
                      className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        #{player.jerseyNumber}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{player.role}</p>
                      <div className="mt-2 flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-2 bg-green-600 rounded-full"
                            style={{ width: `${(player.stats?.rating || 0) * 10}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {player.stats?.rating || 0}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No players available</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Check back later to meet our team members.
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/players"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-all duration-200"
            >
              View All Players <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-700 dark:bg-green-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to join our journey?</span>
            <span className="block text-green-200">Support our cricket team today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/matches"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors duration-200"
              >
                Upcoming Matches
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/stats"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-500 transition-colors duration-200"
              >
                Team Statistics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
