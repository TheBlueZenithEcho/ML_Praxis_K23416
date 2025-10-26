import React, { useState, useEffect, useRef } from 'react'; // SỬA 1: Thêm useRef
import { useParams, useNavigate } from 'react-router'; 
import { TextField, Button, Avatar, CircularProgress, InputAdornment, Chip } from '@mui/material'; 
import EmailIcon from '@mui/icons-material/Email'; 
import PhoneIcon from '@mui/icons-material/Phone'; 
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; 
import PersonIcon from '@mui/icons-material/Person'; 
import DesignServicesIcon from '@mui/icons-material/DesignServices'; 

// --- API URLs ---
const MOCK_API_GET_LIST_URL = 'https://api.npoint.io/4a915d88732882680a44'; 
// const REAL_API_BASE_URL = 'https://api-backend-that.cuaban.com'; 
// const REAL_API_USER_ENDPOINT = `${REAL_API_BASE_URL}/users`; 
// SỬA 2: Thêm URL API thật cho việc upload ảnh
// const REAL_API_UPLOAD_ENDPOINT = `${REAL_API_BASE_URL}/upload/avatar`; // Ví dụ

// Kiểu dữ liệu (có role)
type UserProfile = {
  id: string | number; name: string; email: string; phone: string; img: string; createdAt: string; 
  role: 'user' | 'designer' | 'admin'; 
};

const AvatarProfile = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  
  // SỬA 3: Thêm state cho file ảnh và URL xem trước
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref cho input file

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
        // Sửa lỗi so sánh ID
        const foundUser = userList.find(u => Number(u.id) === userIdNumber); 
        if (foundUser) {
            setUser(foundUser);
            setPreviewUrl(foundUser.img); // Khởi tạo preview với ảnh hiện tại
        } else { 
            setError(`User not found: ${id}`); setUser(null); 
        }
      } catch (err) { /* ... */ } 
      finally { setLoading(false); }
    };
    fetchUser(); 
  }, [id]); 

  // Xử lý thay đổi form (giữ nguyên)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) setUser({ ...user, [e.target.name]: e.target.value });
  };

  // --- SỬA 4: HÀM XỬ LÝ KHI CHỌN FILE ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setSelectedFile(file); // Lưu file đã chọn
          // Tạo URL xem trước
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewUrl(reader.result as string); // Cập nhật ảnh xem trước
          };
          reader.readAsDataURL(file);
      } else {
          // Nếu hủy chọn file, quay lại ảnh gốc (nếu có)
          setSelectedFile(null);
          setPreviewUrl(user?.img || null);
      }
  };

  // --- SỬA 5: HÀM TRIGGER INPUT FILE ---
  const handleUploadButtonClick = () => {
      fileInputRef.current?.click(); // Mở cửa sổ chọn file
  };

  // --- SỬA 6: HÀM UPLOAD FILE LÊN SERVER THẬT ---
  const handleUploadConfirm = async () => {
      if (!selectedFile || !user) {
          alert("Vui lòng chọn ảnh trước.");
          return;
      }

      // --- Chọn logic API ---
      const useRealApi = false; // Đặt là true khi muốn dùng API thật
      // ----------------------

      if (useRealApi) {
          // (2) Code thật (hiện đang comment)
          /* if (!REAL_API_UPLOAD_ENDPOINT) {
              alert("Lỗi: URL API Upload thật chưa được cấu hình.");
              return;
          }
          
          const formData = new FormData();
          formData.append('avatar', selectedFile); // 'avatar' là key backend mong đợi
          // Có thể thêm user ID nếu backend cần: formData.append('userId', String(user.id));

          setLoading(true); // Bắt đầu loading upload
          try {
              console.log("Đang gửi POST request (upload ảnh) đến:", REAL_API_UPLOAD_ENDPOINT);
              const response = await fetch(REAL_API_UPLOAD_ENDPOINT, {
                  method: 'POST',
                  // KHÔNG cần 'Content-Type', trình duyệt tự đặt cho FormData
                  // headers: { 'Authorization': `Bearer ${your_auth_token}` }, // Thêm Auth nếu cần
                  body: formData,
              });

              if (response.ok) {
                  const result = await response.json();
                  const newImageUrl = result.imageUrl; // Lấy URL ảnh mới từ server
                  
                  // Cập nhật lại state user với URL ảnh mới (quan trọng)
                  setUser({ ...user, img: newImageUrl }); 
                  setPreviewUrl(newImageUrl); // Cập nhật cả preview
                  setSelectedFile(null); // Reset file đã chọn
                  
                  alert("Upload ảnh thành công!");
                  
                  // Optional: Gọi thêm API PUT /users/:id để lưu newImageUrl vào DB user
                  // await fetch(`${REAL_API_USER_ENDPOINT}/${id}`, { method: 'PUT', ... body: { img: newImageUrl }});

              } else {
                  const errorData = await response.text();
                  alert(`Upload ảnh thất bại: ${response.status} ${errorData || response.statusText}`);
              }
          } catch (error) {
              console.error("Lỗi khi upload ảnh:", error);
              alert("Lỗi kết nối khi upload ảnh.");
          } finally {
              setLoading(false); // Kết thúc loading upload
          }
          */
          alert("API Upload thật đang bị comment. Vui lòng bỏ comment code API thật trong AvatarProfile.tsx");
      } else {
          // (1) Giả lập (đang dùng)
          alert("Lưu ý: API giả lập không hỗ trợ upload file.");
          console.log("File (giả lập) sẽ được upload:", selectedFile.name);
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Chờ 2 giây
          setLoading(false);
          alert("Giả lập upload thành công! (Ảnh chỉ cập nhật tạm thời)");
          // Trong giả lập, giữ nguyên previewUrl, không reset selectedFile
          // setUser({ ...user, img: previewUrl || user.img }); // Cập nhật user state với preview
      }
  };


  // --- UPDATE THÔNG TIN USER (handleSubmit) --- (Giữ nguyên logic phân biệt API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return;
    const useRealApi = false; 
    if (useRealApi) { /* ... code API thật ... */ alert("API thật đang bị comment."); } 
    else { /* ... code giả lập ... */ 
      alert("Mock API update simulation."); setLoading(true); 
      await new Promise(r => setTimeout(r, 1000)); setLoading(false); 
      alert("Mock update success!"); 
    }
  };
  
  // --- DELETE USER --- (Giữ nguyên logic phân biệt API)
  const handleDeleteUser = async () => {
    // ... (Giữ nguyên code handleDeleteUser) ...
    if (!user) return;
    if (window.confirm(`Delete ${user.role} "${user.name}"?`)) {
        const useRealApi = false; 
        if (useRealApi) { /* ... code API thật ... */ alert("API thật đang bị comment."); }
        else { /* ... code giả lập ... */
            alert("Mock API delete simulation."); setLoading(true);
            await new Promise(r => setTimeout(r, 1000)); setLoading(false);
            alert("Mock delete success!");
            if (user.role === 'designer') navigate('/admin_designers');
            else navigate('/admin_users');
        }
    }
  };
  
  // --- DELETE PHOTO --- (Chỉnh sửa để reset preview)
  const handleDeletePhoto = () => { 
      // Gọi API thật để xóa ảnh trên server (nếu có)
      // Sau đó hoặc ngay lập tức reset ảnh về mặc định/trống
      if(window.confirm("Xóa ảnh đại diện? (Giả lập)")) {
          setPreviewUrl(null); // Xóa ảnh xem trước
          setSelectedFile(null); // Xóa file đã chọn nếu có
          if(user) setUser({...user, img: ''}); // Cập nhật state (đặt img thành rỗng)
          alert("Giả lập xóa ảnh thành công! Nhấn 'Save Changes' để lưu (nếu có API thật).");
      }
  };

  // Loading/Error/Not Found states (giữ nguyên)
  if (loading && !user) return <div className="center-screen"><CircularProgress /></div>; 
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!user) return <div className="p-8 text-orange-500 text-center">User ID not found: {id}</div>;

  // Hàm lấy Chip Role (giữ nguyên)
  const getRoleChip = (role: 'user' | 'designer' | 'admin') => { /* ... */ 
      switch (role) {
          case 'admin': return <Chip icon={<AdminPanelSettingsIcon />} label="Admin" color="error" size="small" />;
          case 'designer': return <Chip icon={<DesignServicesIcon />} label="Designer" color="primary" size="small" />;
          default: return <Chip icon={<PersonIcon />} label="User" color="success" size="small" />;
      }
  };

  // --- RETURN JSX ---
  return (
    <div className="p-6 md:p-10 bg-[#fcfcfc] min-h-screen"> 
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
          {/* SỬA 7: Hiển thị ảnh xem trước (previewUrl) */}
          <Avatar src={previewUrl || undefined} sx={{ width: 100, height: 100 }} /> 
          
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <div className="mt-1">{getRoleChip(user.role)}</div>
            <p className="text-sm text-gray-500 mt-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
             {/* SỬA 8: Nút Upload trigger input ẩn */}
             <Button variant="contained" sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }} onClick={handleUploadButtonClick} disabled={loading}>
                 {selectedFile ? 'Change Photo' : 'Upload New Photo'} 
             </Button>
             {/* SỬA 9: Input file ẩn */}
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" // Chỉ chấp nhận file ảnh
                style={{ display: 'none' }} 
             />
             {/* Nút Delete Photo */}
             <Button variant="outlined" color="error" onClick={handleDeletePhoto} disabled={loading}>Delete Photo</Button>
           </div>
        </div>

        {/* --- SỬA 10: Nút xác nhận Upload (nếu đã chọn ảnh) --- */}
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
        {/* ----------------------------------------------- */}

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