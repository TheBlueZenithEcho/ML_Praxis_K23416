import { Outlet } from 'react-router';
import Navbar from '../components/admin/Navbar';
import Menu from '../components/admin/Menu';

// Đây là code layout admin cũ của bạn, được tách ra file riêng
const LayoutAdmin = () => {
  return (
    <div className="main main min-h-screen flex flex-col ">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="than flex h-screen pt-[65px] px-1">
        <div className="menuContainer mt-[-56px] ">
          <Menu />
        </div>
        <div className="contentContainder flex-1 flex flex-col p-[15px] rounded-lg bg-main-bg min-w-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
