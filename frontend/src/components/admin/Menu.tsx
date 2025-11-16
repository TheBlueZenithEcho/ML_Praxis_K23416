// Tên file: src/components/Menu.tsx
// (ĐÃ "DESIGN" LẠI: Sửa className của nút Logout cho giống các menu item)

import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { menuItems } from '@/data/icon';
import React from 'react';
import { Typography } from '@mui/material';
import { LogOut } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';


const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    // Logic logout của bạn giữ nguyên
    await signOut();
    // Chúng ta vẫn nên thêm navigate để đảm bảo chuyển trang sau khi signOut
    navigate('/signin'); 
  };

  return (
    // Logic layout cũ của bạn (w-[50px], mt-[56px]...) được giữ nguyên
    <div className='w-[50px] min-[900px]:w-[200px] 
                    py-[5px] 
                    px-[5px] min-[900px]:px-[20px] 
                    border-r-2 border-r-dark-bg transition-all duration-300 mt-[56px]'>
      
      <div className='flex flex-col gap-y-2'>
        
        {/* === LOGIC RENDER MENU (GIỮ NGUYÊN) === */}
        {menuItems.map((item) => {
          
          if (item.type === 'heading') {
            return (
              <Typography
                key={item.id}
                className="
                  text-amber-500 text-xl font-bold uppercase 
                  mt-4 mb-1 px-2.5 
                  hidden min-[900px]:block
                "
              >
                {item.title}
              </Typography>
            );
          }

          if (!item.url) {
            return null;
          }

          const isActive = location.pathname === item.url;

          return (
            <Link
              to={item.url} 
              className={`
                flex items-center gap-x-3 
                p-2 min-[900px]:p-2.5
                rounded-md 
                justify-center min-[900px]:justify-start
                transition-all duration-200
                
                ${isActive 
                  ? 'bg-white/20 shadow-lg' 
                  : 'hover:bg-white/10'
                }
              `}
              key={item.id}
            >
              <i className={`
                ${item.icon} text-xl
                ${isActive ? 'text-[#386641]' : 'text-gray-300 hover:text-white'}
              `}></i>
              
              <span className={`
                hidden min-[900px]:inline text-base 
                ${isActive ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}
              `}>
                {item.title}
              </span>
            </Link>
          );
        })}
        {/* === KẾT THÚC LOGIC CŨ === */}
      </div>

      {/* === KHỐI LOGOUT (ĐÃ "DESIGN" LẠI CLASSNAME) === */}
      <div className="pt-4 mt-4 border-t border-gray-700"> 
        <button
          onClick={handleLogout} 
          
          // SỬA: Dùng className giống hệt các Link ở trên
          // (ở trạng thái không active)
          className={`
            flex items-center gap-x-3 
            p-2 min-[900px]:p-2.5
            rounded-md 
            justify-center min-[900px]:justify-start
            transition-all duration-200
            w-full 
            text-gray-300 hover:bg-white/10 hover:text-white
          `}
        >
          {/* SỬA: Đổi <i> thành <LogOut> và đổi màu cho giống */}
          <LogOut size={20} className="text-lg text-gray-300 group-hover:text-white" /> 
          
          <span className={`
            hidden min-[900px]:inline text-base 
            text-gray-300 group-hover:text-white
          `}>
            Logout
          </span> 
        </button>
      </div>
      {/* ========================================================= */}

    </div>
  );
};

export default Menu;