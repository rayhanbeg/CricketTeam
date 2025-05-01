import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Spinner from "../layout/Spinner"

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    // Show toast notification
    toast.error("Please log in to access this page")

    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} />
  }

  return children
}

export default PrivateRoute
