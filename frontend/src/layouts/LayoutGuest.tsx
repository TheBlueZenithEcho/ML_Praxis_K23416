// layout/LayoutGuest.tsx
import React from "react";
import { Outlet } from "react-router";
import Header from "../components/user/Header";

const LayoutGuest = () => {
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
