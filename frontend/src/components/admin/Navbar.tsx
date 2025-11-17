// Tên file: src/admin/Navbar.tsx
// (Sửa đổi file 'uploaded:Navbar.tsx' của bạn)

import React, { useState, useEffect } from 'react'; // Sửa 1: Thêm useState, useEffect
import { Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { Bell } from 'lucide-react'; // Sửa 2: Thêm icon Bell
import { Badge, IconButton } from '@mui/material'; // Sửa 3: Thêm Badge để hiện số thông báo

// --- API Giả lập đếm số lượng 'pending' ---
// API thật của bạn nên là: /api/interiors/pending/count
const MOCK_API_GET_URL = 'https://api.npoint.io/3619c3ea1583a5bd1216';
const isPending = (item: any) => item.id % 2 !== 0;
// -------------------------------------------


// Kiểu dữ liệu (có role)
type UserNavItem = {
  id: number;
  img?: string;
  role: 'user' | 'designer' | 'admin';
};

// Hàm tạo link profile (Giữ nguyên)
const getProfileLinkNav = (user: UserNavItem): string => {
  switch (user.role) {
    case 'admin': return `/admin/${user.id}`;
    case 'designer': return `/designer/${user.id}`;
    default: return `/users/${user.id}`;
  }
};

const Navbar = () => {
  const { user } = useAuth();

  // Sửa 4: Thêm state cho thông báo
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingBell, setLoadingBell] = useState(true);

  // Sửa 5: Thêm useEffect để lấy số lượng thông báo
  useEffect(() => {
    // Chỉ admin mới cần xem thông báo duyệt
    if (user?.role !== 'admin') {
      setLoadingBell(false);
      return;
    }

    const fetchPendingCount = async () => {
      setLoadingBell(true);
      try {
        // --- GIẢ LẬP GỌI API ĐẾM ---
        const response = await fetch(MOCK_API_GET_URL);
        const data = await response.json();
        const count = data.filter(isPending).length; // Đếm số lượng 'pending' (giả lập)
        // -------------------------

        // API thật:
        // const response = await fetch(REAL_API_PENDING_COUNT_URL);
        // const { count } = await response.json();

        setPendingCount(count);

      } catch (error) {
        console.error("Failed to fetch pending count:", error);
      } finally {
        setLoadingBell(false);
      }
    };

    fetchPendingCount();
  }, [user]); // Chạy lại khi user thay đổi


  return (
    <div className='header flex h-[56px] w-full justify-between items-center px-[32px] top-0 fixed z-1000'>
      <div className='text-black text-2xl font-bold font-serif'>PRAXIS</div>

      {/* Sửa 6: Thêm chuông và Avatar */}
      <div className='flex items-center gap-4'> {/* Bọc 2 icon lại */}

        {/* === CHUÔNG THÔNG BÁO (Chỉ admin thấy) === */}
        {user?.role === 'admin' && !loadingBell && (
          <Link to="/admin_approval" title="Duyệt thiết kế">
            <IconButton>
              <Badge badgeContent={pendingCount} color="error">
                <Bell className="text-black" />
              </Badge>
            </IconButton>
          </Link>
        )}
        {/* ======================================== */}

        {/* Avatar (Giữ nguyên logic của bạn) */}
        <div className='flex'>
          {user ? (
            <Link to={getProfileLinkNav(user)}>
              <img
                className='avatarboth w-[40px] h-[40px] rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500'
                src={user.img || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"} // Ảnh mặc định
                alt="avatar"
              />
            </Link>
          ) : (
            <div className='avatar-placeholder w-[40px] h-[40px] rounded-full bg-gray-300 animate-pulse'></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;