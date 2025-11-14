// src/components/DesignTab.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DesignItem from "./DesignItem"; // component con (mình có ví dụ bên dưới)
import LoginRequiredModal from "./LoginRequiredModal";
import { useNavigate } from "react-router";

interface Design {
    id: number;
    img: string;
    name: string;
    designer: string;
    createdt: string;
    "type room": string;
}

interface DesignTabProps {
    open: boolean; // nếu parent muốn điều khiển
    onClose: () => void;
}



const DesignTab: React.FC<DesignTabProps> = ({ open, onClose }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<Design[]>([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();

    const loadItems = () => {
        if (!user) {
            setItems([]);
            return;
        }
        const key = `designTab_${user.id}`;
        const saved: Design[] = JSON.parse(localStorage.getItem(key) || "[]");
        setItems(saved);
    };

    // Load khi mount / user thay đổi / mở tab
    useEffect(() => {
        loadItems();
        window.addEventListener("designTabChange", loadItems);
        return () => window.removeEventListener("designTabChange", loadItems);
    }, [user]);

    const handleRemove = (id: number) => {
        if (!user) return;
        const key = `designTab_${user.id}`;
        const saved: Design[] = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = saved.filter((d) => d.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
        setItems(updated);
        window.dispatchEvent(new Event("designTabChange"));
    };

    const handleClearAll = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        const key = `designTab_${user.id}`;
        localStorage.removeItem(key);
        setItems([]);
        // Dispatch event để header cập nhật badge ngay
        window.dispatchEvent(new Event("sendDesignsToChat"));
        window.dispatchEvent(new Event("designTabChange"));
    };

    //
    const handleSendDesignsToChat = () => {
        if (!user) return;
        const key = `designTab_${user.id}`;
        const savedDesigns = JSON.parse(localStorage.getItem(key) || '[]') as Design[];
        if (savedDesigns.length === 0) return;

        // Lưu designs tạm cho ConsultationPage
        localStorage.setItem(`pendingDesigns_${user.id}`, JSON.stringify(savedDesigns));

        // ✅ Dispatch event **trước khi xóa**
        window.dispatchEvent(new Event("sendDesignsToChat"));

        // Xóa designTab
        localStorage.removeItem(key);
        setItems([]);

        // Thông báo update header
        window.dispatchEvent(new Event("designTabChange"));

        // Đóng tab
        onClose();

        // Chuyển trang
        navigate(`/customer/${user.id}/consultation`);
    };

    useEffect(() => {
        if (open && !user) setShowLoginModal(true);
    }, [open, user]);

    return (
        <>
            <LoginRequiredModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />

            <div
                className={`fixed top-0 right-0 bg-white shadow-2xl w-96 h-full grid grid-rows-[60px_1fr_60px]
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Design Tab</h2>
                    <button onClick={onClose} className="text-gray-600">Close</button>
                </div>

                <div className="p-4 overflow-auto">
                    {items.length === 0 ? (
                        <p className="text-gray-500">Không có mẫu nào trong Design Tab.</p>
                    ) : (
                        items.map((item) => (
                            <DesignItem key={item.id} data={item} onRemove={() => handleRemove(item.id)} />
                        ))
                    )}
                </div>

                <div className="p-4 border-t grid grid-cols-2 gap-2">
                    <button
                        onClick={handleClearAll}
                        className="bg-red-500 text-white py-2 rounded"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            if (!user) return;

                            const key = `designTab_${user.id}`;
                            const savedDesigns: Design[] = JSON.parse(localStorage.getItem(key) || "[]");
                            if (savedDesigns.length === 0) return;

                            // Lưu tạm designs
                            localStorage.setItem(`pendingDesigns_${user.id}`, JSON.stringify(savedDesigns));

                            // ✅ Thông báo header trước khi xóa localStorage
                            window.dispatchEvent(new Event("sendDesignsToChat"));


                            // Đóng tab
                            onClose();

                            // Chuyển sang ConsultationPage
                            navigate(`/customer/${user.id}/consultation`);
                        }}
                        className="bg-green-600 text-white py-2 rounded"
                    >
                        Consultation Page
                    </button>
                </div>
            </div>
        </>
    );
};

export default DesignTab;
