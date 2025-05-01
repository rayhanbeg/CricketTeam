import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Spinner from "../layout/Spinner"

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return <Spinner />
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute
