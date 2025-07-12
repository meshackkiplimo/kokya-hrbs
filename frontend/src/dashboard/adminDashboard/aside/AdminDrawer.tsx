import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../../../Features/login/userSlice"
import { persistedStore } from "../../../app/store"
import { adminDrawerData } from "./AdminDrawerData"


const AdminDrawer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    return (
        <div>
            <h2 className="text-xl font-bold text-white p-4 border-b-2 border-amber-400 ">
                Dashboard Menu
            </h2>
            <ul>
                {
                    adminDrawerData.map((item) => (
                        <li key={item.id}>
                            {item.id === 'logout' ? (
                                <button
                                    onClick={() => handleItemClick(item)}
                                    className="flex space-x-3 border-b-2 border-transparent hover:border-red-400 text-white hover:bg-red-700 p-4 w-full text-left"
                                >
                                    <item.icon size={30} />
                                    <span className="text-xl text-gray-100 mb-2">{item.name}</span>
                                </button>
                            ) : (
                                <Link
                                    to={item.link}
                                    className={`flex space-x-3 border-b-2 border-transparent hover:border-blue-400 text-white p-4 ${
                                        item.id === 'settings' ? 'hover:bg-purple-700' : 'hover:bg-green-700'
                                    }`}
                                >
                                    <item.icon size={30} />
                                    <span className="text-xl text-gray-100 mb-2">{item.name}</span>
                                </Link>
                            )}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default AdminDrawer