import { Link } from "react-router-dom";
import {
  FiGithub,
  FiTwitter,
  FiInstagram,
  FiFacebook,
  FiYoutube,
} from "react-icons/fi";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-tr from-gray-900 to-gray-800 text-gray-300 py-8 shadow-inner rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Logo + Description */}
        <div className="text-center md:text-left space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center md:justify-start space-x-2"
          >
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Cricket Team
            </span>
          </Link>
          <p className="text-sm text-gray-400">Chasing boundaries together.</p>
        </div>

        {/* Right: Links + Socials */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex space-x-4 text-sm">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/players" className="hover:text-white transition">Players</Link>
            <Link to="/matches" className="hover:text-white transition">Matches</Link>
            <Link to="/stats" className="hover:text-white transition">Stats</Link>
          </div>

          <div className="flex space-x-3 text-xl text-gray-400">
            <a href="#"><FiTwitter className="hover:text-primary-400 transition" /></a>
            <a href="#"><FiInstagram className="hover:text-pink-400 transition" /></a>
            <a href="#"><FiFacebook className="hover:text-blue-500 transition" /></a>
            <a href="#"><FiYoutube className="hover:text-red-500 transition" /></a>
            <a href="#"><FiGithub className="hover:text-white transition" /></a>
          </div>
        </div>
      </div>

      {/* Bottom: Dev Credit */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        <p>&copy; {currentYear} Cricket Team. All rights reserved.</p>
        <p className="mt-1">
          Dev by{" "}
          <a
            href="https://www.facebook.com/rayhan4030"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:underline"
          >
            Rayhan
          </a>
        </p>
        <p className="mt-1">
          <a
            href="https://www.facebook.com/rayhan4030"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:underline"
          >
            Facebook
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
