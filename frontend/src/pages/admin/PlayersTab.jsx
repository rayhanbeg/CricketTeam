

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPlayers, deletePlayer, reset } from "../../features/players/playerSlice"
import { toast } from "react-toastify"
import { FaEdit, FaTrash, FaPlus, FaChartLine } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import PlayerModal from "../../components/admin/PlayerModal"
import PlayerStatsModal from "../../components/admin/PlayerStatsModal"

const PlayersTab = () => {
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false)
  const [isPlayerStatsModalOpen, setIsPlayerStatsModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const dispatch = useDispatch()
  const { players, isLoading, isSuccess, isError, message } = useSelector((state) => state.players)

  useEffect(() => {
    dispatch(getPlayers())
  }, [dispatch])

  useEffect(() => {
    if (isSuccess && isDeleting) {
      toast.success("Player deleted successfully")
      setIsDeleting(false)
      dispatch(reset())
    }

    if (isError) {
      toast.error(message || "Something went wrong")
      dispatch(reset())
    }
  }, [isSuccess, isError, message, isDeleting, dispatch])

  const openAddPlayerModal = () => {
    setSelectedPlayer(null)
    setIsPlayerModalOpen(true)
  }

  const openEditPlayerModal = (player) => {
    setSelectedPlayer(player)
    setIsPlayerModalOpen(true)
  }

  const closePlayerModal = () => {
    setIsPlayerModalOpen(false)
    setSelectedPlayer(null)
    dispatch(getPlayers())
  }

  const openPlayerStatsModal = (player) => {
    setSelectedPlayer(player)
    setIsPlayerStatsModalOpen(true)
  }

  const closePlayerStatsModal = () => {
    setIsPlayerStatsModalOpen(false)
    setSelectedPlayer(null)
    dispatch(getPlayers())
  }

  const handleDeletePlayer = (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      setIsDeleting(true)
      dispatch(deletePlayer(id))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Players</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all the players in the cricket team.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={openAddPlayerModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <FaPlus className="mr-2" /> Add Player
          </button>
        </div>
      </div>

      {isPlayerModalOpen && (
        <PlayerModal isOpen={isPlayerModalOpen} onClose={closePlayerModal} player={selectedPlayer} />
      )}

      {isPlayerStatsModalOpen && (
        <PlayerStatsModal isOpen={isPlayerStatsModalOpen} onClose={closePlayerStatsModal} player={selectedPlayer} />
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Jersey Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Age
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {players && players.length > 0 ? (
                    players.map((player) => (
                      <tr key={player._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {player.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {player.role}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {player.jerseyNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {player.age}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => openPlayerStatsModal(player)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                          >
                            <FaChartLine className="inline mr-1" /> Stats
                          </button>
                          <button
                            onClick={() => openEditPlayerModal(player)}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-4"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                        No players found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayersTab
