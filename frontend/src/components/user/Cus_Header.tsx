import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import DesignTab from "./DesignTab";
import { useAuth } from "../../context/AuthContext";

interface HeaderUserData {
    img: string;
    profileLink: string;
}

const Cus_Header: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [showDesignTab, setShowDesignTab] = useState(false);
    const [designCount, setDesignCount] = useState(0);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    // Loader riêng cho avatar để không ảnh hưởng session loading
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [currentUserData, setCurrentUserData] = useState<HeaderUserData | null>(null);

    // Dùng AuthContext
    const { profile, signOut } = useAuth();

    // ❗ customerId được lấy từ profile (id Supabase)
    const customerId = profile?.id ?? null;

    // Toggle
    const toggleDesignTab = () => setShowDesignTab((prev) => !prev);
    const toggleMenu = () => setOpen((prev) => !prev);
    const toggleLogoutMenu = () => setShowLogoutMenu((prev) => !prev);

    // ❌ Đóng menu avatar khi click ra ngoài
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".avatar-wrapper")) setShowLogoutMenu(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // ❌ Auto close menu khi resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Avatar tự cập nhật mỗi khi profile thay đổi
    useEffect(() => {
        if (!profile) {
            setCurrentUserData(null);
            setAvatarLoading(false);
            return;
        }

        setAvatarLoading(true);

        setCurrentUserData({
            img: profile.img || "",
            profileLink: `/customer/${profile.id}/profile`,
        });

        setAvatarLoading(false);
    }, [profile]);

    // ✅ Load số lượng design trong localStorage theo customerId
    useEffect(() => {
        if (!customerId) return;

        const key = `designTab_${customerId}`;

        const updateCount = () => {
            const saved = JSON.parse(localStorage.getItem(key) || "[]");
            setDesignCount(saved.length);
        };

        updateCount();

        window.addEventListener("designTabChange", updateCount);
        window.addEventListener("sendDesignsToChat", updateCount);

        return () => {
            window.removeEventListener("designTabChange", updateCount);
            window.removeEventListener("sendDesignsToChat", updateCount);
        };
    }, [customerId]);

    // Safe link cho Home/About khi chưa có customerId
    const safeCustomerLink = customerId ? `/customer/${customerId}` : "/";

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
                                    <Link to={safeCustomerLink} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition text-center">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to={safeCustomerLink} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition text-center">
                                        About
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <button className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition text-center">
                                        <span className="flex items-center justify-center">
                                            Type Rooms <i className="bi bi-caret-down-fill text-xs ml-1"></i>
                                        </span>
                                    </button>
                                    <ul className="top-[110%] absolute left-0 hidden group-hover:block bg-white text-[#143E08] rounded-lg w-40 z-20 opacity-0 group-hover:opacity-100 shadow-md transition pt-2">
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/bedroom` : "/bedroom"}
                                                className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold "
                                            >
                                                Bedroom
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/livingroom` : "/livingroom"}
                                                className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold "
                                            >
                                                Living Room
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/kitchen` : "/kitchen"}
                                                className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold "
                                            >
                                                Kitchen
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to={customerId ? `/customer/${customerId}/contact` : "/contact"}
                                        className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition text-center">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Icons + Avatar */}
                        <div className="flex items-center gap-7 mr-5">
                            {/* DesignTab (Giữ nguyên) */}
                            <div className="relative">
                                <i className="bi bi-house-add-fill text-2xl hover:text-green-700 transition cursor-pointer" onClick={toggleDesignTab}></i>
                                {designCount > 0 && (
                                    <span className="absolute top-1/2 left-1/2 bg-yellow-200 text-[#1A4B0C] text-[10px] font-inter font-semibold w-4 h-4 rounded-full flex justify-center items-center">
                                        {designCount}
                                    </span>
                                )}
                            </div>

                            {/* Chat (Link đã an toàn) */}
                            <Link
                                to={customerId ? `/customer/${customerId}/consultation` : "/consultation"}
                                title="Tư vấn với Designer"
                            >
                                <i className="bi bi-wechat text-2xl hover:text-green-700 transition cursor-pointer"></i>
                            </Link>

                            {/* Avatar */}
                            <div className="relative avatar-wrapper">
                                {avatarLoading ? ( // Dùng state loading local
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

                                        {/* ✅ Đổi 'logout()' thành 'signOut()' */}
                                        <button onClick={() => { signOut(); setShowLogoutMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button (Giữ nguyên) */}
                            <button className="md:hidden" onClick={toggleMenu}>
                                <i className="bi bi-list text-4xl"></i>
                            </button>
                        </div>
                    </div>
                </nav>
                <ResponsiveMenu open={open} setOpen={setOpen} />
            </header>
            <DesignTab open={showDesignTab} onClose={toggleDesignTab} />
        </>
    );
};

export default Cus_Header;