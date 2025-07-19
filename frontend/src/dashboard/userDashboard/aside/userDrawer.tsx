import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../Features/login/userSlice";
import { persistedStore } from "../../../app/store";

import { useState } from "react";
import { userDrawerData } from "./userDrawerData";

const UserDrawer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleLogout = () => {
        // Dispatch logout action to clear Redux state
        dispatch(logout());
        
        // Clear persisted store
        persistedStore.purge();
        
        // Navigate to login page
        navigate('/');
    };

    const handleItemClick = (item: any) => {
        if (item.id === 'logout') {
            handleLogout();
        }
    };

    const isActivePath = (path: string) => {
        return location.pathname.includes(path);
    };

    return (
        <nav className="px-4 py-6">
            {/* Quick Stats */}
            <div className="mb-8">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Quick Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-3 border border-blue-500/20">
                        <div className="text-xs text-blue-400 font-medium">Total Hotels</div>
                        <div className="text-lg font-bold text-white">24</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-3 border border-green-500/20">
                        <div className="text-xs text-green-400 font-medium">Active Bookings</div>
                        <div className="text-lg font-bold text-white">156</div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Management
                </h3>
                
                {userDrawerData.map((item) => {
                    const isActive = isActivePath(item.link);
                    const isLogout = item.id === 'logout';
                    
                    if (isLogout) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`
                                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                                    transition-all duration-300 group relative overflow-hidden
                                    ${hoveredItem === item.id 
                                        ? 'bg-red-500/20 border-red-500/30' 
                                        : 'hover:bg-red-500/10 border-transparent'
                                    }
                                    border text-left
                                `}
                            >
                                {/* Background Gradient Effect */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 
                                    transform transition-transform duration-300
                                    ${hoveredItem === item.id ? 'translate-x-0' : 'translate-x-full'}
                                `}></div>
                                
                                {/* Icon Container */}
                                <div className={`
                                    relative z-10 w-8 h-8 rounded-lg flex items-center justify-center
                                    transition-all duration-300
                                    ${hoveredItem === item.id 
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                                        : 'bg-red-500/20 text-red-400'
                                    }
                                `}>
                                    <item.icon size={16} />
                                </div>
                                
                                {/* Text */}
                                <div className="relative z-10 flex-1">
                                    <span className={`
                                        font-medium transition-colors duration-300
                                        ${hoveredItem === item.id ? 'text-white' : 'text-red-300'}
                                    `}>
                                        {item.name}
                                    </span>
                                </div>
                                
                                {/* Active Indicator */}
                                {hoveredItem === item.id && (
                                    <div className="relative z-10 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            to={item.link}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`
                                flex items-center space-x-3 px-4 py-3 rounded-xl
                                transition-all duration-300 group relative overflow-hidden
                                ${isActive 
                                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-white' 
                                    : hoveredItem === item.id
                                        ? 'bg-slate-700/50 border-slate-600/50'
                                        : 'hover:bg-slate-700/30 border-transparent'
                                }
                                border
                            `}
                        >
                            {/* Background Gradient Effect */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 
                                transform transition-transform duration-300
                                ${isActive || hoveredItem === item.id ? 'translate-x-0' : 'translate-x-full'}
                            `}></div>
                            
                            {/* Icon Container */}
                            <div className={`
                                relative z-10 w-8 h-8 rounded-lg flex items-center justify-center
                                transition-all duration-300
                                ${isActive 
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                                    : hoveredItem === item.id
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-slate-700/50 text-slate-400'
                                }
                            `}>
                                <item.icon size={16} />
                            </div>
                            
                            {/* Text */}
                            <div className="relative z-10 flex-1">
                                <span className={`
                                    font-medium transition-colors duration-300
                                    ${isActive 
                                        ? 'text-white' 
                                        : hoveredItem === item.id 
                                            ? 'text-amber-300' 
                                            : 'text-slate-300'
                                    }
                                `}>
                                    {item.name}
                                </span>
                                {item.id === 'analytics' && (
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        Reports & Insights
                                    </div>
                                )}
                            </div>
                            
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="relative z-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                            )}
                            
                            {/* New Badge for certain items */}
                            {(item.id === 'analytics' || item.id === 'settings') && !isActive && (
                                <div className="relative z-10">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                        New
                                    </span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">⭐</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-white">System Status</div>
                            <div className="text-xs text-slate-400">All systems operational</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full w-[85%]"></div>
                        </div>
                        <span className="text-xs text-green-400 font-medium">85%</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserDrawer;