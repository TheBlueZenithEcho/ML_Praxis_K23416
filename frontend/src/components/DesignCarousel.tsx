import React, { useRef, useState } from "react";
// Giả định component này tồn tại.
// Nếu bạn không có file này, bạn sẽ cần tạo một file tên là LoginRequiredModal.tsx
// hoặc xóa dòng import và các đoạn gọi nó đi.
import LoginRequiredModal from "./LoginRequiredModal";

// Định nghĩa Interface Design dựa trên cấu trúc API mới
interface Design {
    id: number; // API dùng id dạng số
    img: string;
    name: string;
    designer: string;
    createdt: string;
    "type room": string;
}

// Định nghĩa Props mới để nhận dữ liệu đã lọc từ Catalog.tsx
interface DesignCarouselProps {
    designs: Design[];
    loading: boolean;
    error: string | null;
}

const DesignCarousel: React.FC<DesignCarouselProps> = ({ designs, loading, error }) => {
    // Logic modal và scroll được giữ nguyên
    const [showModal, setShowModal] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -scrollContainerRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: scrollContainerRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    // --- HIỂN THỊ TRẠNG THÁI (Loading/Error/Empty) ---
    if (loading) {
        return (
            <div className="h-[420px] flex items-center justify-center">
                <p>Đang tải thiết kế...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="h-[420px] flex items-center justify-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (designs.length === 0) {
        return (
            <div className="h-[420px] flex items-center justify-center">
                <p>Không tìm thấy thiết kế nào trong danh mục này.</p>
            </div>
        );
    }

    // --- HIỂN THỊ CAROUSEL (GIỮ NGUYÊN GIAO DIỆN) ---
    return (
        <div
            id="snap"
            className="relative w-full"
            data-carousel='{ "loadingClasses": "opacity-0", "slidesQty": { "xs": 1, "lg": 3 }, "isCentered": true, "isSnap": true }'
        >
            {/* ✅ Chỉ render modal 1 lần ở ngoài, không bị lặp */}
            {/* Giả định LoginRequiredModal tồn tại */}
            <LoginRequiredModal show={showModal} onClose={() => setShowModal(false)} />

            <div
                ref={scrollContainerRef}
                className="carousel h-[420px] flex overflow-y-hidden snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <div className="carousel-body h-full flex gap-4 p-4">
                    {/* Thay products bằng designs */}
                    {designs.map((design) => (
                        <div
                            key={design.id}
                            className="carousel-slide snap-center w-80 flex-shrink-0"
                        >
                            <div className="bg-white rounded-2xl h-full w-full flex flex-col overflow-hidden group shadow-md">
                                <div className="relative h-3/4">
                                    <img
                                        // Cập nhật trường ảnh từ image_path sang img
                                        src={design.img}
                                        alt={design.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="absolute bottom-4 right-4 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <i className="bi bi-house-add-fill text-xl"></i>
                                    </button>
                                </div>

                                <div className="p-4 h-1/4 flex flex-col justify-center">
                                    <h3 className="font-semibold text-lg truncate">
                                        {design.name}
                                    </h3>
                                    {/* Cập nhật thông tin hiển thị từ giá ($product.price) sang Designer và Room Type */}
                                    <p className="text-gray-600 text-sm">Designer: {design.designer}</p>
                                    <p className="text-gray-600 text-sm">Room: {design["type room"]}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nút cuộn trái */}
            <button
                type="button"
                onClick={scrollLeft}
                className="carousel-prev absolute top-1/2 -translate-y-1/2 start-5 z-10 size-9.5 bg-white flex items-center justify-center rounded-full shadow-md"
            >
                <span className="bi bi-arrow-left size-5 cursor-pointer"></span>
            </button>

            {/* Nút cuộn phải */}
            <button
                type="button"
                onClick={scrollRight}
                className="carousel-next absolute top-1/2 -translate-y-1/2 end-5 z-10 size-9.5 bg-white flex items-center justify-center rounded-full shadow-md"
            >
                <span className="bi bi-arrow-right size-5 cursor-pointer"></span>
            </button>
        </div>
    );
};

export default DesignCarousel;
