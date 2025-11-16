// Tên file: App_both.tsx
// (Full code đã sửa lỗi xung đột. Đổi "/designer/:id" của Admin thành "/desad/:id")

import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
} from 'react-router-dom';
import { Toaster } from 'sonner';

// --- CSS ---
import "./index.css";

// --- Context ---
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- Layouts ---
import LayoutGuest from './layouts/LayoutGuest';
import LayoutCus from './layouts/LayoutCus';
import LayoutAdmin from './layouts/LayoutAdmin';
// import DesignerLayout from './components/designer/layout/DesignerLayout';

// --- Public Pages (Khách) ---
import HomePage from "./pages/user/HomePage";
import SignUp from "./pages/user/SignUp";
import SignIn from "./pages/user/SignIn";
import NotFound from "./pages/user/NotFound";
import LivingRoom from "./pages/user/LivingRoom";
import BedRoom from "./pages/user/Bedroom";
import Kitchen from "./pages/user/Kitchen";
import ContactPage from './pages/user/Contact';
import About from './pages/user/About';

// --- Customer Pages (Người dùng đã đăng nhập) ---
import Cus_HomePage from "./pages/user/Cus_HomePage";
import ConsultationPage from './pages/user/ConsultationPage';


// --- Admin Pages ---
import Ad_Home from './pages/admin/Ad_Home';
import Ad_Users from './pages/admin/Ad_Users';
import Ad_Products from './pages/admin/Ad_Products';
import Ad_Designers from './pages/admin/Ad_Designers';
import Ad_Interior from './pages/admin/Ad_Interior';
import AvatarProfile from './components/admin/AvatarProfile';
import ProductProfile from './components/admin/ProductProfile';
import InteriorProfile from './components/admin/InteriorProfile';
import Ad_ProductNew from './components/admin/Ad_ProductNew';


// --- Designer Pages ---
import ProfilePage from './pages/designer/Profile';
import DashboardPage from './pages/designer/Dashboard';
import LeadManagementPage from './pages/designer/LeadManagement';
import LeadDetailPage from './pages/designer/LeadDetail';
import ProjectManagementPage from './pages/designer/ProjectManagement';
import ProjectDetailPage from './pages/designer/ProjectDetail';
import CreateDesignPage from './pages/designer/CreateDesign';
import Ad_Approval from './pages/admin/Ad_Approval';
import InteriorApprovalProfile from './components/admin/InteriorApprovalProfile';
import Ad_Quotation from './pages/admin/Ad_Quotation';
import QuotationProfile from './components/admin/QuotationProfile';
import DesignerLayout from './layouts/LayoutDesigner';

// ⭐️⭐️⭐️ SỬA LỖI 404: THÊM DÒNG IMPORT NÀY ⭐️⭐️⭐️
import Ad_DesignerNew from './components/admin/Ad_DesignerNew';
import Cus_Profile from './pages/user/Cus_Profile';
// ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️

/*
 * ---------------------------------------
 * COMPONENT BẢO VỆ ROUTE (Giữ nguyên)
 * ---------------------------------------
 */

// Bảo vệ route cho Customer
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { profile, loading } = useAuth();
  // Nếu đang tải, hiển thị một thông báo (hoặc spinner)
  // và KHÔNG làm gì cả cho đến khi có kết quả
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang xác thực...</div>;
  }


  if (!profile) {
    return <Navigate to="/SignIn" replace />;
  }

  if (profile.role !== 'user') {
    if (profile.role === 'admin') return <Navigate to="/admin_home" replace />;
    if (profile.role === 'designer') return <Navigate to={`/designer/${profile.id}/dashboard`} replace />;
  }

  return children;
};

// Bảo vệ route cho Admin
// const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
//   const { profile, loading } = useAuth();
//   if (!profile) {
//     return <Navigate to="/SignIn" replace />;
//   }

//   if (profile.role !== 'admin') {
//     if (profile.role === 'user') return <Navigate to={`/customer/${profile.id}`} replace />;
//     if (profile.role === 'designer') return <Navigate to={`/designer/${profile.id}/dashboard`} replace />;
//   }

//   return children;
// };
// Sửa lại AdminRoute (Áp dụng tương tự cho 2 cái còn lại)
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { profile, loading } = useAuth();

  // 1. KIỂM TRA LOADING TRƯỚC
  // Nếu đang tải, hiển thị một thông báo (hoặc spinner)
  // và KHÔNG làm gì cả cho đến khi có kết quả
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang xác thực...</div>;
  }

  // 2. KIỂM TRA PROFILE (Sau khi đã hết loading)
  // Nếu không có profile, lúc này mới chắc chắn là chưa đăng nhập
  if (!profile) {
    return <Navigate to="/SignIn" replace />;
  }

  // 3. KIỂM TRA VAI TRÒ
  if (profile.role !== 'admin') {
    if (profile.role === 'user') return <Navigate to={`/customer/${profile.id}`} replace />;
    if (profile.role === 'designer') return <Navigate to={`/designer/${profile.id}/dashboard`} replace />;
  }

  // 4. Hợp lệ
  return children;
};

// Bảo vệ route cho Designer
const DesignerRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { profile, loading } = useAuth();
  // Nếu đang tải, hiển thị một thông báo (hoặc spinner)
  // và KHÔNG làm gì cả cho đến khi có kết quả
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang xác thực...</div>;
  }


  if (!profile) {
    return <Navigate to="/SignIn" replace />;
  }

  if (profile.role !== 'designer') {
    if (profile.role === 'admin') return <Navigate to="/admin_home" replace />;
    if (profile.role === 'user') return <Navigate to={`/customer/${profile.id}`} replace />;
  }

  return children;
};

/*
 * ---------------------------------------
 * CẤU HÌNH ROUTER (ĐÃ GỘP 4 LUỒNG)
 * ---------------------------------------
 */
const router = createBrowserRouter([
  /**
   * 1. GUEST LAYOUT (Công khai)
   */
  {
    element: <LayoutGuest />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/SignIn", element: <SignIn /> },
      { path: "/SignUp", element: <SignUp /> },
      { path: "/livingRoom", element: <LivingRoom /> },
      { path: "/bedRoom", element: <BedRoom /> },
      { path: "/kitchen", element: <Kitchen /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/about", element: <About /> },

    ],
  },

  /**
   * 2. CUSTOMER LAYOUT (Bảo vệ)
   */
  {
    path: "/customer/:id",
    element: (
      <ProtectedRoute>
        <LayoutCus />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Cus_HomePage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "livingRoom", element: <LivingRoom /> },
      { path: "bedRoom", element: <BedRoom /> },
      { path: "kitchen", element: <Kitchen /> },
      { path: "consultation", element: (<ConsultationPage />)},
      { path: "profile", element: <Cus_Profile/> },

    ],
  },


  /**
   * 3. ADMIN LAYOUT (Bảo vệ)
   */
  {
    element: (
      <AdminRoute>
        <LayoutAdmin />
      </AdminRoute>
    ),
    children: [
      // (Giữ nguyên các route admin)
      { path: "/admin_home", element: <Ad_Home /> },
      { path: "/admin_users", element: <Ad_Users /> },
      { path: "/admin_users/:id", element: <AvatarProfile /> }, // <-- SỬA 1: Di chuyển vào đây
      { path: "/admin_designers", element: <Ad_Designers /> },
      { path: "/admin_products", element: <Ad_Products /> },

      // ⭐️⭐️⭐️ SỬA LỖI 404: THÊM DÒNG PATH NÀY VÀO ⭐️⭐️⭐️
      { path: "/admin_designer/new", element: <Ad_DesignerNew /> },
      // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️

      { path: "/admin_products/new", element: <Ad_ProductNew /> },
      { path: "/admin_products/:id", element: <ProductProfile /> }, // <-- SỬA 2: Di chuyển vào đây
      // { path: "/admin/:id", element: <AvatarProfile /> }, // Đây là profile của Admin

      // (Path xem profile designer của Admin)
      { path: "/desad/:id", element: <AvatarProfile /> },

      { path: "/users/:id", element: <AvatarProfile /> },
      { path: "/products/:id", element: <ProductProfile /> },
      { path: "/admin_interior", element: <Ad_Interior /> },
      { path: "/admin_interior/:id", element: <InteriorProfile /> },
      { path: "/admin_approval", element: <Ad_Approval /> },
      { path: "/admin_approval/:id", element: <InteriorApprovalProfile /> },
      { path: "/admin_quotation", element: <Ad_Quotation /> },
      { path: "/admin_quotation/:id", element: <QuotationProfile /> },
    ],
  },

  /**
   * 4. DESIGNER LAYOUT (Bảo vệ)
   */
  {
    // Path này đã đúng, nó không còn bị xung đột nữa
    path: "/designer/:id",
    element: (
      <DesignerRoute>
        <DesignerLayout />
      </DesignerRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "leads", element: <LeadManagementPage /> },
      { path: "leads/:leadId", element: <LeadDetailPage /> },
      { path: "projects", element: <ProjectManagementPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
      { path: "designs/create", element: <CreateDesignPage /> },
    ]
  },

  /**
   * 5. NOT FOUND (Trang 404)
   */
  { path: "*", element: <NotFound /> },
]);

/**
 * Component App chính
 */
function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;