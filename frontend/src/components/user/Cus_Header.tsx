import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ResponsiveMenu from "./ResponsiveMenu";
import DesignTab from "./DesignTab";
import { useAuth } from "@/context/AuthContext";
// import { useAuth } from "../src/context/AuthContext";

interface CusHeaderProps {
    customerId: number | undefined; // ⚡ số hoặc undefined
}

interface User {
    id: number;
    img: string;
    role: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}

interface HeaderUserData {
    img: string;
    profileLink: string;
}

const Cus_Header: React.FC<CusHeaderProps> = ({ customerId }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUserData, setCurrentUserData] = useState<HeaderUserData | null>(null);
    const [showDesignTab, setShowDesignTab] = useState(false);
    const [designCount, setDesignCount] = useState(0);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    const { logout } = useAuth();

    const handleToggleDesignTab = () => setShowDesignTab(!showDesignTab);
    const toggleMenu = () => setOpen((prev) => !prev);
    const toggleLogoutMenu = () => setShowLogoutMenu((prev) => !prev);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".avatar-wrapper")) setShowLogoutMenu(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Responsive menu
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch user data
    useEffect(() => {
        if (customerId === undefined) {
            setCurrentUserData(null);
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const API_URL = "https://api.npoint.io/4a915d88732882680a44";
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const users: User[] = await response.json();
                const user = users.find((u) => u.id === customerId);
                if (user) {
                    const profileLink = user.role === "admin" ? "/admin/profile" : "/customer/profile";
                    setCurrentUserData({ img: user.img, profileLink });
                } else {
                    setCurrentUserData(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setCurrentUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [customerId]);

    // render safe URL
    const safeCustomerLink = customerId !== undefined ? `/customer/${customerId}` : "/";

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-30 bg-white shadow">
                <nav className="px-4 md:px-8">
                    <div className="flex justify-between items-center py-2">
                        {/* Logo */}
                        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
                            <p className="font-serif text-secondary">PRAXIS</p>
                        </div>

                        {/* Menu */}
                        <div className="hidden md:block">
                            <ul className="flex items-center text-gray-950 gap-12">
                                <li>
                                    <Link to={safeCustomerLink} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to={safeCustomerLink} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition">
                                        Designer
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <button className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition">
                                        <span className="flex items-center justify-center">
                                            Type Rooms <i className="bi bi-caret-down-fill text-xs ml-1"></i>
                                        </span>
                                    </button>
                                    <ul className="top-[100%] absolute left-0 hidden group-hover:block bg-white text-[#143E08] rounded-lg w-40 z-20 opacity-0 group-hover:opacity-100 shadow-md transition">
                                        <li className="">
                                            <Link to={`/customer/${customerId}/bedroom`} className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold nav-link">Bedroom</Link>
                                        </li>
                                        <li className="">
                                            <Link to={`/customer/${customerId}/livingroom`} className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold nav-link">Living Room</Link>
                                        </li>
                                        <li className="">
                                            <Link to={`/customer/${customerId}/kitchen`} className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold nav-link">Kitchen</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/contact" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition">Contact</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Icons + Avatar */}
                        <div className="flex items-center gap-7 mr-5">
                            {/* DesignTab */}
                            <div className="relative">
                                <i className="bi bi-house-add-fill text-2xl hover:text-green-700 transition cursor-pointer" onClick={handleToggleDesignTab}></i>
                                <span className="absolute top-2/3 right-1/2 bg-[#1A4B0C] text-[#FDFBCE] text-sm w-4 h-4 rounded-full flex justify-center items-center">{designCount}</span>
                            </div>

                            {/* Chat */}
                            <Link to="/chat-with-designers" title="">
                                <i className="bi bi-wechat text-2xl hover:text-green-700 transition"></i>
                            </Link>

                            {/* Avatar */}
                            <div className="relative avatar-wrapper">
                                {loading ? (
                                    <div className="bg-gray-200 w-[30px] h-[30px] rounded-full animate-pulse"></div>
                                ) : currentUserData ? (
                                    <img
                                        className="w-[30px] h-[30px] rounded-full object-cover border-2 border-green-500 shadow-md hover:opacity-90 cursor-pointer transition"
                                        src={currentUserData.img}
                                        alt="User profile"
                                        onClick={toggleLogoutMenu}
                                        onError={(e) => {
                                            e.currentTarget.src = "https://placehold.co/30x30/7C7C7C/white?text=AVT";
                                        }}
                                    />
                                ) : (
                                    <div className="bg-gray-300 w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs text-white">?</div>
                                )}

                                {showLogoutMenu && (
                                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg text-gray-700 z-50 py-2">
                                        <Link to={currentUserData?.profileLink || "#"} className="block px-4 py-2 text-sm hover:bg-gray-100">View Profile</Link>
                                        <button onClick={() => { logout(); setShowLogoutMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button className="md:hidden" onClick={toggleMenu}>
                                <i className="bi bi-list text-4xl"></i>
                            </button>
                        </div>
                    </div>
                </nav>
                <ResponsiveMenu open={open} setOpen={setOpen} />
            </header>
            <DesignTab open={showDesignTab} onClose={handleToggleDesignTab} />
        </>
    );
};

export default Cus_Header;
