import React, { useState, useEffect } from "react";

// Interface mới phù hợp với API
interface TeamMember {
    id: number;
    img: string;
    name: string;
    role: "admin" | "designer" | "user" | string; // Thêm type cho role để lọc chính xác
    email: string;
    phone: string;
    createdAt: string;
}

const About: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch và lọc dữ liệu
    useEffect(() => {
        const fetchTeam = async () => {
            const API_URL = "https://api.npoint.io/4a915d88732882680a44";

            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: TeamMember[] = await response.json();

                // 1. Lọc chỉ lấy những người có role là "designer" hoặc "admin"
                const filteredMembers = data.filter(member =>
                    member.role.toLowerCase() === 'designer' || member.role.toLowerCase() === 'admin'
                );

                // 2. Giới hạn chỉ lấy 8 người đầu tiên
                setTeamMembers(filteredMembers.slice(0, 8));
                setError(null);
            } catch (err) {
                console.error("Lỗi khi fetch dữ liệu:", err);
                setError("Không thể tải danh sách Team.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    // --- Trạng thái tải và Lỗi ---
    if (loading)
        return (
            <div className="min-h-[600px] flex items-center justify-center bg-gray-50">
                <p>Đang tải danh sách Team...</p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-[600px] flex items-center justify-center text-red-500 bg-gray-50">
                <p>{error}</p>
            </div>
        );

    // Nếu không có ai sau khi lọc
    if (teamMembers.length === 0)
        return (
            <div className="min-h-[600px] flex items-center justify-center bg-gray-50">
                <p>Không tìm thấy Admin hoặc Designer nào.</p>
            </div>
        );


    // --- Giao diện chính ---
    return (
        <section className="py-16 bg-white sm:py-24 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Meet our Team
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        A diverse team of passionate professionals with unique skills driving innovation and excellence in every project.
                    </p>
                </div>

                {/* Phần 1: Lưới Ảnh Lớn (Hiển thị 8 người) */}
                <div className="relative mb-20">
                    {/* Background mờ theo thiết kế */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/50 via-pink-100/50 to-blue-100/50 opacity-50 blur-3xl rounded-[40px]"></div>

                    <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-center">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="flex flex-col items-center">
                                {/* Dùng hình tròn/elip lượn sóng cho ảnh */}
                                <div className="w-full aspect-square max-w-40 overflow-hidden rounded-[45%_55%_40%_60%_/_30%_50%_70%_50%] border-4 border-white shadow-xl transform hover:scale-105 transition duration-300">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Thông tin nhỏ chỉ hiện tên */}
                                <p className="mt-2 text-sm font-medium text-gray-700">{member.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider Header */}
                <div className="text-center mb-12 mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        The Futureblox Team
                    </h2>
                    <p className="text-gray-500 max-w-3xl mx-auto text-sm">
                        A diverse group of passionate professionals, each bringing unique skills and experiences to drive innovation and excellence in every project we undertake.
                    </p>
                </div>

                {/* Phần 2: Lưới Card Thông Tin Chi Tiết (Hiển thị 8 người, 4 cột) */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-4 pt-10">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="flex flex-col items-start text-left">
                            {/* Ảnh nhỏ hơn */}
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 shadow-md">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                            <p className="text-sm font-medium text-yellow-600 mb-2">
                                {/* Dùng role làm chức danh */}
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {/* Dùng placeholder text vì không có mô tả chi tiết trong API */}
                                Dedicated to ensuring customer satisfaction with a focus on {member.role}-related tasks and client support.
                            </p>

                            {/* Icons xã hội (Placeholder) */}
                            <div className="flex space-x-2 mt-3 text-gray-400">
                                <i className="bi bi-linkedin hover:text-blue-500 cursor-pointer"></i>
                                <i className="bi bi-twitter hover:text-blue-400 cursor-pointer"></i>
                                <i className="bi bi-link-45deg hover:text-gray-600 cursor-pointer"></i>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default About;