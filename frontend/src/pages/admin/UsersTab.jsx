

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, deleteUser, reset } from "../../features/users/userSlice"
import { toast } from "react-toastify"
import { FaEdit, FaTrash, FaSearch, FaUserCircle } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import UserModal from "../../components/admin/UserModal"

const UsersTab = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const dispatch = useDispatch()
  const { users, isLoading, isSuccess, isError, message } = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  useEffect(() => {
    if (isSuccess && isDeleting) {
      toast.success("User deleted successfully")
      setIsDeleting(false)
      dispatch(reset())
    }

    if (isError) {
      toast.error(message || "Something went wrong")
      dispatch(reset())
    }
  }, [isSuccess, isError, message, isDeleting, dispatch])

  const openEditUserModal = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const closeUserModal = () => {
    setIsUserModalOpen(false)
    setSelectedUser(null)
    dispatch(getUsers())
  }

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsDeleting(true)
      dispatch(deleteUser(id))
    }
  }

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-base font-medium text-amber-400">Users Management</h2>
          <p className="mt-2 text-xs text-gray-400">Manage user accounts and permissions.</p>
        </div>
      </div>

      <div className="mt-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-700 rounded-md bg-zinc-800/50 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 backdrop-blur-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-3 w-3 text-gray-500" />
        </div>
      </div>

      {isUserModalOpen && <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} user={selectedUser} />}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-lg shadow-amber-900/10 border border-amber-900/30 rounded-lg">
              <table className="min-w-full divide-y divide-zinc-800/70">
                <thead className="bg-gradient-to-r from-amber-900/30 to-zinc-900">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-400 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                      Joined
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-amber-900/10 transition-colors">
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-xs font-medium text-white sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-6 w-6 flex-shrink-0 mr-2">
                              <FaUserCircle className="h-full w-full text-amber-400" />
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">{user.email}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-900/30 text-purple-400 border border-purple-900/30"
                                : user.role === "player"
                                  ? "bg-cyan-900/30 text-cyan-400 border border-cyan-900/30"
                                  : "bg-zinc-800/70 text-gray-300 border border-zinc-700/30"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="text-amber-400 hover:text-amber-300 mr-3 transition-colors"
                          >
                            <FaEdit className="inline mr-1 text-xs" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
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
                        No users found
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

export default UsersTab
