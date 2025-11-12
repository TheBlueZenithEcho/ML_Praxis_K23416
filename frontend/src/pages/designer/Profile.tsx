import React, { useState } from 'react';
// 1. IMPORT 'useAuth' ĐỂ LẤY USER TỪ CONTEXT
import { useAuth } from '@/context/AuthContext'; 
// 2. IMPORT 'AuthUser' TỪ FILE TYPES MỚI CỦA BẠN
import type { AuthUser } from '@/types/user.types'; 
import ProfileForm from '@/components/designer/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  // 3. LẤY USER VÀ HÀM SETUSER TỪ CONTEXT
  // (Giả sử AuthContext của bạn cung cấp hàm setUser)
  const { user, setUser } = useAuth(); 

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 4. XÓA BỎ HOÀN TOÀN 'useEffect' (fetch), 'isLoading', 'error'

  // Hàm này được gọi bởi ProfileForm khi user lưu thay đổi
  const handleUpdateProfile = async (updatedData: Partial<AuthUser>) => {
    if (!user) return;
    
    // Tạo user mới với dữ liệu đã cập nhật
    const updatedUser = { ...user, ...updatedData };

    // TODO: Gọi API (PUT/PATCH) để cập nhật user trên server
    // Ví dụ: await api.updateUser(user.id, updatedData);
    console.log('Updating user:', updatedUser);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 5. CẬP NHẬT USER TRONG AUTH CONTEXT (STATE TOÀN CỤC)
    if(setUser) {
      setUser(updatedUser);
    }

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Hàm này được gọi bởi ProfileForm khi user đổi avatar
  const handleAvatarChange = async (file: File) => {
    if (!user || !setUser) return;
    
    // TODO: Upload avatar lên server và lấy URL mới
    console.log('Uploading avatar:', file);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const previewUrl = URL.createObjectURL(file); // (Đây chỉ là link tạm thời)

    // 6. CẬP NHẬT USER TRONG AUTH CONTEXT
    setUser({
      ...user,
      img: previewUrl // Cập nhật ảnh đại diện mới
    });
  };

  // 7. THÊM KIỂM TRA NẾU USER CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        Please log in to see your profile.
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top">
          ✓ Profile updated successfully!
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* 8. XÓA BỎ HOÀN TOÀN "Statistics Cards"
            (Vì 'designer.statistics' không tồn tại trong JSON mới)
        */}
        
        {/* Profile Form (Truyền 'user' thay vì 'designer') */}
        <ProfileForm
          user={user as AuthUser} // Truyền user từ context
          onUpdate={handleUpdateProfile}
          onAvatarChange={handleAvatarChange}
        />

        {/* 9. XÓA BỎ HOÀN TOÀN "Performance Metrics"
            (Vì 'designer.statistics' không tồn tại trong JSON mới)
        */}

      </div> 
    </div>
  );
};

export default ProfilePage;