import React, { useState, useEffect, useRef } from 'react';
// SỬA 1: Đổi 'react-router' thành 'react-router-dom' và thêm các import cần thiết
import { useParams, useNavigate, useLocation, Navigate } from 'react-router'; 
import { TextField, Button, Avatar, CircularProgress, InputAdornment, Chip } from '@mui/material'; 
import EmailIcon from '@mui/icons-material/Email'; 
import PhoneIcon from '@mui/icons-material/Phone'; 
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; 
import PersonIcon from '@mui/icons-material/Person'; 
import DesignServicesIcon from '@mui/icons-material/DesignServices'; 
// SỬA 2: Thêm import useAuth từ context
import { useAuth } from '@/context/AuthContext';

// --- API URLs ---
const MOCK_API_GET_LIST_URL = 'https://api.npoint.io/4a915d88732882680a44'; 
// const REAL_API_BASE_URL = 'https://api-backend-that.cuaban.com'; 
// const REAL_API_USER_ENDPOINT = `${REAL_API_BASE_URL}/users`; 
// const REAL_API_UPLOAD_ENDPOINT = `${REAL_API_BASE_URL}/upload/avatar`; // Ví dụ

// Kiểu dữ liệu (có role)
type UserProfile = {
  id: string | number; name: string; email: string; phone: string; img: string; createdAt: string; 
  role: 'user' | 'designer' | 'admin'; 
};

const AvatarProfile = () => {
  // SỬA 3: Thêm logic bảo vệ route ngay tại đây
  const { user: currentUser } = useAuth(); // Lấy admin đang đăng nhập
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const navigate = useNavigate();

  const isViewingAdminProfile = location.pathname.startsWith('/admin/');
  const profileIdAsNumber = Number(id);

  // Nếu người dùng là admin VÀ đang xem trang /admin/ CỦA NGƯỜI KHÁC
  if (currentUser && currentUser.role === 'admin' && isViewingAdminProfile && currentUser.id !== profileIdAsNumber) {
    // Chuyển hướng họ về trang profile của chính họ
    return <Navigate to={`/admin/${currentUser.id}`} replace />;
  }
  // --- KẾT THÚC LOGIC BẢO VỆ ---


  // State của component (giữ nguyên)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 

  // --- READ --- (Giữ nguyên logic fetch)
  useEffect(() => {
    const fetchUser = async () => {
       if (!id) { setError("ID missing."); setLoading(false); return; }
      try {
        setLoading(true); setError(null);
        const response = await fetch(MOCK_API_GET_LIST_URL); 
        if (!response.ok) throw new Error('Cannot load user list');
        const userList: UserProfile[] = await response.json(); 
        const userIdNumber = parseInt(id, 10);
        
        const foundUser = userList.find(u => Number(u.id) === userIdNumber); 
        if (foundUser) {
            setUser(foundUser);
            setPreviewUrl(foundUser.img); 
        } else { 
            setError(`User not found: ${id}`); setUser(null); 
        }
      } catch (err: any) { 
          console.error("Lỗi khi fetch user:", err);
          setError(err.message || 'Lỗi không xác định');
      } 
      finally { setLoading(false); }
    };
    fetchUser();      
  }, [id]); 

  // Xử lý thay đổi form (giữ nguyên)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) setUser({ ...user, [e.target.name]: e.target.value });
  };

  // --- HÀM XỬ LÝ KHI CHỌN FILE ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setSelectedFile(file); 
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewUrl(reader.result as string); 
          };
          reader.readAsDataURL(file);
      } else {
          setSelectedFile(null);
          setPreviewUrl(user?.img || null);
      }
  };

  // --- HÀM TRIGGER INPUT FILE ---
  const handleUploadButtonClick = () => {
      fileInputRef.current?.click(); 
  };

  // --- HÀM UPLOAD FILE LÊN SERVER THẬT ---
  const handleUploadConfirm = async () => {
      if (!selectedFile || !user) {
          alert("Vui lòng chọn ảnh trước.");
          return;
      }
      const useRealApi = false; 

      if (useRealApi) {
          /* ... (code API thật) ... */
          alert("API Upload thật đang bị comment. Vui lòng bỏ comment code API thật trong AvatarProfile.tsx");
      } else {
          // (1) Giả lập (đang dùng)
          alert("Lưu ý: API giả lập không hỗ trợ upload file.");
          console.log("File (giả lập) sẽ được upload:", selectedFile.name);
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 2000)); 
          setLoading(false);
          alert("Giả lập upload thành công! (Ảnh chỉ cập nhật tạm thời)");
      }
  };


  // --- UPDATE THÔNG TIN USER (handleSubmit) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return;
    const useRealApi = false; 
    if (useRealApi) { /* ... code API thật ... */ alert("API thật đang bị comment."); } 
    else { 
      alert("Mock API update simulation."); setLoading(true); 
      await new Promise(r => setTimeout(r, 1000)); setLoading(false); 
      alert("Mock update success!"); 
    }
  };
  
  // --- DELETE USER ---
  const handleDeleteUser = async () => {
    if (!user) return;
    if (window.confirm(`Delete ${user.role} "${user.name}"?`)) {
        const useRealApi = false; 
        if (useRealApi) { /* ... code API thật ... */ alert("API thật đang bị comment."); }
        else { 
            alert("Mock API delete simulation."); setLoading(true);
            await new Promise(r => setTimeout(r, 1000)); setLoading(false);
            alert("Mock delete success!");
            if (user.role === 'designer') navigate('/admin_designers');
            else navigate('/admin_users');
        }
    }
  };
  
  // --- DELETE PHOTO ---
  const handleDeletePhoto = () => { 
      if(window.confirm("Xóa ảnh đại diện? (Giả lập)")) {
          setPreviewUrl(null); 
          setSelectedFile(null); 
          if(user) setUser({...user, img: ''}); 
          alert("Giả lập xóa ảnh thành công! Nhấn 'Save Changes' để lưu (nếu có API thật).");
      }
  };

  // Loading/Error/Not Found states (giữ nguyên)
  if (loading && !user) return <div className="center-screen"><CircularProgress /></div>; 
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  // Sửa: Nếu không có user (sau khi logic bảo vệ chạy xong) thì không cần hiển thị "Not Found"
  // vì logic bảo vệ đã xử lý. Chỉ hiển thị "Not Found" nếu fetch thật sự thất bại.
  if (!user && !loading) return <div className="p-8 text-orange-500 text-center">User ID not found: {id}</div>;
  // Nếu user chưa kịp load (hoặc đang chuyển hướng) thì không render gì
  if (!user) return null; 

  // Hàm lấy Chip Role (giữ nguyên)
  const getRoleChip = (role: 'user' | 'designer' | 'admin') => {
      switch (role) {
          case 'admin': return <Chip icon={<AdminPanelSettingsIcon />} label="Admin" color="error" size="small" />;
          case 'designer': return <Chip icon={<DesignServicesIcon />} label="Designer" color="primary" size="small" />;
          default: return <Chip icon={<PersonIcon />} label="User" color="success" size="small" />;
      }
  };

  // --- RETURN JSX ---
  return (
    <div className="p-6 md:p-10 bg-[#FFFFFF]"> 
      {/* Header và Chip Role */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Profile</h1> 
        {getRoleChip(user.role)} 
      </div>
      {/* Loading indicator nhỏ */}
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>} 

      <div className="bg-white p-6 rounded-lg shadow-md"> 
        {/* Phần Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-6">
          <Avatar src={previewUrl || undefined} sx={{ width: 100, height: 100 }} /> 
          
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <div className="mt-1">{getRoleChip(user.role)}</div>
            <p className="text-sm text-gray-500 mt-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
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
        </div>

        {/* Nút xác nhận Upload (nếu đã chọn ảnh) */}
        {selectedFile && (
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

        {/* Phần Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Các trường TextField (giữ nguyên) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TextField label="Full Name" name="name" value={user.name} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
             <TextField label="User ID" value={user.id} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Email Address" name="email" type="email" value={user.email} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>), }} disabled={loading}/>
            <TextField label="Phone Number" name="phone" value={user.phone} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>), }} disabled={loading}/>
          </div>
          {/* Buttons Save/Delete */}
          <div className="flex justify-end gap-4 pt-4">
             <Button variant="contained" color="primary" type="submit" disabled={loading}>
                 {loading ? 'Saving...' : 'Save Changes'}
             </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteUser} disabled={loading}>
                  Delete User
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSS (giữ nguyên)
const styles = `
.center-screen { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AvatarProfile;