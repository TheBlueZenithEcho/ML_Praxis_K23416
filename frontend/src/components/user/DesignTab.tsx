// src/components/DesignTab.tsx
import React, { useEffect, useState } from "react";
import DesignItem from "./DesignItem"; // component con (mình có ví dụ bên dưới)
import LoginRequiredModal from "./LoginRequiredModal";
import { useAuth } from "@/context/AuthContext";

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

    // load khi mount hoặc user thay đổi hoặc open true
    useEffect(() => {
        if (!user) {
            setItems([]);
            return;
        }
        const key = `designTab_${user.id}`;
        const saved: Design[] = JSON.parse(localStorage.getItem(key) || "[]");
        setItems(saved);
    }, [user, open]);

    const handleRemove = (id: number) => {
        if (!user) return;
        const key = `designTab_${user.id}`;
        const saved: Design[] = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = saved.filter((d: Design) => d.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
        setItems(updated);
    };

    const handleClearAll = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        const key = `designTab_${user.id}`;
        localStorage.removeItem(key);
        setItems([]);
    };

    // nếu bạn muốn khi chưa login mà bấm mở tab thì show modal:
    useEffect(() => {
        if (open && !user) {
            setShowLoginModal(true);
        }
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
                    <button onClick={handleClearAll} className="bg-red-500 text-white py-2 rounded">Clear</button>
                    <button className="bg-green-600 text-white py-2 rounded">Go to Design Tab Page</button>
                </div>
            </div>
        </>
    );
};

export default DesignTab;
