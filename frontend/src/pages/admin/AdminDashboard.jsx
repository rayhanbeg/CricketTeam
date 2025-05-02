

import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import PlayersTab from "./PlayersTab"
import MatchesTab from "./MatchesTab"
import UsersTab from "./UsersTab"
import StatisticsTab from "./StatisticsTab" // Restored Statistics import

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("players")
  const { user, isLoading: authLoading } = useSelector((state) => state.auth)

  if (authLoading) {
    return <Spinner />
  }

  if (!user || user.role !== "admin") {
    toast.error("You do not have permission to access this page")
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Access Denied</h2>
        <p className="text-red-600 dark:text-red-300">
          You do not have the necessary permissions to access the admin dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

        <div className="mt-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("players")}
                className={`${
                  activeTab === "players"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Players
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`${
                  activeTab === "matches"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Matches
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`${
                  activeTab === "users"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("statistics")}
                className={`${
                  activeTab === "statistics"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Statistics
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === "players" && <PlayersTab />}
            {activeTab === "matches" && <MatchesTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "statistics" && <StatisticsTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
