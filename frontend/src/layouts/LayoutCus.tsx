import React from "react";
import { Outlet, useParams, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Cus_Header from "../components/user/Cus_Header";

const LayoutCus: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // id từ URL là string
    const { user } = useAuth(); // user đang đăng nhập

    // Chưa đăng nhập → quay về homepage guest
    if (!user) return <Navigate to="/" replace />;

    // Nếu id trong URL khác với user đang login → chặn
    if (id && id !== user.id) {
        return <Navigate to={`/customer/${user.id}`} replace />;
    }

    return (
        <>
            <Cus_Header customerId={user.id} />
            <main className="pt-[48px]">
                <Outlet />
            </main>
        </>
    );
};

export default LayoutCus;
