import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Avatar, CircularProgress } from '@mui/material';

// --- (1) IMPORT SUPABASE CLIENT ---
import { supabase } from '../../lib/supabaseClient';

// --- (2) CHÚ Ý: ĐIỀN PUBLIC URL CỦA R2 VÀO ĐÂY ---
// Đây là URL công khai của R2 Bucket (đã setup ở Giai đoạn 3 của file setup_cloudflare_r2.md)
// Nó KHÁC với R2_ENDPOINT.
const R2_PUBLIC_URL = 'https://pub-015964f37f3f4529a8e04997ed43d343.r2.dev'; // !!! THAY BẰNG URL PUBLIC CỦA BẠN !!!

// Kiểu dữ liệu cho form
type NewDesignerData = {
  name: string;
  email: string;
  phone: string;
  img: string; // Dùng cho URL nhập tay
  role: 'designer';
};

// --- (3) HÀM TIỆN ÍCH ĐỂ FORMAT TÊN FILE ---
/**
 * Chuyển email thành tên file an toàn.
 * "manning@gmail.com" -> "manning_at_gmail_com"
 */
const formatEmailToFilename = (email: string) => {
  return email.replace(/@/g, '_at_').replace(/\./g, '_');
};

const Ad_DesignerNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewDesignerData>({
    name: '', email: '', phone: '', img: '', role: 'designer'
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- (4) LOGIC SUBMIT ĐÃ VIẾT LẠI HOÀN TOÀN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !password || !formData.name) {
        alert("Vui lòng điền Email, Mật khẩu và Tên.");
        setLoading(false);
        return;
    }

    try {
        // --- BƯỚC 1: LẤY ROLE_ID CỦA 'designer' ---
        const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('role_name', 'designer')
            .single();

        if (roleError || !roleData) {
            throw new Error("Lỗi hệ thống: Không tìm thấy vai trò 'designer'.");
        }
        const designerRoleId = roleData.id;

        // --- BƯỚC 2: TẠO AUTH USER MỚI ---
        // (Giả sử bạn đang dùng RLS Policy "Allow admins to create any profile")
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: password,
            options: {
                data: { name: formData.name }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Không thể tạo tài khoản Auth (User).");
        
        const newUserId = authData.user.id;

        // --- BƯỚC 3: XỬ LÝ UPLOAD ẢNH (NẾU CÓ) ---
        let avatarUrlToSet = formData.img; // Mặc định là URL nhập tay

        if (selectedFile) {
            console.log("Đang chuẩn bị upload lên R2...");

            // 3.1: Format tên file theo yêu cầu
            const fileExtension = selectedFile.name.split('.').pop();
            const safeFilename = formatEmailToFilename(formData.email);
            const r2Key = `profiles/designers/${safeFilename}.${fileExtension}`;
            
            // 3.2: Gọi Edge Function để lấy Presigned URL
            console.log(`Đang gọi Edge Function 'r2-presigned-upload' với key: ${r2Key}`);
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

            // 3.3: Upload file trực tiếp lên R2 bằng link vừa lấy
            console.log("Đang PUT file trực tiếp lên R2...");
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

            // 3.4: Lấy URL public (để lưu vào CSDL)
            avatarUrlToSet = `${R2_PUBLIC_URL}/${r2Key}`;
            console.log("Upload ảnh thành công, URL:", avatarUrlToSet);
        }

        // --- BƯỚC 4: TẠO PROFILE (RLS SẼ KIỂM TRA QUYỀN ADMIN) ---
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: newUserId,
                role_id: designerRoleId,
                name: formData.name,
                phone: formData.phone,
                avatar_url: avatarUrlToSet, // Dùng link R2
                status: 'active'
            });

        if (profileError) {
            throw new Error(`Lỗi tạo Profile (RLS?): ${profileError.message}`);
        }

        // --- HOÀN TẤT ---
        alert(`Tạo người dùng ${formData.role} mới thành công!`);
        navigate('/admin_designers');

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
               {selectedFile ? `Đổi ảnh: ${selectedFile.name.substring(0,20)}...` : 'CHOOSE IMAGE FROM COMPUTER'}
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