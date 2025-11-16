import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import React, { useState } from 'react';

// Dữ liệu giả lập để hiển thị form

const inputStyle = `
    w-full p-3 rounded-xl border-none 
    bg-gray-100 
    shadow-inner shadow-gray-300 
    focus:outline-none focus:ring-2 focus:ring-[#082503] focus:shadow-md 
    placeholder-gray-500 transition-all duration-300
`;

// --- Component Chính ---
const UserProfileForm = () => {


        // lấy user từ AuthContext
        const { user, setUser, logout } = useAuth();

        // Nếu chưa login → không có user
        if (!user) return <p className="text-center mt-10">Loading user...</p>;

        // Tạo state để sửa form
        const [name, setName] = useState(user.name);
        const [phone, setPhone] = useState(user.phone || "");
        const [avatar, setAvatar] = useState(user.img);

        // --- HÀM UPDATE USER ---
        const handleSave = async (e: any) => {
            e.preventDefault();

            // CÂU LỆNH CƠ BẢN — dễ cho người mới học
            const { error } = await supabase
                .from("users")                 // tbl users
                .update({
                    name: name,               // giá trị muốn sửa
                    phone: phone,
                    avatar_url: avatar
                })
                .eq("id", user.id);           // điều kiện WHERE id = user.id

            if (error) {
                alert("Update failed: " + error.message);
                return;
            }

            // cập nhật lại context
            setUser({
                ...user,
                name,
                phone,
                avatar_url: avatar
            });

            alert("Profile updated successfully!");
        };

        // --- HÀM DELETE USER ---
        const handleDeleteUser = async () => {
            if (!confirm("Are you sure you want to delete this user?")) return;

            const { error } = await supabase
                .from("profiles")
                .delete()
                .eq("id", user.id);

            if (error) {
                alert("Delete failed: " + error.message);
                return;
            }

            logout();
            alert("User deleted!");
        };

        // --- UPLOAD ẢNH (simple version) ---
        const handleUploadPhoto = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            // upload file vào Supabase Storage
            const { data, error } = await supabase.storage
                .from("avatars")
                .upload(`user_${user.id}.png`, file, { upsert: true });

            if (error) {
                alert("Upload failed");
                return;
            }

            // lấy link công khai
            const { data: urlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(data.path);

            setAvatar(urlData.publicUrl);
        };

    return (
        // 1. Thay nền Form thành màu xám nhạt (bg-gray-100) để nổi bật hiệu ứng Neumorphism
        <div className="max-w-4xl mx-auto my-16 p-8 lg:p-12 bg-gray-100 rounded-2xl shadow-xl">

            {/* Tiêu đề Profile */}
            <div className="border-b border-gray-300 pb-6 mb-8">
                <h2 className="text-3xl font-serif text-[#082503] font-bold">
                    UPDATE 
                </h2>
                <p className="text-gray-600 mt-1 font-inter">Manage your personal information and account settings</p>
            </div>

            {/* Avatar và Thông tin cơ bản (Áp dụng shadow nổi nhẹ) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 p-6 bg-gray-100 rounded-xl shadow-lg">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />

                    <div className="flex flex-col">
                        <p className="text-xl font-semibold text-[#082503]">{name}</p>
                    </div>
                </div>

                {/* Buttons Upload / Delete Photo (Giữ style hiện đại, dễ nhận biết) */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={handleUploadPhoto}
                        className="px-4 py-2 bg-[#082503] text-[#FDFBCE] rounded-xl font-medium hover:bg-opacity-90 transition shadow-md text-sm"
                    >
                        UPLOAD NEW PHOTO
                    </button>
                    <button
                        type="button"
                        onClick={() => setAvatar("")}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition shadow-sm text-sm"
                    >
                        DELETE PHOTO
                    </button>
                </div>
            </div>

            {/* Form Chi tiết */}
            <form onSubmit={handleSave} className="space-y-8">

                {/* Hàng 1: Tên & ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <div className='relative flex items-center'>
                            <i className="bi bi-person absolute left-4 text-gray-500 text-lg"></i>
                            <input
                                type="text"
                                value={name}
                                className={`pl-10 pr-3 py-3 ${inputStyle} cursor-not-allowed shadow-inner`}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        
                    </div>
                    {/* Input User ID (Disabled) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                        <div className="relative flex items-center">
                            <i className="bi bi-fingerprint absolute left-4 text-gray-500 text-lg"></i>
                            <input
                                type="text"
                                value={user.id}
                                className={`pl-10 pr-3 py-3 ${inputStyle} cursor-not-allowed bg-gray-200 shadow-inner`}
                                disabled
                            />
                        </div>
                        
                    </div>
                </div>

                {/* Hàng 2: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Email (Disabled) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <div className="relative flex items-center">
                            <i className="bi bi-envelope absolute left-4 text-gray-500 text-lg"></i>
                            <input
                                type="email"
                                value={user.email}
                                className={`pl-10 pr-3 py-3 ${inputStyle} cursor-not-allowed bg-gray-200 shadow-inner`}
                                disabled
                            />
                        </div>
                    </div>
                    {/* Input Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative flex items-center">
                            <i className="bi bi-telephone absolute left-4 text-gray-500 text-lg"></i>
                            <input
                                type="tel"
                                value={phone}
                                className={`pl-10 pr-3 py-3 ${inputStyle} shadow-inner`}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons Lưu và Xóa/Hủy (Giữ style hiện đại) */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-300 mt-8">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
                    >
                        SAVE CHANGES
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteUser}
                        className="px-6 py-2 border border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition"
                    >
                        DELETE USER
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileForm;