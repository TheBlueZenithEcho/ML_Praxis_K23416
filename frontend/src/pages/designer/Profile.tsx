import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { AuthUser } from '@/types/user.types';
import ProfileForm from '@/components/designer/profile/ProfileForm';

// --- IMPORT LOGIC SUPABASE & TOAST ---
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Dùng cho trạng thái loading

// --- HẰNG SỐ VÀ HÀM TIỆN ÍCH ---
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-your-public-url.r2.dev';

const formatEmailToFilename = (email: string) => {
    return email.replace(/@/g, '_at_').replace(/\./g, '_');
};


const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuth(); // Dữ liệu session user (minimal)

    // 1. STATE MỚI: Dữ liệu Profile ĐẦY ĐỦ từ DB mà Form sẽ dùng
    const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State quản lý việc cập nhật
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // 2. useEffect: LẤY DỮ LIỆU PROFILE ĐẦY ĐỦ TỪ SUPABASE
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.id) { setLoading(false); return; }

            setLoading(true);
            setError(null);
            try {
                // Sử dụng RPC call giống như AvatarProfile.tsx
                const { data: profileArray, error: rpcError } = await supabase
                    .rpc('get_profile_by_id', { profile_id: user.id });

                if (rpcError) throw rpcError;

                const foundProfile = profileArray ? profileArray[0] as AuthUser : null;
                if (foundProfile) {
                    setUserProfile(foundProfile); // Set state mà form sẽ dùng
                } else {
                    setError("Không tìm thấy dữ liệu hồ sơ đầy đủ.");
                }
            } catch (err: any) {
                setError(err.message || 'Lỗi không xác định khi tải hồ sơ.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserProfile();
        } else {
            setLoading(false); // Nếu chưa đăng nhập, không cần load
        }
    }, [user]); // Re-run khi session user thay đổi


    // 3. CẬP NHẬT LOGIC handleUpdateProfile
    const handleUpdateProfile = async (updatedData: Partial<AuthUser>) => {
        if (!user || !setUser) return;

        setIsSaving(true);
        toast.loading('Đang lưu thay đổi...', { id: 'save-profile' });

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updatedData)
                .eq('id', user.id);
            if (error) throw error;

            // Cập nhật cả state cục bộ và state toàn cục
            const updatedProfile = { ...userProfile, ...updatedData };
            setUserProfile(updatedProfile as AuthUser);
            setUser(updatedProfile as AuthUser); // Cập nhật context

            toast.success("Cập nhật hồ sơ thành công!", { id: 'save-profile' });

        } catch (err: any) {
            toast.error(`Lỗi cập nhật: ${err.message}`, { id: 'save-profile' });
        } finally {
            setIsSaving(false);
        }
    };

    // 4. CẬP NHẬT LOGIC handleAvatarChange
    const handleAvatarChange = async (file: File) => {
        if (!user || !setUser) return;

        setIsUploading(true);
        toast.loading('Đang tải ảnh lên...', { id: 'upload-avatar' });

        try {
            const fileExtension = file.name.split('.').pop();
            const safeFilename = formatEmailToFilename(user.email);
            const r2Folder = user.role === 'designer' ? 'profiles/designers' : 'profiles/customers';
            const r2Key = `${r2Folder}/${safeFilename}.${fileExtension}`;

            // 1. Gọi function lấy Presigned URL
            const { data: presignedData, error: funcError } = await supabase
                .functions
                .invoke('r2-presigned-upload', {
                    body: JSON.stringify({ fileName: r2Key, contentType: file.type }),
                });
            if (funcError || !presignedData.presignedUrl) {
                throw new Error(`Lỗi lấy Presigned URL: ${funcError?.message || 'Không có URL'}`);
            }

            // 2. Upload file lên R2
            const r2Response = await fetch(presignedData.presignedUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });
            if (!r2Response.ok) throw new Error(`Upload file lên R2 thất bại`);

            const newAvatarUrl = `${R2_PUBLIC_URL}/${r2Key}`;

            // 3. Cập nhật link vào 'profiles'
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: newAvatarUrl })
                .eq('id', user.id);
            if (updateError) throw updateError;

            // 4. Cập nhật state cục bộ và toàn cục
            const updatedProfile = { ...userProfile, img: newAvatarUrl };
            setUserProfile(updatedProfile as AuthUser);
            setUser(updatedProfile as AuthUser); // Cập nhật context

            toast.success("Cập nhật ảnh đại diện thành công!", { id: 'upload-avatar' });

        } catch (err: any) {
            toast.error(`Lỗi upload: ${err.message}`, { id: 'upload-avatar' });
        } finally {
            setIsUploading(false);
        }
    };

    // 5. HIỂN THỊ CÁC TRẠNG THÁI LOADING/ERROR
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 text-green-700 animate-spin" />
                    <p className="text-gray-600 font-medium">Đang tải hồ sơ từ database...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8 px-4 text-center text-red-600 dark:text-red-400">
                Lỗi tải dữ liệu: {error}
            </div>
        );
    }

    if (!user || !userProfile) { // Nếu đã load xong mà không có user/profile
        return (
            <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
                Please log in to see your profile.
            </div>
        );
    }

    // 6. GIAO DIỆN JSX (Giữ nguyên cấu trúc ProfileForm)
    return (
        <div className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <ProfileForm
                    user={userProfile as AuthUser} // TRUYỀN DỮ LIỆU ĐÃ FETCH
                    onUpdate={handleUpdateProfile}
                    onAvatarChange={handleAvatarChange}
                    isSaving={isSaving}
                    isUploading={isUploading}
                />
            </div>
        </div>
    );
};

export default ProfilePage;