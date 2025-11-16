import React, { useEffect, useState } from "react";
import LoginRequiredModal from "./LoginRequiredModal";
import { useAuth } from "../../context/AuthContext";

const API_URL = "https://api.npoint.io/3619c3ea1583a5bd1216";

interface Design {
    id: string;
    name: string;
    img: string;
    designer: string;
    createdAt: string;
    "type room"?: string;
}

interface DesignGridProps {
    category: string;
}

const DesignGrid: React.FC<DesignGridProps> = ({ category }) => {
    const { user } = useAuth(); //  Lấy user từ context
    const [designs, setDesigns] = useState<Design[]>([]);
    const [visibleDesigns, setVisibleDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                setError(null);
                setLoading(true);

                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("Không thể tải dữ liệu thiết kế");

                const data: Design[] = await res.json();
                const categoryFilter = category.toLowerCase();

                const filteredData = data.filter(
                    (design) => design["type room"]?.toLowerCase() === categoryFilter
                );

                setVisibleDesigns(filteredData.slice(0, 12));
                setDesigns(filteredData);

                setTimeout(() => setVisibleDesigns(filteredData), 1500);
            } catch (err: any) {
                setError(err.message || "Đã có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };

        fetchDesigns();
    }, [category]);

    const handleAddClick = (design: Design) => {
        if (!user) {
            setShowModal(true);
            return;
        }

        const key = `designTab_${user.id}`;
        const saved: Design[] = JSON.parse(localStorage.getItem(key) || "[]");

        // Tránh duplicate
        const exists = saved.some((d) => d.id === design.id);
        if (!exists) {
            const updated = [...saved, design];
            localStorage.setItem(key, JSON.stringify(updated));
            console.log(`Design "${design.name}" đã được thêm vào Design Tab của ${user.name}`);

            // --- THÊM DÒNG NÀY ---
            window.dispatchEvent(new Event("designTabChange")); // báo các component khác update
        } else {
            console.log(`Design "${design.name}" đã tồn tại trong Design Tab`);
        }
    };

    if (loading)
        return (
            <div className="h-[420px] flex items-center justify-center">
                <p>Loading design….</p>
            </div>
        );

    if (error)
        return (
            <div className="h-[420px] flex items-center justify-center text-red-500">
                <p>{error}</p>
            </div>
        );

    if (visibleDesigns.length === 0)
        return (
            <div className="h-[420px] flex items-center justify-center">
                <p>No designs found for {category}.</p>
            </div>
        );

    const columns = [[], [], [], []] as Design[][];
    visibleDesigns.forEach((p, i) => {
        columns[i % 4].push(p);
    });

    return (
        <section className="DesignGallery h-auto p-6 container mx-auto mt-[30px]">
            <LoginRequiredModal show={showModal} onClose={() => setShowModal(false)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-4">
                        {col.map((design) => (
                            <div
                                key={design.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden group transform hover:shadow-xl transition duration-300"
                            >
                                <div className="relative h-64">
                                    <img
                                        src={design.img}
                                        alt={design.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <button
                                        onClick={() => handleAddClick(design)}
                                        className="absolute bottom-4 right-4 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <i className="bi bi-house-add-fill text-xl"></i>
                                    </button>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-base truncate text-gray-900 text-[32px] font-lora">
                                        {design.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1 font-lora">
                                        Designer: {design.designer}
                                    </p>
                                    <p className="text-gray-600 text-xs mt-1 font-lora">
                                        Room: {design["type room"]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DesignGrid;
