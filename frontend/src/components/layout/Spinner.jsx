function Spinner() {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-dark-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-t-primary-500 border-r-transparent border-b-secondary-500 border-l-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
        <div className="w-8 h-8 border-4 border-t-accent-500 border-r-transparent border-b-transparent border-l-transparent rounded-full absolute top-4 left-4 animate-spin-slow"></div>
      </div>
    </div>
  )
}

export default Spinner
