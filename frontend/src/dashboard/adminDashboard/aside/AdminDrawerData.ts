import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa6";
import { MdOutlineBookmark } from "react-icons/md";
import { RiReservedFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [

    {
        id: "hotels",
        name: "Hotels",
        icon: FaTasks,
        link: "hotels"
    },
    {
        id: "users",
        name: "Users",
        icon: FiUsers,
        link: "users"
    },
    {
        id: "profile",
        name: "Profile",
        icon: FaUserCheck,
        link: "profile"
    },
    {
        id: "bookings",
        name: "Bookings",
        icon: MdOutlineBookmark,
        link: "bookings"
    },
      {
        id: "rooms",
        name: "Rooms",
        icon: RiReservedFill,
        link: "rooms"
    },
    {
        id: "payments",
        name: "Payments",
        icon: MdPayments,
        link: "payments"
    },


    {
        id: "analytics",
        name: "Analytics",
        icon: TbBrandGoogleAnalytics,
        link: "analytics"
    },
    {
        id: "settings",
        name: "Settings",
        icon: IoSettings,
        link: "settings"
    },
    {
        id: "logout",
        name: "Logout",
        icon: BiLogOut,
        link: "logout"
    },

]
