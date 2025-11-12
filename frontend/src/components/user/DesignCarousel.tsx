import React, { useRef, useState } from "react";
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

interface DesignCarouselProps {
    designs: Design[];
    loading: boolean;
    error: string | null;
}

const DesignCarousel: React.FC<DesignCarouselProps> = ({ designs, loading, error }) => {
    const [showModal, setShowModal] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth(); // ✅ Lấy user từ context

    // 👉 Khi nhấn nút "add"
    const handleAddClick = (designId: number) => {
        if (!user) {
            // ❌ Nếu chưa đăng nhập → mở modal
            setShowModal(true);
        } else {
            // ✅ Nếu đã đăng nhập → thực hiện hành động khác
            console.log(`Người dùng ${user.name} thêm design có ID: ${designId}`);
            // Sau này có thể gọi API ở đây
        }
    };

    const scrollLeft = () => {
        scrollContainerRef.current?.scrollBy({
            left: -scrollContainerRef.current.clientWidth,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        scrollContainerRef.current?.scrollBy({
            left: scrollContainerRef.current.clientWidth,
            behavior: "smooth",
        });
    };

    // --- Trạng thái tải ---
    if (loading)
        return (
            <div className="h-[420px] flex items-center justify-center">
                <p>Đang tải thiết kế...</p>
            </div>
        );

    if (error)
        return (
            <div className="h-[420px] flex items-center justify-center text-red-500">
                <p>{error}</p>
            </div>
        );

    if (designs.length === 0)
        return (
            <div className="h-[420px] flex items-center justify-center">
                <p>Không tìm thấy thiết kế nào.</p>
            </div>
        );

    // --- Giao diện chính ---
    return (
        <div id="snap" className="relative w-full">
            <LoginRequiredModal show={showModal} onClose={() => setShowModal(false)} />

            <div
                ref={scrollContainerRef}
                className="carousel h-[420px] flex overflow-y-hidden snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <div className="carousel-body h-full flex gap-4 p-4">
                    {designs.map((design) => (
                        <div key={design.id} className="carousel-slide snap-center w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl h-full w-full flex flex-col overflow-hidden group shadow-md">
                                <div className="relative h-3/4">
                                    <img
                                        src={design.img}
                                        alt={design.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <button
                                        onClick={() => handleAddClick(design.id)}
                                        className="absolute bottom-4 right-4 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <i className="bi bi-house-add-fill text-xl"></i>
                                    </button>
                                </div>

                                <div className="p-4 h-1/4 flex flex-col justify-center">
                                    <h3 className="font-semibold text-lg truncate">{design.name}</h3>
                                    <p className="text-gray-600 text-sm">Designer: {design.designer}</p>
                                    <p className="text-gray-600 text-sm">Room: {design["type room"]}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nút cuộn trái/phải */}
            <button
                type="button"
                onClick={scrollLeft}
                className="absolute top-1/2 -translate-y-1/2 start-5 z-10 size-9.5 bg-white flex items-center justify-center rounded-full shadow-md"
            >
                <span className="bi bi-arrow-left size-5 cursor-pointer"></span>
            </button>

            <button
                type="button"
                onClick={scrollRight}
                className="absolute top-1/2 -translate-y-1/2 end-5 z-10 size-9.5 bg-white flex items-center justify-center rounded-full shadow-md"
            >
                <span className="bi bi-arrow-right size-5 cursor-pointer"></span>
            </button>
        </div>
    );
};

export default DesignCarousel;
