

import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getPlayerById } from "../features/players/playerSlice"
import Spinner from "../components/layout/Spinner"
import { FaEdit } from "react-icons/fa"

const PlayerDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { player, isLoading } = useSelector((state) => state.players)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getPlayerById(id))
  }, [dispatch, id])

  if (isLoading || !player) {
    return <Spinner />
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:items-start lg:space-x-8">
          <div className="lg:w-1/3">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg border border-zinc-800">
              <img
                src={player.imageUrl || `/placeholder.svg?height=400&width=300`}
                alt={player.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {user && user.role === "admin" && (
              <div className="mt-4">
                <Link
                  to={`/admin`}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  <FaEdit className="mr-2 text-xs" /> Edit Player
                </Link>
              </div>
            )}
          </div>
          <div className="mt-8 lg:mt-0 lg:w-2/3">
            <h1 className="text-xl font-medium text-white">{player.name}</h1>
            <p className="mt-2 text-sm text-gray-400">{player.role}</p>

            <div className="mt-6 border-t border-zinc-800 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-gray-400">Jersey Number</dt>
                  <dd className="mt-1 text-xs text-white">{player.jerseyNumber || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400">Age</dt>
                  <dd className="mt-1 text-xs text-white">{player.age || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400">Experience</dt>
                  <dd className="mt-1 text-xs text-white">{player.experience || "N/A"} years</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-6">
              <h2 className="text-sm font-medium text-white">Statistics</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Matches Played</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.matches || 0}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Total Runs</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.runs || 0}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Total Wickets</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.wickets || 0}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Batting Average</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.average || "0.00"}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Bowling Economy</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.economy || "0.00"}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Strike Rate</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.strikeRate || "0.00"}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Highest Score</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.highestScore || "0"}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Best Bowling Figures</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.bestFigures || "0/0"}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Number of Fifties</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.fifties || 0}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Number of Hundreds</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.hundreds || 0}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Five Wicket Hauls</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.fiveWickets || 0}</dd>
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <dt className="text-xs font-medium text-gray-400">Player Rating (0-10)</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{player.stats?.rating || 0}</dd>
                </div>
              </div>
            </div>

            {player.bio && (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <h2 className="text-sm font-medium text-white">Biography</h2>
                <div className="mt-4 text-xs text-gray-400">
                  <p>{player.bio}</p>
                </div>
              </div>
            )}

            {player.recentPerformance && player.recentPerformance.length > 0 && (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <h2 className="text-sm font-medium text-white">Recent Performances</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-zinc-800">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Match</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Date</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Runs</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">Wickets</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {player.recentPerformance.map((perf, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400">{perf.match}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400">
                            {new Date(perf.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400">{perf.runs}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400">{perf.wickets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(!player.recentPerformance || player.recentPerformance.length === 0) && (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <h2 className="text-sm font-medium text-white">Recent Performances</h2>
                <p className="mt-2 text-xs text-gray-400">No recent performances recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetail
