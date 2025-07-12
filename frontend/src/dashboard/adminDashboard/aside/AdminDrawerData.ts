import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa6";
import { MdOutlineBookmark } from "react-icons/md";
import { RiReservedFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [

    {
        id: "cars",
        name: "Cars",
        icon: FaTasks,
        link: "cars"
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
        id: "reservations",
        name: "Reservations",
        icon: RiReservedFill,
        link: "reservations"
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

]
