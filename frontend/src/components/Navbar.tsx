import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeStyle = "bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md";
  const inactiveStyle = "text-white hover:bg-amber-700 hover:text-amber-100 px-4 py-2 rounded-lg transition-all duration-300";

  return (
    <nav className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white group-hover:text-amber-100 transition-colors duration-300">
                TripNest
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
            >
              Rooms
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
            >
              Bookings
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
            >
              Contact
            </NavLink>
          </div>

          {/* Sign In Button - Desktop */}
          <div className="hidden md:block">
            <button  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
             <Link to="/signup" className="flex items-center justify-center">
              Get Started
             </Link>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-amber-200 focus:outline-none focus:text-amber-200 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-6 space-y-2 bg-amber-900/90 rounded-lg mt-2 backdrop-blur-sm">
            <NavLink
              to="/"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              end
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rooms
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Bookings
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
            <div className="pt-2">
              <button
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
