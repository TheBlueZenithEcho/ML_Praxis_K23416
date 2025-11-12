// Tên file: src/components/Menu.tsx
// (SỬA LỖI: Thêm 1 dòng kiểm tra !item.url để fix lỗi TypeScript)

import { Link, useLocation } from 'react-router-dom';
import { menuItems } from '@/data/icon';
import React from 'react';
import { Typography } from '@mui/material';

const Menu = () => {
  const location = useLocation();

  return (
    <div className='w-[50px] min-[900px]:w-[200px] 
                    py-[5px] 
                    px-[5px] min-[900px]:px-[20px] 
                    border-r-2 border-r-dark-bg transition-all duration-300 mt-[56px]'>
      
      <div className='flex flex-col gap-y-2'>
        
        {menuItems.map((item) => {
          
          // === A. Nếu item là TIÊU ĐỀ NHÓM ===
          if (item.type === 'heading') {
            return (
              <Typography
                key={item.id}
                className="
                  text-amber-500 text-xs font-bold uppercase 
                  mt-4 mb-1 px-2.5 
                  hidden min-[900px]:block
                "
              >
                {item.title}
              </Typography>
            );
          }

          // === SỬA LỖI TẠI ĐÂY ===
          // Thêm dòng này: Nếu item không có url (ví dụ: bị thiếu),
          // chúng ta bỏ qua và không render gì cả.
          // Điều này đảm bảo code bên dưới 'item.url' 100% là string.
          if (!item.url) {
            return null;
          }
          // =======================

          // === B. Nếu item là LINK ===
          // Giờ 'item.url' chắc chắn là string
          const isActive = location.pathname === item.url;

          return (
            <Link
              to={item.url} // Sẽ hết bị đỏ
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
              {/* Icon */}
              <i className={`
                ${item.icon} text-lg 
                ${isActive ? 'text-[#386641]' : 'text-gray-300 hover:text-white'}
              `}></i>
              
              {/* Tiêu đề link */}
              <span className={`
                hidden min-[900px]:inline text-base 
                ${isActive ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}
              `}>
                {item.title}
              </span>
            </Link>
          );
        })}
        {/* Kết thúc logic .map */}

      </div>
    </div>
  );
}

export default Menu;