import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Avatar, CircularProgress, InputAdornment, Chip, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient'; // Đảm bảo đường dẫn đúng

// Interface này PHẢI KHỚP với RPC 'get_profile_by_id'
type UserProfile = {
  id: string; // UUID
  name: string | null;
  email: string;
  phone: string | null;
  img: string | null;
  createdAt: string;
  role: 'user' | 'designer' | 'admin' | string; // (string để an toàn)
};

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-your-public-url.r2.dev';

// (Hàm tiện ích format tên file, copy từ Ad_DesignerNew)
const formatEmailToFilename = (email: string) => {
  return email.replace(/@/g, '_at_').replace(/\./g, '_');
};


const AvatarProfile = () => {
  const { user: currentUser } = useAuth(); // Lấy admin/user đang đăng nhập
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const navigate = useNavigate();

  // State của component
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) { setError("ID người dùng bị thiếu trong URL."); setLoading(false); return; }

      try {
        setLoading(true);
        setError(null);

        // Gọi RPC 'get_profile_by_id' 
        const { data: profileArray, error: rpcError } = await supabase
          .rpc('get_profile_by_id', {
            profile_id: id // Truyền ID từ URL vào
          });

        if (rpcError) throw rpcError; // Ném lỗi nếu RPC thất bại

        const foundUser = profileArray ? profileArray[0] as UserProfile : null;

        if (foundUser) {
          setUser(foundUser);
          setPreviewUrl(foundUser.img); // Set ảnh preview ban đầu
        } else {
          // RLS đã chặn (nếu bạn không phải admin VÀ không xem chính mình)
          // Hoặc ID không tồn tại
          setError(`Không tìm thấy hoặc không có quyền xem hồ sơ: ${id}`);
          setUser(null);
        }
      } catch (err: any) {
        console.error("Lỗi khi fetch user:", err);
        setError(err.message || 'Lỗi không xác định');
      }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [id]); // Chạy lại khi ID trên URL thay đổi

  // Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUser?.role === 'admin' || currentUser?.id === user?.id) {
      if (user) setUser({ ...user, [e.target.name]: e.target.value });
    } else {
      alert("Bạn không có quyền chỉnh sửa hồ sơ này.");
    }
  };

  // Xử lý khi chọn file (Giữ nguyên)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(user?.img || null);
    }
  };

  const handleUploadButtonClick = () => { fileInputRef.current?.click(); };

  const handleUploadConfirm = async () => {
    if (!selectedFile || !user) {
      alert("Vui lòng chọn ảnh trước.");
      return;
    }
    setLoading(true);
    try {
      // 7.1: Format tên file
      const fileExtension = selectedFile.name.split('.').pop();
      const safeFilename = formatEmailToFilename(user.email); // Dùng email của user đang xem

      // (Quyết định folder dựa trên role)
      const r2Folder = user.role === 'designer' ? 'profiles/designers' : 'profiles/customers';
      const r2Key = `${r2Folder}/${safeFilename}.${fileExtension}`;

      // 7.2: Gọi Edge Function
      const { data: presignedData, error: funcError } = await supabase
        .functions
        .invoke('r2-presigned-upload', {
          body: JSON.stringify({ fileName: r2Key, contentType: selectedFile.type }),
        });

      if (funcError || !presignedData.presignedUrl) {
        throw new Error(`Lỗi lấy Presigned URL: ${funcError?.message || 'Không có URL'}`);
      }

      // 7.3: Upload lên R2
      const r2Response = await fetch(presignedData.presignedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: { 'Content-Type': selectedFile.type },
      });
      if (!r2Response.ok) throw new Error(`Upload file lên R2 thất bại`);

      const newAvatarUrl = `${R2_PUBLIC_URL}/${r2Key}`;

      // 7.4: Cập nhật CSDL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 7.5: Cập nhật UI
      setUser(prev => prev ? ({ ...prev, img: newAvatarUrl }) : null);
      setPreviewUrl(newAvatarUrl);
      setSelectedFile(null);
      alert("Cập nhật ảnh đại diện thành công!");

    } catch (err: any) {
      console.error("Lỗi upload ảnh:", err);
      alert(`Lỗi upload: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Chỉ update 'name' và 'phone' (vì email/role là việc phức tạp hơn)
      // (Giả sử RLS cho phép admin / chủ sở hữu update 'profiles')
      const { error } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          phone: user.phone
        })
        .eq('id', user.id); // Update đúng user ID

      if (error) throw error;

      alert("Cập nhật hồ sơ thành công!");

    } catch (err: any) {
      console.error("Lỗi khi cập nhật user:", err);
      alert(`Lỗi cập nhật: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    if (window.confirm(`XÁC NHẬN XÓA vĩnh viễn ${user.role} "${user.name}"?`)) {
      setLoading(true);
      try {
        // Gọi RPC 'delete_user_as_admin'
        const { error } = await supabase.rpc('delete_user_as_admin', {
          user_id_to_delete: user.id
        });

        if (error) throw error; // Lỗi nếu người gọi không phải Admin

        alert("Xóa người dùng thành công!");

        // Điều hướng dựa trên role của người BỊ XÓA
        if (user.role === 'designer') navigate('/admin_designers');
        else navigate('/admin_users');

      } catch (err: any) {
        console.error("Lỗi khi xóa user:", err);
        alert(`Lỗi xóa: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (!user) return;
    if (window.confirm("Xóa ảnh đại diện?")) {
      setLoading(true);
      try {
        // Cập nhật CSDL, set avatar_url = null
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', user.id);

        if (error) throw error;

        // Cập nhật UI
        setPreviewUrl(null);
        setSelectedFile(null);
        if (user) setUser({ ...user, img: null });
        alert("Đã xóa ảnh đại diện!");

        // (Bạn có thể thêm 1 Edge Function để xóa file thật trên R2 nếu muốn)

      } catch (err: any) {
        console.error("Lỗi khi xóa ảnh:", err);
        alert(`Lỗi xóa ảnh: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Loading/Error/Not Found states
  if (loading && !user) return <div className="center-screen"><CircularProgress /></div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!user) return <div className="p-8 text-orange-500 text-center">Không tìm thấy hồ sơ người dùng (ID: {id})</div>;

  // Hàm lấy Chip Role
  const getRoleChip = (role: string) => {
    switch (role) {
      case 'admin': return <Chip icon={<AdminPanelSettingsIcon />} label="Admin" color="error" size="small" />;
      case 'designer': return <Chip icon={<DesignServicesIcon />} label="Designer" color="primary" size="small" />;
      default: return <Chip icon={<PersonIcon />} label="User" color="success" size="small" />;
    }
  };

  // --- RETURN JSX (Đã thêm logic ẩn/hiện nút) ---
  // Quyết định xem người dùng hiện tại có quyền sửa/xóa profile này không
  const canEdit = currentUser?.role === 'admin' || currentUser?.id === user.id;

  return (
    <div className="p-6 md:p-10 bg-[#FFFFFF]">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Profile</h1>
        {getRoleChip(user.role)}
      </div>
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-6">
          <Avatar src={previewUrl || undefined} sx={{ width: 100, height: 100 }} />

          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <div className="mt-1">{getRoleChip(user.role)}</div>
            <p className="text-sm text-gray-500 mt-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Chỉ hiển thị nút Upload/Delete nếu có quyền Sửa */}
          {canEdit && (
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Button variant="contained" sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }} onClick={handleUploadButtonClick} disabled={loading}>
                {selectedFile ? 'Change Photo' : 'Upload New Photo'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button variant="outlined" color="error" onClick={handleDeletePhoto} disabled={loading}>Delete Photo</Button>
            </div>
          )}
        </div>

        {selectedFile && canEdit && (
          <div className="mb-6 flex justify-center md:justify-start">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUploadConfirm}
              disabled={loading}
              size="small"
            >
              Confirm Upload: {selectedFile.name}
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Full Name" name="name" value={user.name || ''} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading || !canEdit} />
            <TextField label="User ID" value={user.id} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Email Address" name="email" type="email" value={user.email} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>), }}
              disabled // --- Không bao giờ cho sửa email ở đây
            />
            <TextField label="Phone Number" name="phone" value={user.phone || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>), }} disabled={loading || !canEdit} />
          </div>

          {/* Chỉ hiển thị nút Save/Delete nếu có quyền */}
          {canEdit && (
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>

              {/* Chỉ Admin mới thấy nút Xóa User */}
              {currentUser?.role === 'admin' && (
                <Button variant="outlined" color="error" onClick={handleDeleteUser} disabled={loading}>
                  Delete User
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// CSS
const styles = `
.center-screen { display: flex; justify-content: center; align-items: center; min-h: 80vh; }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AvatarProfile;