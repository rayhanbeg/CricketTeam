

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPlayers, deletePlayer, reset } from "../../features/players/playerSlice"
import { toast } from "react-toastify"
import { FaEdit, FaTrash, FaPlus, FaChartLine, FaSearch } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import PlayerModal from "../../components/admin/PlayerModal"
import PlayerStatsModal from "../../components/admin/PlayerStatsModal"

const PlayersTab = () => {
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false)
  const [isPlayerStatsModalOpen, setIsPlayerStatsModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredPlayers =
    players?.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.role.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h2 className="text-base font-medium text-purple-400">Players Management</h2>
          <p className="mt-2 text-xs text-gray-400">Add, edit, and manage all players in the cricket team.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={openAddPlayerModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-1.5 text-xs font-medium text-white hover:from-purple-700 hover:to-purple-800 focus:outline-none transition-colors shadow-lg shadow-purple-900/20"
          >
            <FaPlus className="mr-2 text-xs" /> Add Player
          </button>
        </div>
      </div>

      <div className="mt-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-700 rounded-md bg-zinc-800/50 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-3 w-3 text-gray-500" />
        </div>
      </div>

      {isPlayerModalOpen && (
        <PlayerModal isOpen={isPlayerModalOpen} onClose={closePlayerModal} player={selectedPlayer} />
      )}

      {isPlayerStatsModalOpen && (
        <PlayerStatsModal isOpen={isPlayerStatsModalOpen} onClose={closePlayerStatsModal} player={selectedPlayer} />
      )}

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-lg shadow-purple-900/10 border border-purple-900/30 rounded-lg">
              <table className="min-w-full divide-y divide-zinc-800/70">
                <thead className="bg-gradient-to-r from-purple-900/30 to-zinc-900">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-400 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Jersey Number
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Age
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <tr key={player._id} className="hover:bg-purple-900/10 transition-colors">
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-xs font-medium text-white sm:pl-6">
                          {player.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{player.role}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">
                          <span className="px-2 py-0.5 bg-purple-900/20 rounded-full text-purple-400 border border-purple-900/30">
                            {player.jerseyNumber}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{player.age}</td>
                        <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                          <button
                            onClick={() => openPlayerStatsModal(player)}
                            className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                          >
                            <FaChartLine className="inline mr-1 text-xs" /> Stats
                          </button>
                          <button
                            onClick={() => openEditPlayerModal(player)}
                            className="text-cyan-400 hover:text-cyan-300 mr-3 transition-colors"
                          >
                            <FaEdit className="inline mr-1 text-xs" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <FaTrash className="inline mr-1 text-xs" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-xs text-center text-gray-400">
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
