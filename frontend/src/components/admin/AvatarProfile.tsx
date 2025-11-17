import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  Trash2,
  Save,
  Mail,
  Phone,
  User as UserIcon,
  Shield,
  Palette,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/common/Avatar';
import { toast } from 'sonner';

// --- Logic API (Từ file của bạn) ---
import { supabase } from '@/lib/supabaseClient';

// Interface (Từ file của bạn)
type UserProfile = {
  id: string; // UUID
  name: string | null;
  email: string;
  phone: string | null;
  img: string | null;
  createdAt: string;
  role: 'user' | 'designer' | 'admin' | string;
};

// (Từ file của bạn)
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-your-public-url.r2.dev';

// (Hàm tiện ích format tên file, từ file của bạn)
const formatEmailToFilename = (email: string) => {
  return email.replace(/@/g, '_at_').replace(/\./g, '_');
};

const AvatarProfile = () => {
  // --- Hook (Logic của bạn) ---
  const { user: currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- State (Kết hợp) ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC: `useEffect` (Lấy từ file của BẠN) ---
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) { setError("ID người dùng bị thiếu trong URL."); setLoading(false); return; }
      try {
        setLoading(true);
        setError(null);
        const { data: profileArray, error: rpcError } = await supabase
          .rpc('get_profile_by_id', { profile_id: id });
        if (rpcError) throw rpcError;
        const foundUser = profileArray ? profileArray[0] as UserProfile : null;
        if (foundUser) {
          setUser(foundUser);
          setPreviewUrl(foundUser.img);
        } else {
          setError(`Không tìm thấy hoặc không có quyền xem hồ sơ: ${id}`);
          setUser(null);
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Quyết định xem người dùng hiện tại có quyền sửa/xóa profile này không
  const canEdit = currentUser?.role === 'admin' || currentUser?.id === user?.id;

  // --- LOGIC: `handleChange` (Lấy từ file của BẠN) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) {
      toast.error("Bạn không có quyền chỉnh sửa hồ sơ này.");
      return;
    }
    if (user) setUser({ ...user, [e.target.name]: e.target.value });
  };

  // --- LOGIC: `handleFileChange` (Kết hợp) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
      toast.info('Đã chọn ảnh', { description: `${file.name} sẵn sàng để tải lên.` });
    } else {
      setSelectedFile(null);
      setPreviewUrl(user?.img || null);
    }
  };

  // --- LOGIC: `handleUploadButtonClick` (Giữ nguyên) ---
  const handleUploadButtonClick = () => { fileInputRef.current?.click(); };

  // --- LOGIC: `handleUploadConfirm` (Lấy từ file của BẠN, thêm toast) ---
  const handleUploadConfirm = async () => {
    if (!selectedFile || !user) {
      toast.error("Vui lòng chọn ảnh trước.");
      return;
    }
    setIsUploading(true);
    toast.loading('Đang tải ảnh lên...', { id: 'upload' });

    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const safeFilename = formatEmailToFilename(user.email);
      const r2Folder = user.role === 'designer' ? 'profiles/designers' : 'profiles/customers';
      const r2Key = `${r2Folder}/${safeFilename}.${fileExtension}`;

      const { data: presignedData, error: funcError } = await supabase
        .functions
        .invoke('r2-presigned-upload', {
          body: JSON.stringify({ fileName: r2Key, contentType: selectedFile.type }),
        });

      if (funcError || !presignedData.presignedUrl) {
        throw new Error(`Lỗi lấy Presigned URL: ${funcError?.message || 'Không có URL'}`);
      }

      const r2Response = await fetch(presignedData.presignedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: { 'Content-Type': selectedFile.type },
      });
      if (!r2Response.ok) throw new Error(`Upload file lên R2 thất bại`);

      const newAvatarUrl = `${R2_PUBLIC_URL}/${r2Key}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;

      setUser(prev => prev ? ({ ...prev, img: newAvatarUrl }) : null);
      setPreviewUrl(newAvatarUrl);
      setSelectedFile(null);
      toast.success("Cập nhật ảnh đại diện thành công!", { id: 'upload' });

    } catch (err: any) {
      toast.error(`Lỗi upload: ${err.message}`, { id: 'upload' });
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIC: `handleSubmit` (Lấy từ file của BẠN, thêm toast) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canEdit) return;

    setIsSaving(true);
    toast.loading('Đang lưu thay đổi...', { id: 'save' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: user.name, phone: user.phone })
        .eq('id', user.id);
      if (error) throw error;
      toast.success("Cập nhật hồ sơ thành công!", { id: 'save' });
    } catch (err: any) {
      toast.error(`Lỗi cập nhật: ${err.message}`, { id: 'save' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIC: `handleDeleteUser` (Giữ UI toast, thay logic bằng file của BẠN) ---
  const handleDeleteUser = async () => {
    if (!user) return;
    if (currentUser?.role !== 'admin') {
      toast.error("Chỉ admin mới có quyền xóa người dùng.");
      return;
    }

    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-red-200 max-w-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Xóa tài khoản</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc muốn xóa vĩnh viễn "{user.name}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Hủy</Button>
              <Button
                size="sm" variant="destructive"
                onClick={async () => {
                  toast.dismiss(t);
                  setIsDeleting(true);
                  toast.loading('Đang xóa người dùng...', { id: 'delete' });
                  try {
                    const { error } = await supabase.rpc('delete_user_as_admin', {
                      user_id_to_delete: user.id
                    });
                    if (error) throw error;
                    toast.success("Xóa người dùng thành công!", { id: 'delete', description: 'Đang điều hướng...' });
                    setTimeout(() => {
                      if (user.role === 'designer') navigate('/admin_designers');
                      else navigate('/admin_users');
                    }, 1000);
                  } catch (err: any) {
                    toast.error(`Lỗi xóa: ${err.message}`, { id: 'delete' });
                    setIsDeleting(false);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" /> Xóa
              </Button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // --- LOGIC: `handleDeletePhoto` (Giữ UI toast, thay logic bằng file của BẠN) ---
  const handleDeletePhoto = async () => {
    if (!user || !canEdit) return;
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200 max-w-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Xóa ảnh đại diện</h3>
            <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn xóa ảnh đại diện?</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Hủy</Button>
              <Button
                size="sm" className="bg-amber-500 hover:bg-amber-600"
                onClick={async () => {
                  toast.dismiss(t);
                  setLoading(true);
                  try {
                    const { error } = await supabase
                      .from('profiles')
                      .update({ avatar_url: null })
                      .eq('id', user.id);
                    if (error) throw error;
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    if (user) setUser({ ...user, img: null });
                    toast.success("Đã xóa ảnh đại diện!");
                  } catch (err: any) {
                    toast.error(`Lỗi xóa ảnh: ${err.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" /> Xóa
              </Button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // --- LOADING / ERROR STATES (Design của bạn bạn) ---
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Lỗi tải hồ sơ</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <Button
            onClick={() => navigate(-1)} // Quay lại trang trước
            className="w-full bg-primary hover:bg-[#246122] h-12"
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!user) return null; // Trường hợp user null (đã xử lý ở trên)

  // --- ROLE CONFIG (Design của bạn bạn) ---
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return { icon: Shield, label: 'Admin', className: 'bg-[#D34E4E] text-white' };
      case 'designer':
        return { icon: Palette, label: 'Designer', className: 'bg-[#AFDDFF] text-white ' };
      default:
        return { icon: UserIcon, label: 'User', className: 'bg-[#FFDF88] text-black ' };
    }
  };
  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig.icon;

  // --- RETURN JSX (Design MỚI CÂN ĐỐI, Logic CŨ) ---
  return (
    <div className="bg-main-bg min-h-screen">

      {/* Header - Đã đổi sang màu solid #2B7516 */}
      <div className="bg-[#0A400C] text-white shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-2">
                Profile Settings
              </h1>
            </div>
            <Badge className={`text-lg px-4 py-2 font-semibold ${roleConfig.className}`}>
              <RoleIcon className="w-4 h-4" />
              {roleConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Bố cục cân đối MỚI */}
      <div className="p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* CỘT TRÁI (Tóm tắt & Ảnh) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card tóm tắt */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <Avatar
                    src={previewUrl || undefined}
                    name={user.name || ''}
                    size="xl"
                    showBorder
                    className="shadow-lg"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <div className="flex justify-center mb-4">
                  <Badge className={roleConfig.className}>
                    <RoleIcon className="w-3 h-3" />
                    {roleConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-center gap-2 text-xl text-gray-500">
                  <CalendarDays className="w-4 h-4" />
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            {/* Card Upload Ảnh (Chỉ hiện khi có quyền) */}
            {canEdit && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Ảnh đại diện
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={!canEdit}
                  />
                  <Button
                    className="w-full bg-gradient-to-r from-[#2B7516] to-[#386641] hover:from-[#246122] hover:to-[#2B7516]"
                    onClick={handleUploadButtonClick}
                    disabled={loading || isUploading}
                  >
                    <Upload className="w-4 h-4" />
                    {selectedFile ? 'Đổi ảnh' : 'Tải ảnh mới'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDeletePhoto}
                    disabled={loading || isUploading}
                  >
                    <Trash2 className="w-4 h-4" /> Xóa ảnh
                  </Button>
                  {selectedFile && (
                    <Button
                      className="w-full bg-amber-500 hover:bg-amber-600"
                      onClick={handleUploadConfirm}
                      disabled={isUploading}
                      size="sm"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      {isUploading ? 'Đang tải...' : `Xác nhận tải lên`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* CỘT PHẢI (Form & Actions) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card Form Chi tiết */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl"> {/* Tăng size title */}
                  Profile Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8"> {/* Tăng khoảng cách space-y-8 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Tăng khoảng cách gap-8 */}
                    {/* Full Name */}
                    <div className="space-y-2">
                      {/* TĂNG SIZE CHỮ LABEL VÀ ICON */}
                      <label className="text-xl font-medium text-gray-700 flex items-center gap-2">
                        <UserIcon className="w-7 h-7 text-primary" />
                        Full Name
                      </label>
                      <Input
                        name="name"
                        value={user.name || ''}
                        onChange={handleChange}
                        required
                        disabled={loading || isSaving || !canEdit}
                        // TĂNG SIZE INPUT VÀ CHỮ
                        className="h-14 text-xl"
                      />
                    </div>
                    {/* User ID */}
                    <div className="space-y-2">
                      {/* TĂNG SIZE CHỮ LABEL */}
                      <label className="text-xl font-medium text-gray-700">User ID</label>
                      <Input
                        value={user.id}
                        disabled
                        // TĂNG SIZE INPUT VÀ CHỮ
                        className="h-14 text-xl bg-gray-100" // Đổi màu nền xám
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Tăng khoảng cách gap-8 */}
                    {/* Email */}
                    <div className="space-y-2">
                      {/* TĂNG SIZE CHỮ LABEL VÀ ICON */}
                      <label className="text-xl font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-7 h-7 text-primary" />
                        Email Address
                      </label>
                      <Input
                        name="email" type="email"
                        value={user.email}
                        required
                        disabled // Email không bao giờ được sửa
                        // TĂNG SIZE INPUT VÀ CHỮ
                        className="h-14 text-xl bg-gray-100" // Đổi màu nền xám
                      />
                    </div>
                    {/* Phone */}
                    <div className="space-y-2">
                      {/* TĂNG SIZE CHỮ LABEL VÀ ICON */}
                      <label className="text-xl font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-6 h-6 text-primary" />
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        value={user.phone || ''}
                        onChange={handleChange}
                        disabled={loading || isSaving || !canEdit}
                        // TĂNG SIZE INPUT VÀ CHỮ
                        className="h-14 text-xl"
                      />
                    </div>
                  </div>

                  {/* Nút Save (chuyển vào trong form) */}
                  {canEdit && (
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        // TĂNG SIZE NÚT
                        className="bg-gradient-to-r from-[#2B7516] to-[#386641] hover:from-[#246122] hover:to-[#2B7516] min-w-[180px] h-14 text-xl"
                        disabled={loading || isSaving}
                      >
                        {isSaving ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...</>
                        ) : (
                          <><Save className="w-5 h-5" /> Lưu thay đổi</>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone Card (Chỉ Admin mới thấy) */}
            {currentUser?.role === 'admin' && (
              <Card className="border-l-4 border-red-500">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Khu vực nguy hiểm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <p className="font-medium text-gray-800">Xóa tài khoản người dùng này</p>
                      <p className="text-sm text-gray-600">Hành động này không thể hoàn tác.</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteUser}
                      disabled={loading || isDeleting}
                      className="flex-shrink-0"
                    >
                      {isDeleting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Đang xóa...</>
                      ) : (
                        <><Trash2 className="w-4 h-4" /> Xóa người dùng</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarProfile;