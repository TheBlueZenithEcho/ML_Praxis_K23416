import { menuItems } from '@/data/icon';
import React from 'react'
import { Link } from 'react-router';


const Menu = () => {
  return (
    // - Mặc định (0px -> 900px): w-[80px] và px-[10px]
    <div className='w-[50px] min-[900px]:w-[200px] 
                    py-[5px] 
                    px-[5px] min-[900px]:px-[20px] 
                    border-r-2 border-r-dark-bg transition-all duration-300 mt-[56px]'>
      
      <div className='flex flex-col gap-y-2 text-white '>
        {menuItems.map((item) => (
          <Link
            to={item.url}
            // - Từ 901px trở lên: Căn trái
            className="flex items-center gap-x-3 p-2 rounded-md hover:bg-hightlight 
                       justify-center min-[900px]:justify-start"
            key={item.id}
          >
            <i className={item.icon}></i>
            
            {/* Ẩn chữ */}
            {/* Từ 901px trở lên: Hiện chữ */}
            <span className="hidden min-[900px]:inline">{item.title}</span>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Menu;