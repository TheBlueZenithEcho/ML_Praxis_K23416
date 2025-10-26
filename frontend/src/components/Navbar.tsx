import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router'; // Đã sửa import

// --- API URLs ---
// (1) API Giả lập (đang dùng)
const MOCK_API_GET_USERS_URL = 'https://api.npoint.io/4a915d88732882680a44'; 
// (2) API Thật (comment lại - có thể là API lấy user hiện tại)
// const REAL_API_GET_CURRENT_USER_URL = 'https://api-backend-that.cuaban.com/auth/me'; 
// -----------------

// Kiểu dữ liệu (có role)
type UserNavItem = {
  id: number; img: string; role: 'user' | 'designer' | 'admin'; 
};

// Hàm tạo link profile (copy từ UsersTable)
const getProfileLinkNav = (user: UserNavItem): string => {
    switch (user.role) {
        case 'admin': return `/admin/${user.id}`;
        case 'designer': return `/designer/${user.id}`;
        default: return `/users/${user.id}`;
    }
};

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<UserNavItem | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect để gọi API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // (1) Dùng API giả lập (lấy list rồi lấy user đầu)
        const response = await fetch(MOCK_API_GET_USERS_URL); 
        if (!response.ok) throw new Error("Failed to fetch users");
        const users: UserNavItem[] = await response.json(); 
        if (users?.length > 0) setCurrentUser(users[0]); 
        else setCurrentUser(null); 

        // (2) Code thật (comment lại - gọi API lấy user hiện tại)
        /*
        const response = await fetch(REAL_API_GET_CURRENT_USER_URL, { 
            // Cần gửi token xác thực
            headers: { 'Authorization': `Bearer ${your_auth_token}` } 
        }); 
        if (!response.ok) throw new Error("Failed to fetch current user");
        const user: UserNavItem = await response.json(); 
        setCurrentUser(user);
        */

      } catch (error) {
        console.error("Error fetching user for navbar:", error);
        setCurrentUser(null); 
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []); 

  // Return JSX (giữ nguyên cấu trúc)
  return (
    <div className='header flex h-[56px] w-full justify-between items-center px-[32px] top-0 fixed z-1000'>
      <div className='text-white text-2xl font-bold font-serif'>PRAXIS</div>
      <div className='flex'>
        {loading ? (
          <div className='avatar-placeholder w-[30px] h-[30px] rounded-full cursor-pointer animate-pulse  '></div> // Placeholder
        ) : currentUser ? (
          <Link to={getProfileLinkNav(currentUser)}> 
            <img className='avatarboth w-[30px] h-[30px] rounded-full object-cover cursor-pointer' src={currentUser.img} alt="User profile" />
          </Link>
        ) : (
          <div className='avatar-placeholder'></div> // Avatar mặc định
        )}
      </div>
    </div>
  );
};

export default Navbar;