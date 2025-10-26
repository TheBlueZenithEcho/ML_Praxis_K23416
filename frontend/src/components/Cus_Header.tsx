import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
// import SignUpButton from "./SignUpButton"; // Đã loại bỏ

// Định nghĩa props để nhận ID khách hàng
interface CusHeaderProps {
    customerId: string | undefined;
}

// 1. Định nghĩa kiểu dữ liệu cho dữ liệu người dùng từ API
interface User {
    id: string;
    img: string;
    role: string;
    // Thêm các trường khác nếu cần thiết (name, email, phone, createdDt)
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}

// Kiểu dữ liệu tối giản cần thiết cho Header
interface HeaderUserData {
    img: string;
    profileLink: string;
}

const Cus_Header: React.FC<CusHeaderProps> = ({ customerId }) => {
    const [open, setOpen] = React.useState(false);

    // 2. Cập nhật state để xử lý việc fetch API
    const [loading, setLoading] = useState(true); // Bắt đầu là loading
    const [currentUserData, setCurrentUserData] = useState<HeaderUserData | null>(null);

    const toggleMenu = () => {
        setOpen(prev => !prev);
    };

    // Logic cho Responsive Menu (giữ nguyên)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 3. Logic fetch dữ liệu người dùng từ API
    useEffect(() => {
        // Nếu không có ID hoặc ID không hợp lệ, dừng và hiển thị placeholder mặc định
        if (!customerId || customerId === 'N/A') {
            setCurrentUserData(null);
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            setLoading(true);
            try {
                // Gọi API để lấy danh sách tất cả người dùng
                const API_URL = 'https://api.npoint.io/4a915d88732882680a44';
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const users: User[] = await response.json();

                // Tìm người dùng có ID khớp với customerId
                const user = users.find(u => String(u.id) === customerId);

                if (user) {
                    // Xác định link profile (có thể dựa vào role nếu cần)
                    const profileLink = user.role === 'admin' ? '/admin/profile' : '/customer/profile';

                    setCurrentUserData({
                        img: user.img,
                        profileLink: profileLink
                    });
                } else {
                    setCurrentUserData(null); // Không tìm thấy người dùng
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setCurrentUserData(null); // Xử lý lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [customerId]); // Chạy lại khi customerId thay đổi


    return (
        <>
            <header className="fixed top-0 left-0 w-full z-30 bg-white shadow">
                <nav className="px-4 md:px-8">
                    <div className=" flex justify-between items-center py-2 ">

                        {/* 1. Logo section - Khôi phục Logo PRAXIS cố định */}
                        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
                            <p className=" font-serif text-secondary">PRAXIS</p>
                        </div>

                        {/* 2. Menu section (giữ nguyên) */}
                        <div className="hidden md:block ">
                            <ul className="flex items-center text-gray-950 gap-12 ">
                                <li className="text-center"><a href="/" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Home</a></li>
                                <li className="text-center"><a href="#" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Designer</a></li>
                                <li className="text-center relative group">
                                    <a
                                        href="#"
                                        className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300"
                                    >
                                        <span className="flex items-center justify-center">
                                            Type Rooms
                                            <i className="bi bi-caret-down-fill text-xs ml-1 ]"></i>
                                        </span>
                                    </a>
                                    <ul
                                        className="absolute left-0 top-full hidden group-hover:block bg-white text-[#143E08] rounded-lg w-40 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.15)]"
                                        style={{
                                            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)',
                                            marginTop: '2px'
                                        }}
                                    >
                                        <li><a href="#" className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold">Bedroom</a></li>
                                        <li><a href="/LivingRoom" className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold">Living Room</a></li>
                                        <li><a href="#" className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold">Kitchen</a></li>
                                    </ul>
                                </li>
                                <li className="text-center"><a href="#" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Contact</a></li>
                            </ul>
                        </div>

                        {/* 3. ✅ Icons & Avatar section - CHỈ hiển thị Icons và Avatar */}
                        <div className="flex items-center gap-7 mr-5" >
                            {/* 1. House-Add Link */}
                            <Link to="/house-add-page" title="Thêm căn nhà mới">
                                <i className="bi bi-house-add-fill text-2xl hover:text-green-700 transition"></i>
                            </Link>

                            {/* 2. Chat Link */}
                            <Link to="/chat-with-designers" title="Trò chuyện">
                                <i className="bi bi-wechat text-2xl hover:text-green-700 transition"></i>
                            </Link>

                            {/* 🌟 3. Avatar Section - Áp dụng cấu trúc logic mới 🌟 */}
                            <div className='flex items-center'>
                                {loading ? (
                                    // 1. Placeholder khi đang tải (loading)
                                    <div className='bg-gray-200 w-[30px] h-[30px] rounded-full cursor-pointer animate-pulse avatar-placeholder'></div>
                                ) : currentUserData ? (
                                    // 2. Hiển thị Avatar nếu có dữ liệu người dùng (currentUserData)
                                    <Link to={currentUserData.profileLink} title="Trang cá nhân">
                                        <img
                                            // Avatar nhỏ 30x30px ở góc phải
                                            className='w-[30px] h-[30px] rounded-full object-cover cursor-pointer shadow-md border-2 border-green-500 hover:opacity-90 transition avatarboth'
                                            src={currentUserData.img}
                                            alt="User profile"
                                            // Xử lý lỗi ảnh nếu URL không hợp lệ
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://placehold.co/30x30/7C7C7C/white?text=AVT';
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    // 3. Placeholder mặc định khi không tìm thấy dữ liệu người dùng
                                    <div className='bg-gray-300 w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs text-white avatar-placeholder' title="Avatar không khả dụng">
                                        ?
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button className="md:hidden" onClick={toggleMenu} >
                                <i className="bi bi-list text-4xl"></i>
                            </button>


                        </div>

                    </div>
                </nav>

                {/* Mobile Sidebar section */}
                <ResponsiveMenu
                    open={open}
                    setOpen={setOpen}
                />
            </header>


        </>
    )
}

export default Cus_Header
