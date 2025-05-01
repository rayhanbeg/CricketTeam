"use client"

import { Link } from "react-router-dom"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getMatches } from "../features/matches/matchSlice"
import { getPlayers } from "../features/players/playerSlice"
import { FaTrophy, FaCalendarAlt, FaUsers, FaChartLine } from "react-icons/fa"

const Home = () => {
  const dispatch = useDispatch()
  const { matches } = useSelector((state) => state.matches)
  const { players } = useSelector((state) => state.players)

  useEffect(() => {
    dispatch(getMatches())
    dispatch(getPlayers())
  }, [dispatch])

  // Get upcoming matches (assuming matches are sorted by date)
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

  return (
    <div>
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Kabi Nazrul College Cricket Team
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Welcome to the official website of the Kabi Nazrul Government College English Department Cricket Team.
              Follow our matches, player stats, and team news.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/players"
                className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                View Players
              </Link>
              <Link to="/stats" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Team Stats <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Team Achievements Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Team Achievements
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our team's accomplishments over the years
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-8 sm:max-w-xl lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <FaTrophy className="text-5xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Inter-College Champions</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">2023 District Tournament</p>
            </div>
            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <FaTrophy className="text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Runners-Up</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">2022 Regional Championship</p>
            </div>
            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <FaTrophy className="text-5xl text-amber-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Third Place</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">2021 National College Tournament</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Matches Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Upcoming Matches
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Support our team in these upcoming fixtures
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-8 sm:max-w-xl lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <div
                  key={match._id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-700"
                >
                  <div className="bg-green-600 px-4 py-2 text-white text-center">
                    <FaCalendarAlt className="inline-block mr-2" />
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
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
                      <div className="mt-4">
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Venue:</span> {match.venue}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Format:</span> {match.format}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No upcoming matches scheduled</p>
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/matches" className="text-green-600 hover:text-green-500 font-semibold inline-flex items-center">
              View all matches{" "}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Players Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Players
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Meet the stars of our cricket team
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-8 sm:max-w-xl lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {topPlayers.length > 0 ? (
              topPlayers.map((player) => (
                <Link
                  to={`/players/${player._id}`}
                  key={player._id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-700 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-600">
                    <img
                      src={player.imageUrl || `/placeholder.svg?height=192&width=256`}
                      alt={player.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{player.name}</h3>
                      <p className="mt-1 text-base text-gray-600 dark:text-gray-300">{player.role}</p>
                      <div className="mt-3 flex items-center">
                        <FaUsers className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Jersey #{player.jerseyNumber}</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <FaChartLine className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Rating: {player.stats?.rating || "N/A"}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No players available</p>
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/players" className="text-green-600 hover:text-green-500 font-semibold inline-flex items-center">
              View all players{" "}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Results Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Recent Results
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Check out how our team has been performing
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-8 sm:max-w-xl lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div
                  key={match._id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-700"
                >
                  <div
                    className={`px-4 py-2 text-white text-center ${
                      match.result === "Won" ? "bg-green-600" : match.result === "Lost" ? "bg-red-600" : "bg-yellow-600"
                    }`}
                  >
                    {match.result}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(match.date).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
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
                      <div className="mt-4">
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Venue:</span> {match.venue}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Format:</span> {match.format}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No recent matches available</p>
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/matches" className="text-green-600 hover:text-green-500 font-semibold inline-flex items-center">
              View all results{" "}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
