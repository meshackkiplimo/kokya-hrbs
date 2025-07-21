import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../app/store';
import { logout } from '../Features/login/userSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!(token && user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeStyle = "bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md";
  const inactiveStyle = "text-white hover:bg-amber-700 hover:text-amber-100 px-4 py-2 rounded-lg transition-all duration-300";

  return (
    <nav className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="w-full h-20 flex items-center relative">
        {/* Logo Section - Absolute Far Left Edge */}
        <div className="absolute left-0 flex items-center pl-4 sm:pl-6 lg:pl-8">
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

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
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
            to="/hotels"
            className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
          >
            Hotels
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
          {/* Role-based Dashboard Links */}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
            >
              Admin Dashboard
            </NavLink>
          )}
          {isAuthenticated && user?.role === 'user' && (
            <NavLink
              to="/user-dashboard"
              className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} font-medium`}
            >
              User Dashboard
            </NavLink>
          )}
        </div>

        {/* Auth Section - Absolute Far Right Edge */}
        <div className="absolute right-0 hidden md:block pr-4 sm:pr-6 lg:pr-8">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.first_name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span>{user?.first_name}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              <Link to="/register" className="flex items-center justify-center">
                Get Started
              </Link>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="absolute right-0 md:hidden pr-4 sm:pr-6 lg:pr-8">
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
          
          {/* Role-based Dashboard Links for Mobile */}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Dashboard
            </NavLink>
          )}
          {isAuthenticated && user?.role === 'user' && (
            <NavLink
              to="/user-dashboard"
              className={({ isActive }) => `${isActive ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-amber-700'} block px-4 py-3 rounded-lg font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              User Dashboard
            </NavLink>
          )}
          
          <div className="pt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2 border-b border-amber-700">
                  <p className="text-sm font-medium text-amber-100">{user?.first_name} {user?.last_name}</p>
                  <p className="text-sm text-amber-200">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-amber-100 hover:bg-amber-700 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  to="/my-bookings"
                  className="block px-4 py-2 text-amber-100 hover:bg-amber-700 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="block w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
