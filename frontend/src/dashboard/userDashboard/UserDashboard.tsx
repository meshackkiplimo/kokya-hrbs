import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";

import { 
    FaBars, 
    FaBell, 
    FaSearch, 
    FaUserCircle,
    FaChevronDown,
    FaMoon,
    FaSun,
    FaGlobe
} from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import UserDrawer from "./aside/userDrawer";

const UserDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useSelector((state: RootState) => state.user);
    const location = useLocation();

    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Get page title based on current route
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        switch (path) {
            case 'users': return 'User Management';
            case 'hotels': return 'Hotel Management';
            case 'rooms': return 'Room Management';
            case 'bookings': return 'Booking Management';
            case 'payments': return 'Payment Management';
            case 'analytics': return 'Analytics & Reports';
            case 'settings': return 'Settings';
            default: return 'Dashboard Overview';
        }
    };

    // Close mobile drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const sidebar = document.getElementById('admin-sidebar');
            const menuButton = document.getElementById('mobile-menu-button');
            
            // Don't close if clicking inside sidebar or on menu button
            if (drawerOpen && sidebar && menuButton &&
                !sidebar.contains(target) && !menuButton.contains(target)) {
                setDrawerOpen(false);
            }
        };
        
        if (drawerOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [drawerOpen]);

    // Close drawer when route changes (mobile)
    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    // Mock notifications
    const notifications = [
        { id: 1, title: "New booking received", time: "2 min ago", type: "success" },
        { id: 2, title: "Payment processed", time: "15 min ago", type: "info" },
        { id: 3, title: "System maintenance scheduled", time: "1 hour ago", type: "warning" }
    ];

    return (
        <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
            {/* Sidebar */}
            <aside
                id="admin-sidebar"
                className={`
                    fixed top-0 left-0 z-50 w-80 h-screen transition-transform duration-300 ease-in-out
                    ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto lg:w-72
                    bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
                    border-r border-slate-700/50 shadow-2xl lg:shadow-none
                `}
            >
                {/* Sidebar Content */}
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <FaGlobe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">TripNest</h1>
                                <p className="text-xs text-slate-400">Admin Panel</p>
                            </div>
                        </div>
                        
                        {/* Close button for mobile */}
                        <button
                            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDrawerToggle();
                            }}
                            aria-label="Close navigation menu"
                        >
                            <IoCloseSharp size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto">
                        <UserDrawer />
                    </div>

                    {/* User Info at Bottom */}
                    <div className="p-6 border-t border-slate-700/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.first_name?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.first_name || 'Admin'} {user?.last_name || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {user?.email || 'admin@tripnest.com'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-0">
                {/* Top Navigation Bar */}
                <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Left Side */}
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <button
                                id="mobile-menu-button"
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDrawerToggle();
                                }}
                                aria-label="Toggle navigation menu"
                            >
                                {drawerOpen ? (
                                    <IoCloseSharp className="w-5 h-5 text-slate-600" />
                                ) : (
                                    <FaBars className="w-5 h-5 text-slate-600" />
                                )}
                            </button>

                            {/* Page Title */}
                            <div className="hidden sm:block">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    {getPageTitle()}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Manage your hotel business efficiently
                                </p>
                            </div>
                            
                            {/* Mobile Page Title */}
                            <div className="sm:hidden">
                                <h2 className="text-lg font-semibold text-slate-800">
                                    {getPageTitle().split(' ')[0]}
                                </h2>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2">
                                <FaSearch className="w-4 h-4 text-slate-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none w-48"
                                />
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                {darkMode ? (
                                    <FaSun className="w-5 h-5 text-amber-500" />
                                ) : (
                                    <FaMoon className="w-5 h-5 text-slate-600" />
                                )}
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
                                >
                                    <FaBell className="w-5 h-5 text-slate-600" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">3</span>
                                    </span>
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
                                        <div className="p-4 border-b border-slate-200">
                                            <h3 className="font-semibold text-slate-800">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${
                                                            notification.type === 'success' ? 'bg-green-500' :
                                                            notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                        }`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-800">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 border-t border-slate-200">
                                            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.first_name?.charAt(0)?.toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                    <FaChevronDown className="w-3 h-3 text-slate-600" />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
                                        <div className="p-4 border-b border-slate-200">
                                            <p className="font-medium text-slate-800">
                                                {user?.first_name || 'Admin'} {user?.last_name || 'User'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {user?.email || 'admin@tripnest.com'}
                                            </p>
                                        </div>
                                        <div className="py-2">
                                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                Profile Settings
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                Account Settings
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                Help & Support
                                            </a>
                                            <div className="border-t border-slate-200 mt-2 pt-2">
                                                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    Sign Out
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDrawerToggle();
                    }}
                    aria-label="Close navigation menu"
                ></div>
            )}
        </div>
    );
};

export default UserDashboard;