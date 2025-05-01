"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMatches, deleteMatch, reset } from "../../features/matches/matchSlice"
import { toast } from "react-toastify"
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import SimpleMatchForm from "../../components/admin/SimpleMatchForm"

const MatchesTab = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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

      // Apply result filter
      if (filter === "won") {
        filtered = filtered.filter((match) => match.result === "Won")
      } else if (filter === "lost") {
        filtered = filtered.filter((match) => match.result === "Lost")
      } else if (filter === "draw") {
        filtered = filtered.filter((match) => match.result === "Draw")
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (match) =>
            match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.venue.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

      setFilteredMatches(filtered)
    }
  }, [matches, filter, searchTerm])

  const openAddModal = () => {
    setSelectedMatch(null)
    setIsAddModalOpen(true)
  }

  const openEditModal = (match) => {
    setSelectedMatch(match)
    setIsEditModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    dispatch(getMatches())
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Matches</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all the matches played by the cricket team.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto transition-colors duration-150"
          >
            <FaPlus className="mr-2" /> Add Match
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-150"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <FaFilter className="text-gray-500 dark:text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300 text-sm"
          >
            <option value="all">All Matches</option>
            <option value="won">Won Matches</option>
            <option value="lost">Lost Matches</option>
            <option value="draw">Draw Matches</option>
          </select>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Match</h3>
                <button
                  onClick={closeAddModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-150"
                >
                  &times;
                </button>
              </div>
              <SimpleMatchForm onSuccess={closeAddModal} />
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Match</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-150"
                >
                  &times;
                </button>
              </div>
              <SimpleMatchForm match={selectedMatch} onSuccess={closeEditModal} />
            </div>
          </div>
        </div>
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
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Opponent
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Venue
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Result
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Players
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => (
                      <tr key={match._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {new Date(match.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {match.opponent}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {match.venue}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              match.result === "Won"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : match.result === "Lost"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {match.result}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {match.playerPerformances ? match.playerPerformances.length : 0} players
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => openEditModal(match)}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-4 transition-colors duration-150"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMatch(match._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors duration-150"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
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
