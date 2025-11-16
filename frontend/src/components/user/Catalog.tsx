import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DesignCarousel from "./DesignCarousel"; // Đã có file này sau khi sửa lỗi

// Định nghĩa Interface Design dựa trên cấu trúc API mới
interface Design {
    id: number;
    img: string; // Đường dẫn ảnh
    name: string;
    designer: string;
    createdt: string;
    "type room": string; // Phân loại theo phòng
}

const API_URL = "https://api.npoint.io/3619c3ea1583a5bd1216";

const Catalog = () => {
    // Danh mục được giữ nguyên theo yêu cầu
    const categories = ["Bed Room", "Living Room", "Kitchen"];
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    // Trạng thái dữ liệu
    const [allDesigns, setAllDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- LOGIC FETCH DỮ LIỆU ---
    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                setError(null);
                setLoading(true);
                const res = await fetch(API_URL);

                if (!res.ok) {
                    throw new Error("Không thể tải dữ liệu thiết kế từ API.");
                }

                // Dữ liệu từ npoint là một mảng trực tiếp
                const data: Design[] = await res.json();
                setAllDesigns(data);
            } catch (err: any) {
                console.error("Lỗi khi tải thiết kế:", err);
                setError(err.message || "Đã có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };

        fetchDesigns();
    }, []);

    // --- LOGIC LỌC DỮ LIỆU ---
    const filteredDesigns = useMemo(() => {
        if (loading || error) return [];

        // Chuyển danh mục đang hoạt động về chữ thường để so sánh (đảm bảo khớp với "type room" trong API)
        const categoryFilter = activeCategory.toLowerCase();

        return allDesigns.filter(
            (design) => design["type room"].toLowerCase() === categoryFilter
        );
    }, [allDesigns, activeCategory, loading, error]);


    return (
        <section className="catalog mt-[40px] xl:mt-[90px] relative z-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-5 gap-4">
                    {/* Tiêu đề */}
                    <h2 className="font-serif text-green-800 text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg text-center md:text-left">
                        Explore Our Collections
                    </h2>

                    {/* Bộ chọn danh mục */}
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 rounded-full bg-[#308318]/10 p-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-4 sm:px-6 md:px-8 py-1.5 text-sm sm:text-base font-medium transition-colors
                                    ${activeCategory === category
                                        ? "bg-white text-secondary shadow-sm"
                                        : "bg-transparent text-gray-600 hover:text-secondary"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nội dung danh mục */}
                <div className="mt-8">
                    {/* Sử dụng AnimatePresence để tạo hiệu ứng khi thay đổi danh mục */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory} // Quan trọng: thay đổi key để kích hoạt AnimatePresence
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <DesignCarousel
                                designs={filteredDesigns} // Truyền dữ liệu đã lọc
                                loading={loading} // Truyền trạng thái loading
                                error={error} // Truyền trạng thái error
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

export default Catalog
