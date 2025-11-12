import React from "react";
import { Outlet, useParams, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Cus_Header from "../components/user/Cus_Header";

const LayoutCus: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // id từ URL (string)
    const { user } = useAuth(); // user đang đăng nhập

    // Chưa đăng nhập → quay về homepage guest
    if (!user) return <Navigate to="/" replace />;

    // Convert id từ URL sang number để so sánh với user.id
    const paramId = id ? Number(id) : null;

    // Nếu id trong URL khác với user đang login → chặn
    if (paramId && paramId !== user.id) {
        return <Navigate to={`/customer/${user.id}`} replace />;
    }

    return (
        <>
            <Cus_Header customerId={user.id} />
            <main className="pt-[56px]">
                <Outlet />
            </main>
        </>
    );
};

export default LayoutCus;
