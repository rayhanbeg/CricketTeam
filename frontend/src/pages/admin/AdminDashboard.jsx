"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import PlayersTab from "./PlayersTab"
import MatchesTab from "./MatchesTab"
import UsersTab from "./UsersTab"
import StatisticsTab from "./StatisticsTab"
import { FaUsers, FaCalendarAlt, FaUserCog, FaChartLine } from "react-icons/fa"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("players")
  const { user, isLoading: authLoading } = useSelector((state) => state.auth)

  if (authLoading) {
    return <Spinner />
  }

  if (!user || user.role !== "admin") {
    toast.error("You do not have permission to access this page")
    return (
      <div className="bg-red-900/20 p-6 rounded-lg border border-red-800/50 text-center backdrop-blur-sm">
        <h2 className="text-base font-medium text-red-400 mb-2">Access Denied</h2>
        <p className="text-xs text-red-300">You do not have the necessary permissions to access the admin dashboard.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-6 rounded-lg mb-8 backdrop-blur-sm border border-purple-900/30">
          <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Manage players, matches, users, and statistics for the cricket team.
          </p>
        </div>

        <div className="mt-8">
          <div className="border-b border-zinc-800/50">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("players")}
                className={`${
                  activeTab === "players"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors flex items-center`}
              >
                <FaUsers className="mr-2 text-xs" />
                Players
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`${
                  activeTab === "matches"
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors flex items-center`}
              >
                <FaCalendarAlt className="mr-2 text-xs" />
                Matches
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`${
                  activeTab === "users"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors flex items-center`}
              >
                <FaUserCog className="mr-2 text-xs" />
                Users
              </button>
              <button
                onClick={() => setActiveTab("statistics")}
                className={`${
                  activeTab === "statistics"
                    ? "border-pink-500 text-pink-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors flex items-center`}
              >
                <FaChartLine className="mr-2 text-xs" />
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
