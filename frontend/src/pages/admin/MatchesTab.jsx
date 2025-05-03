"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMatches, deleteMatch, reset } from "../../features/matches/matchSlice"
import { toast } from "react-toastify"
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaCalendarPlus } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import SimpleMatchForm from "../../components/admin/SimpleMatchForm"
import UpcomingMatchForm from "../../components/admin/UpcomingMatchForm"

const MatchesTab = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false)
  const [isEditUpcomingModalOpen, setIsEditUpcomingModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [filteredMatches, setFilteredMatches] = useState([])

  const dispatch = useDispatch()
  const { matches, isLoading, isSuccess, isError, message } = useSelector((state) => state.matches)

  useEffect(() => {
    dispatch(getMatches())
  }, [dispatch])

  useEffect(() => {
    if (isSuccess && isDeleting) {
      toast.success("Match deleted successfully")
      setIsDeleting(false)
      dispatch(reset())
    }

    if (isError) {
      toast.error(message || "Something went wrong")
      dispatch(reset())
    }
  }, [isSuccess, isError, message, isDeleting, dispatch])

  useEffect(() => {
    if (matches) {
      let filtered = [...matches]
      const now = new Date()

      // Apply result filter
      if (filter === "won") {
        filtered = filtered.filter((match) => match.result === "Won")
      } else if (filter === "lost") {
        filtered = filtered.filter((match) => match.result === "Lost")
      } else if (filter === "draw") {
        filtered = filtered.filter((match) => match.result === "Draw")
      } else if (filter === "upcoming") {
        filtered = filtered.filter((match) => new Date(match.date) > now)
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (match) =>
            match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.venue.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Sort by date (newest first for past matches, soonest first for upcoming)
      if (filter === "upcoming") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
      } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      }

      setFilteredMatches(filtered)
    }
  }, [matches, filter, searchTerm])

  const openAddModal = () => {
    setSelectedMatch(null)
    setIsAddModalOpen(true)
  }

  const openUpcomingModal = () => {
    setSelectedMatch(null)
    setIsUpcomingModalOpen(true)
  }

  const openEditModal = (match) => {
    setSelectedMatch(match)
    const isUpcoming = new Date(match.date) > new Date()

    if (isUpcoming) {
      setIsEditUpcomingModalOpen(true)
    } else {
      setIsEditModalOpen(true)
    }
  }

  const closeModals = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setIsUpcomingModalOpen(false)
    setIsEditUpcomingModalOpen(false)
    setSelectedMatch(null)
    dispatch(getMatches())
  }

  const handleDeleteMatch = (id) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      setIsDeleting(true)
      dispatch(deleteMatch(id))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h2 className="text-base font-medium text-cyan-400">Matches Management</h2>
          <p className="mt-2 text-xs text-gray-400">Schedule, record, and manage all cricket matches.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
          <button
            type="button"
            onClick={openUpcomingModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none transition-colors shadow-lg shadow-blue-900/20"
          >
            <FaCalendarPlus className="mr-2 text-xs" /> Add Upcoming Match
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-1.5 text-xs font-medium text-white hover:from-cyan-700 hover:to-cyan-800 focus:outline-none transition-colors shadow-lg shadow-cyan-900/20"
          >
            <FaPlus className="mr-2 text-xs" /> Add Completed Match
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search by opponent or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-700 rounded-md bg-zinc-800/50 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-3 w-3 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-zinc-800/50 p-2 rounded-md border border-zinc-700/50 backdrop-blur-sm">
          <FaFilter className="text-gray-500 text-xs" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-gray-300 text-xs"
          >
            <option value="all">All Matches</option>
            <option value="upcoming">Upcoming Matches</option>
            <option value="won">Won Matches</option>
            <option value="lost">Lost Matches</option>
            <option value="draw">Draw Matches</option>
          </select>
        </div>
      </div>

      {/* Add Completed Match Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-cyan-900/30 shadow-lg shadow-cyan-900/20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium text-cyan-400">Add Completed Match</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
                >
                  &times;
                </button>
              </div>
              <SimpleMatchForm onSuccess={closeModals} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Completed Match Modal */}
      {isEditModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-cyan-900/30 shadow-lg shadow-cyan-900/20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium text-cyan-400">Edit Completed Match</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
                >
                  &times;
                </button>
              </div>
              <SimpleMatchForm match={selectedMatch} onSuccess={closeModals} />
            </div>
          </div>
        </div>
      )}

      {/* Add Upcoming Match Modal */}
      {isUpcomingModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-900/30 shadow-lg shadow-blue-900/20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium text-blue-400">Add Upcoming Match</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
                >
                  &times;
                </button>
              </div>
              <UpcomingMatchForm onSuccess={closeModals} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Upcoming Match Modal */}
      {isEditUpcomingModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-900/30 shadow-lg shadow-blue-900/20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium text-blue-400">Edit Upcoming Match</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
                >
                  &times;
                </button>
              </div>
              <UpcomingMatchForm match={selectedMatch} onSuccess={closeModals} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-lg shadow-cyan-900/10 border border-cyan-900/30 rounded-lg">
              <table className="min-w-full divide-y divide-zinc-800/70">
                <thead className="bg-gradient-to-r from-cyan-900/30 to-zinc-900">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-400 sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Opponent
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Venue
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Format
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Status
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
                  {filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => {
                      const isUpcoming = new Date(match.date) > new Date()
                      return (
                        <tr key={match._id} className={isUpcoming ? "bg-blue-900/10" : ""}>
                          <td className="whitespace-nowrap py-3 pl-4 pr-3 text-xs font-medium text-white sm:pl-6">
                            {new Date(match.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{match.opponent}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{match.venue}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">
                            <span className="px-2 py-0.5 bg-zinc-800/70 rounded-full">{match.format}</span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-xs">
                            {isUpcoming ? (
                              <span className="inline-flex rounded-full px-2 text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/30">
                                Upcoming
                              </span>
                            ) : (
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-medium ${
                                  match.result === "Won"
                                    ? "bg-emerald-900/30 text-emerald-400 border border-emerald-900/30"
                                    : match.result === "Lost"
                                      ? "bg-red-900/30 text-red-400 border border-red-900/30"
                                      : "bg-amber-900/30 text-amber-400 border border-amber-900/30"
                                }`}
                              >
                                {match.result}
                              </span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                            <button
                              onClick={() => openEditModal(match)}
                              className="text-cyan-400 hover:text-cyan-300 mr-3 transition-colors"
                            >
                              <FaEdit className="inline mr-1 text-xs" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMatch(match._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FaTrash className="inline mr-1 text-xs" /> Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-3 text-xs text-center text-gray-400">
                        No matches found
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

export default MatchesTab
