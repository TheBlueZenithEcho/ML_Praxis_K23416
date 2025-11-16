import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Avatar, CircularProgress } from '@mui/material';

// --- (1) IMPORT CHÍNH ---
import { supabase } from '../../lib/supabaseClient';
// ⭐️ SỬA 1: Import thêm createClient
import { createClient } from '@supabase/supabase-js';

// --- (2) CHÚ Ý: ĐIỀN PUBLIC URL CỦA R2 VÀO ĐÂY ---
const R2_PUBLIC_URL = 'https://pub-015964f37f3f4529a8e04997ed43d343.r2.dev'; // !!! THAY BẰNG URL PUBLIC CỦA BẠN !!!

// Kiểu dữ liệu (giữ nguyên)
type NewDesignerData = {
  name: string;
  email: string;
  phone: string;
  img: string;
  role: 'designer';
};

// --- (3) HÀM TIỆN ÍCH (GIỮ NGUYÊN) ---
const formatEmailToFilename = (email: string) => {
  return email.replace(/@/g, '_at_').replace(/\./g, '_');
};

const Ad_DesignerNew = () => {
  const navigate = useNavigate();
  // ... (Tất cả state giữ nguyên) ...
  const [formData, setFormData] = useState<NewDesignerData>({
    name: '', email: '', phone: '', img: '', role: 'designer'
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... (Tất cả handle change giữ nguyên) ...
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };
  const handleUploadButtonClick = () => fileInputRef.current?.click();

  // --- (4) LOGIC SUBMIT ĐÃ SỬA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !password || !formData.name) {
      alert("Vui lòng điền Email, Mật khẩu và Tên.");
      setLoading(false);
      return;
    }

    try {
      // --- BƯỚC 1: LẤY ROLE_ID (Dùng client admin 'supabase') ---
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('role_name', 'designer')
        .single();

      if (roleError || !roleData) {
        throw new Error("Lỗi hệ thống: Không tìm thấy vai trò 'designer'.");
      }
      const designerRoleId = roleData.id;

      // --- ⭐️ SỬA 2: TẠO CLIENT TẠM THỜI (TEMP CLIENT) ---
      // Client này được cấu hình KHÔNG lưu session,
      // nó sẽ không ghi đè session của admin trong localStorage.
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          // Rất quan trọng: Không tự động lưu session
          persistSession: false,
          // Tắt luôn auto-refresh (không cần thiết)
          autoRefreshToken: false
        }
      });

      // --- BƯỚC 2: TẠO AUTH USER (Dùng client TẠM THỜI) ---
      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: { name: formData.name }
        }
      });

      // Lỗi (nếu có) sẽ bị 'throw'
      if (authError) throw authError;
      if (!authData.user) throw new Error("Không thể tạo tài khoản Auth (User).");

      // Session của admin vẫn AN TOÀN!
      const newUserId = authData.user.id;

      // --- BƯỚC 3: XỬ LÝ UPLOAD ẢNH (Dùng client admin 'supabase') ---
      let avatarUrlToSet = formData.img;

      if (selectedFile) {
        console.log("Đang chuẩn bị upload lên R2...");

        const fileExtension = selectedFile.name.split('.').pop();
        const safeFilename = formatEmailToFilename(formData.email);
        const r2Key = `profiles/designers/${safeFilename}.${fileExtension}`;

        // 3.2: Gọi Edge Function (Dùng client 'supabase' của admin)
        const { data: presignedData, error: funcError } = await supabase
          .functions
          .invoke('r2-presigned-upload', {
            body: JSON.stringify({
              fileName: r2Key,
              contentType: selectedFile.type,
            }),
          });

        if (funcError || !presignedData.presignedUrl) {
          throw new Error(`Lỗi lấy Presigned URL: ${funcError?.message || 'Không có URL'}`);
        }

        const { presignedUrl } = presignedData;

        // 3.3: Upload file (Giữ nguyên)
        const r2Response = await fetch(presignedUrl, {
          method: 'PUT',
          body: selectedFile,
          headers: {
            'Content-Type': selectedFile.type,
          },
        });

        if (!r2Response.ok) {
          throw new Error(`Upload file lên R2 thất bại: ${r2Response.statusText}`);
        }

        avatarUrlToSet = `${R2_PUBLIC_URL}/${r2Key}`;
      }

      // --- BƯỚC 4: TẠO PROFILE (Dùng client admin 'supabase') ---
      // Vì 'supabase' vẫn là admin, RLS sẽ pass
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          role_id: designerRoleId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email, // ⭐️ Nên thêm email vào profile
          avatar_url: avatarUrlToSet,
          status: 'active'
        });

      if (profileError) {
        // Nếu lỗi ở đây, bạn có thể cần xóa auth.user đã tạo
        // (Tuy nhiên, tạm thời chỉ báo lỗi)
        throw new Error(`Lỗi tạo Profile (RLS?): ${profileError.message}`);
      }

      // --- HOÀN TẤT ---
      alert(`Tạo người dùng ${formData.role} mới thành công!`);
      navigate('/admin_designers'); // Admin vẫn ở trang admin

    } catch (error: any) {
      console.error("Lỗi khi tạo designer:", error);
      alert(`Tạo designer thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- GIAO DIỆN (GIỮ NGUYÊN) ---
  return (
    <div className='Ad_DesignerNew p-6 md:p-10 bg-[#fcfcfc] min-h-screen'>
      {/* (Toàn bộ JSX giữ nguyên y hệt, không cần thay đổi) */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Add New Designer</h1>
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col items-center gap-4 border-b pb-6">
          <Avatar
            src={previewUrl || undefined}
            sx={{ width: 120, height: 120, mb: 2, bgcolor: '#e0e0e0' }}
            variant="rounded"
          >
            {!previewUrl && <span className="text-gray-500">Photo</span>}
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            onClick={handleUploadButtonClick}
            disabled={loading}
            size="small"
          >
            {selectedFile ? `Đổi ảnh: ${selectedFile.name.substring(0, 20)}...` : 'CHOOSE IMAGE FROM COMPUTER'}
          </Button>
          <TextField
            label="Or Enter Image URL"
            name="img"
            value={formData.img}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            disabled={loading || !!selectedFile}
            helperText={selectedFile ? "Đang sử dụng file ảnh đã chọn ở trên" : "Nhập link trực tiếp đến ảnh"}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            helperText="Mật khẩu cho người dùng mới"
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            fullWidth
            disabled
            variant="filled"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Đang tạo...' : 'Tạo Designer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Ad_DesignerNew;