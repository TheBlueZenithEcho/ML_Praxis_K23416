// layout/LayoutGuest.tsx
// import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/user/Header";
import { useAuth } from "../context/AuthContext";

const LayoutGuest = () => {
    const { profile, loading } = useAuth();
    // Nếu đang tải, không làm gì cả
    if (loading) {
        return <div>Đang tải...</div>; // Hoặc một spinner
    }
    // Nếu đã hết loading VÀ có profile (đã đăng nhập)
    if (profile) {
        // Tự động điều hướng dựa trên vai trò
        if (profile.role === 'admin') {
            return <Navigate to="/admin_home" replace />;
        }
        if (profile.role === 'designer') {
            return <Navigate to={`/designer/${profile.id}/dashboard`} replace />;
        }
        // Mặc định là 'user'
        return <Navigate to={`/customer/${profile.id}`} replace />;
    }

    return (
        <>
            <Header />
            <div className="pt-[56px]">
                <Outlet />
            </div>
        </>
    );
};

export default LayoutGuest;
