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
import Ad_DesignerNew from './components/admin/Ad_DesignerNew';

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

/*
 * ---------------------------------------
 * COMPONENT BẢO VỆ ROUTE (Giữ nguyên)
 * ---------------------------------------
 */

// Bảo vệ route cho Customer
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/SignIn" replace />;
  }
  
  if (user.role !== 'user') {
    if (user.role === 'admin') return <Navigate to="/admin_home" replace />;
    if (user.role === 'designer') return <Navigate to={`/designer/${user.id}/dashboard`} replace />;
  }
  
  return children;
};

// Bảo vệ route cho Admin
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/SignIn" replace />;
  }
  
  if (user.role !== 'admin') {
    if (user.role === 'user') return <Navigate to={`/customer/${user.id}`} replace />;
    if (user.role === 'designer') return <Navigate to={`/designer/${user.id}/dashboard`} replace />;
  }
  
  return children;
};

// Bảo vệ route cho Designer
const DesignerRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/SignIn" replace />;
  }
  
  if (user.role !== 'designer') {
    if (user.role === 'admin') return <Navigate to="/admin_home" replace />;
    if (user.role === 'user') return <Navigate to={`/customer/${user.id}`} replace />;
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
      { path: "consultation", element: (<ConsultationPage />), }

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
      { path: "/admin_designers", element: <Ad_Designers /> },
      { path: "/admin_products", element: <Ad_Products /> },
      { path: "/admin_designers/new", element: <Ad_DesignerNew /> },
      { path: "/admin_products/new", element: <Ad_ProductNew /> },
      { path: "/admin/:id", element: <AvatarProfile /> }, // Đây là profile của Admin
      
      // ⭐️⭐️⭐️ SỬA LỖI XUNG ĐỘT TẠI ĐÂY ⭐️⭐️⭐️
      // Đổi path "/designer/:id" thành "/desad/:id" như bạn muốn
      { path: "/desad/:id", element: <AvatarProfile /> },
      // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️

      { path: "/users/:id", element: <AvatarProfile /> },
      { path: "/products/:id", element: <ProductProfile /> },
      { path: "/admin_interior", element: <Ad_Interior /> },
      { path: "/admin_interior/:id", element: <InteriorProfile /> }, 
      { path: "/admin_approval", element: <Ad_Approval /> },
      { path: "/admin_approval/:id", element: <InteriorApprovalProfile /> },
      { path: "/admin_quotation", element: <Ad_Quotation /> },
      { path: "/admin_quotation/:id", element: <QuotationProfile/> },
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