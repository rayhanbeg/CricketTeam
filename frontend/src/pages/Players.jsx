

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getPlayers } from "../features/players/playerSlice"
import Spinner from "../components/layout/Spinner"

const Players = () => {
  const dispatch = useDispatch()
  const { players, isLoading } = useSelector((state) => state.players)

  useEffect(() => {
    dispatch(getPlayers())
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="bg-white dark:bg-[#020817]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-semibold leading-6 text-gray-900 dark:text-white">Players</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              A list of all the players in the cricket team including their name, role, and statistics.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {players && players.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {players.map((player) => (
                    <Link
                      to={`/players/${player._id}`}
                      key={player._id}
                      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="aspect-h-4 aspect-w-3 bg-gray-200 dark:bg-gray-700 sm:aspect-none sm:h-48">
                        <img
                          src={player.imageUrl || `/placeholder.svg?height=192&width=256`}
                          alt={player.name}
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      </div>
                      <div className="flex flex-1 flex-col space-y-2 p-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{player.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{player.role}</p>
                        <div className="flex flex-1 flex-col justify-end">
                          <div className="mt-2 flex items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Matches:</span> {player.stats?.matches || 0}
                            </div>
                            <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Runs:</span> {player.stats?.runs || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No players found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Players
