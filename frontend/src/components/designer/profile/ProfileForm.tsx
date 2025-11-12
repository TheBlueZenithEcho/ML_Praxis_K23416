import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
// 1. IMPORT 'AuthUser' TỪ FILE TYPES MỚI CỦA BẠN
import type { AuthUser } from '@/types/user.types'; 

interface ProfileFormProps {
  user: AuthUser; // 2. NHẬN PROP 'user'
  onUpdate: (data: Partial<AuthUser>) => Promise<void>;
  onAvatarChange: (file: File) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onUpdate,
  onAvatarChange
}) => {
  // 3. KHỞI TẠO STATE TỪ 'user' (cấu trúc phẳng)
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // 4. LẤY PREVIEW TỪ 'user.img'
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.img);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    try {
      await onAvatarChange(file);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 5. GỬI LẠI ĐỐI TƯỢNG ĐÃ THAY ĐỔI
      await onUpdate({
        name: name,
        phone: phone,
        // (Lưu ý: avatar đã được cập nhật riêng)
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // 6. RESET VỀ 'user' GỐC
    setName(user.name);
    setPhone(user.phone);
    setAvatarPreview(user.img);
    setIsEditing(false);
  };

  return (
    // 7. SỬA LẠI COMPONENT (Thêm Dark Mode)
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <form onSubmit={handleSubmit}>
        {/* Header (Thêm Dark Mode) */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Avatar Section (Thêm Dark Mode) */}
        <div className="flex items-start gap-8 mb-8 pb-8 border-b dark:border-gray-700">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400 dark:text-gray-500">
                  {/* 8. SỬA LẠI TÊN VIẾT TẮT (dùng 'name') */}
                  {user.name?.[0]}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#2B7516] text-white p-2 rounded-full cursor-pointer hover:bg-[#1f5510] transition-colors">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            {/* 9. SỬA LẠI HIỂN THỊ TÊN VÀ EMAIL */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {user.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
            {/* 10. XÓA BỎ 'yearsOfExperience' VÀ 'specialties' */}
          </div>
        </div>

        {/* Form Fields (Thêm Dark Mode) */}
        <div className="space-y-6">
          
          {/* 11. SỬA 'First Name', 'Last Name' THÀNH 'Full Name' */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
            />
          </div>
          
          {/* 12. XÓA 'Display Name' */}

          {/* Phone (Thêm Dark Mode) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={phone || ''}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              placeholder="+84 xxx xxx xxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
            />
          </div>

          {/* 13. XÓA 'Bio', 'Years of Experience', 'Specialties' */}
          
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;