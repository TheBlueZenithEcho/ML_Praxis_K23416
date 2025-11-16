import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import DesignTab from "./DesignTab";
import { useAuth } from "../../context/AuthContext"; // ✅ Đã dùng context mới

// ❌ Không cần interface này nữa
// interface CusHeaderProps {
//     customerId: string | undefined; 
// }

// ❌ Không cần interface User cũ này nữa
// interface User { ... }

interface HeaderUserData {
    img: string;
    profileLink: string;
}

// ✅ Không cần nhận prop `customerId`
const Cus_Header: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Giữ state loading local cho avatar
    const [currentUserData, setCurrentUserData] = useState<HeaderUserData | null>(null);
    const [showDesignTab, setShowDesignTab] = useState(false);
    const [designCount, setDesignCount] = useState(0);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    // ✅ Lấy `profile` (chứa role, img) và `signOut`
    const { profile, signOut } = useAuth();

    // ✅ Lấy customerId trực tiếp từ profile
    // ProtectedRoute đảm bảo 'profile' sẽ luôn tồn tại khi component này render
    const customerId = profile?.id;

    const handleToggleDesignTab = () => setShowDesignTab(!showDesignTab);
    const toggleMenu = () => setOpen((prev) => !prev);
    const toggleLogoutMenu = () => setShowLogoutMenu((prev) => !prev);

    // Đóng menu khi click ra ngoài (Giữ nguyên)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".avatar-wrapper")) setShowLogoutMenu(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Responsive menu (Giữ nguyên)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Cập nhật avatar khi 'profile' thay đổi
    useEffect(() => {
        if (!profile) { // Dù ProtectedRoute đã check, đây là một check an toàn
            setCurrentUserData(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setCurrentUserData({
            img: profile.img || "https://placehold.co/30x30/7C7C7C/white?text=AVT",
            profileLink: `/customer/${profile.id}/profile`, // Dùng profile.id
        });
        setLoading(false);
    }, [profile]); // Lắng nghe 'profile'

    // Load số lượng design (Giữ nguyên, giờ nó dùng customerId từ 'profile')
    useEffect(() => {
        if (!customerId) return; // Chờ customerId (từ profile) sẵn sàng

        const key = `designTab_${customerId}`;

        const updateCount = () => {
            const saved: any[] = JSON.parse(localStorage.getItem(key) || "[]");
            setDesignCount(saved.length);
        };

        updateCount();
        window.addEventListener("designTabChange", updateCount);
        window.addEventListener("sendDesignsToChat", updateCount);

        return () => {
            window.removeEventListener("designTabChange", updateCount);
            window.removeEventListener("sendDesignsToChat", updateCount);
        };
    }, [customerId]); // Lắng nghe 'customerId'

    // ✅ `safeCustomerLink` giờ sẽ hoạt động chuẩn xác dựa trên 'profile'
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
                                    <Link to={safeCustomerLink} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition">
                                        Home
                                    </Link>
                                </li>
                                {/* ... (Các link khác giờ đã an toàn vì dùng customerId từ profile) ... */}
                                <li className="relative group">
                                    <button className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition">
                                        <span className="flex items-center justify-center">
                                            Type Rooms <i className="bi bi-caret-down-fill text-xs ml-1"></i>
                                        </span>
                                    </button>
                                    <ul className="top-[100%] absolute left-0 hidden group-hover:block bg-white text-[#143E08] rounded-lg w-40 z-20 opacity-0 group-hover:opacity-100 shadow-md transition">
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/bedroom` : "/bedroom"}
                                                className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold nav-link"
                                            >
                                                Bedroom
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/livingroom` : "/livingroom"}
                                                className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold nav-link"
                                            >
                                                Living Room
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/kitchen` : "/kitchen"}
                                                className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold nav-link"
                                            >
                                                Kitchen
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to={customerId ? `/customer/${customerId}/contact` : "/contact"}
                                        className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Icons + Avatar */}
                        <div className="flex items-center gap-7 mr-5">
                            {/* DesignTab (Giữ nguyên) */}
                            <div className="relative">
                                {/* ... */}
                            </div>

                            {/* Chat (Link đã an toàn) */}
                            <Link
                                to={`/customer/${customerId}/consultation`}
                                title="Tư vấn với Designer"
                            >
                                <i className="bi bi-wechat text-2xl hover:text-green-700 transition cursor-pointer"></i>
                            </Link>

                            {/* Avatar */}
                            <div className="relative avatar-wrapper">
                                {loading ? ( // Dùng state loading local
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
            <DesignTab open={showDesignTab} onClose={handleToggleDesignTab} />
        </>
    );
};

export default Cus_Header;