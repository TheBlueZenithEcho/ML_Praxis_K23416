import React, { useState } from 'react';
// Sửa đổi import: Bỏ useNavigate, useParams. Thêm useAuth.
import { Outlet, Link, useLocation } from 'react-router-dom';
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
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const DesignerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Lấy profile (chứa id) và hàm signOut từ Context
  const { profile, signOut } = useAuth();

  // Lấy id trực tiếp từ profile
  const designerId = profile?.id;

  // navItems giờ sẽ tự động dùng ID của người dùng đang đăng nhập
  const navItems = [
    {
      label: 'Profile',
      icon: <User size={20} />,
      path: `/designer/${designerId}/profile`
    },
    {
      label: 'Dashboard',
      icon: <BarChart3 size={20} />,
      path: `/designer/${designerId}/dashboard`
    },
    {
      label: 'Leads',
      icon: <Users size={20} />,
      path: `/designer/${designerId}/leads`
    },
    {
      label: 'Projects',
      icon: <FolderOpen size={20} />,
      path: `/designer/${designerId}/projects`
    },
    {
      label: 'Create Design',
      icon: <Palette size={20} />,
      path: `/designer/${designerId}/designs/create`
    }
  ];

  const isActive = (path: string) => {
    if (!designerId) return false; // Check an toàn
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Cập nhật hàm logout để dùng signOut
  const handleLogout = async () => {
    await signOut();
    // Không cần navigate, AuthProvider và Route Guard sẽ tự động xử lý
  };

  // Check an toàn (dù DesignerRoute đã check)
  if (!profile) {
    return <div className="h-screen w-full flex items-center justify-center">Đang tải...</div>;
  }

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
          <Link to={`/designer/${designerId}/dashboard`} className="text-2xl font-bold font-serif">
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
                    ${isActive(item.path)
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