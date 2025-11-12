import React, { useState } from 'react';
// SỬA 1: Import thêm useParams
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  User,
  BarChart3,
  Users,
  FolderOpen,
  Palette,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const DesignerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // SỬA 2: Lấy 'id' từ URL
  const { id } = useParams();

  // SỬA 3: Dùng 'id' để tạo đường dẫn động (dynamic paths)
  const navItems = [
    {
      label: 'Profile',
      icon: <User size={20} />,
      path: `/designer/${id}/profile`
    },
    {
      label: 'Dashboard',
      icon: <BarChart3 size={20} />,
      path: `/designer/${id}/dashboard`
    },
    {
      label: 'Leads',
      icon: <Users size={20} />,
      path: `/designer/${id}/leads`
    },
    {
      label: 'Projects',
      icon: <FolderOpen size={20} />,
      path: `/designer/${id}/projects`
    },
    {
      label: 'Create Design',
      icon: <Palette size={20} />,
      path: `/designer/${id}/designs/create`
    }
  ];

  const isActive = (path: string) => {
    // Logic 'isActive' này giờ sẽ hoạt động chính xác
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    // SỬA (Thêm): Dùng /SignIn để khớp với App_both.tsx
    navigate('/SignIn'); 
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#082503] text-white w-64 z-50
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          {/* SỬA 4: Link logo cũng cần trỏ về trang dashboard động */}
          <Link to={`/designer/${id}/dashboard`} className="text-2xl font-bold font-serif">
            Praxis
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? 'bg-[#2B7516] text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
          <div className="text-xs text-gray-400 text-center mt-4">
            © 2025 Praxis Interior
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold font-serif">Praxis</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Page Content */}
        <main className="h-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesignerLayout;