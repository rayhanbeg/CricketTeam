import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-3xl font-medium text-emerald-500">404</h1>
      <h2 className="mt-4 text-lg font-medium text-white">Page Not Found</h2>
      <p className="mt-2 text-xs text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
