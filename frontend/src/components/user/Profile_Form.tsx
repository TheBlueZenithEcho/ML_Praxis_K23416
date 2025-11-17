import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Avatar, CircularProgress, InputAdornment, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabaseClient';
import { supabase } from '../../lib/supabaseClient';

type UserProfile = {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    img: string | null;
    createdAt: string;
    role: 'user' | 'designer' | 'admin' | string;
};

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-your-public-url.r2.dev';
const formatEmailToFilename = (email: string) => email.replace(/@/g, '_at_').replace(/\./g, '_');

const Cus_Profile_Form = () => {
    const { user: currentUser } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 🔹 Fetch profile
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setError("ID người dùng bị thiếu trong URL.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);

                const { data: profileArray, error: rpcError } = await supabase
                    .rpc('get_profile_by_id', { profile_id: id });

                if (rpcError) throw rpcError;

                const foundUser = profileArray?.[0] as UserProfile | null;
                if (!foundUser) {
                    setError(`Không tìm thấy hoặc không có quyền xem hồ sơ: ${id}`);
                    setUser(null);
                    return;
                }

                setUser(foundUser);
                setPreviewUrl(foundUser.img || null);

                console.log("Fetched profile.id:", foundUser.id);
                console.log("Current auth.uid():", currentUser?.id);
            } catch (err: any) {
                console.error("Lỗi khi fetch user:", err);
                setError(err.message || 'Lỗi không xác định');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, currentUser?.id]);

    useEffect(() => {
        if (user) console.log("State user.id:", user.id);
    }, [user]);

    // 🔹 Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (currentUser?.role === 'admin' || currentUser?.id === user?.id) {
            setUser(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
        } else {
            alert("Bạn không có quyền chỉnh sửa hồ sơ này.");
        }
    };

    // 🔹 Handle file select
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setPreviewUrl(user?.img || null);
        }
    };

    const handleUploadButtonClick = () => fileInputRef.current?.click();

    // 🔹 Handle upload confirm
    const handleUploadConfirm = async () => {
        if (!selectedFile || !user) {
            alert("Vui lòng chọn ảnh trước.");
            return;
        }
        setLoading(true);
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

            if (funcError || !presignedData.presignedUrl)
                throw new Error(`Lỗi lấy Presigned URL: ${funcError?.message || 'Không có URL'}`);

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
            alert("Cập nhật ảnh đại diện thành công!");
        } catch (err: any) {
            console.error("Lỗi upload ảnh:", err);
            alert(`Lỗi upload: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ name: user.name, phone: user.phone })
                .eq('id', user.id);
            if (error) throw error;
            alert("Cập nhật hồ sơ thành công!");
        } catch (err: any) {
            console.error("Lỗi khi cập nhật user:", err);
            alert(`Lỗi cập nhật: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Handle delete user
    const handleDeleteUser = async () => {
        if (!user?.id) return;
        if (!window.confirm(`XÁC NHẬN XÓA vĩnh viễn ${user.role} "${user.name}"?`)) return;
        setLoading(true);
        try {
            const { error } = await supabase.rpc('delete_user_as_admin', { user_id_to_delete: user.id });
            if (error) throw error;
            alert("Xóa người dùng thành công!");
            navigate(user.role === 'designer' ? '/admin_designers' : '/admin_users');
        } catch (err: any) {
            console.error("Lỗi khi xóa user:", err);
            alert(`Lỗi xóa: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Handle delete photo
    const handleDeletePhoto = async () => {
        if (!user?.id) return;
        if (!window.confirm("Xóa ảnh đại diện?")) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', user.id);
            if (error) throw error;
            setUser(prev => prev ? { ...prev, img: null } : null);
            setPreviewUrl(null);
            setSelectedFile(null);
            alert("Đã xóa ảnh đại diện!");
        } catch (err: any) {
            console.error("Lỗi khi xóa ảnh:", err);
            alert(`Lỗi xóa ảnh: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Loading/Error states
    if (loading && !user) return <div className="center-screen"><CircularProgress /></div>;
    if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
    if (!user) return <div className="p-8 text-orange-500 text-center">Không tìm thấy hồ sơ người dùng (ID: {id})</div>;

    const canEdit = currentUser?.role === 'admin' || currentUser?.id === user.id;
    const getRoleChip = (role: string) => {
        switch (role) {
            case 'admin': return <Chip icon={<AdminPanelSettingsIcon />} label="Admin" color="error" size="small" />;
            case 'designer': return <Chip icon={<DesignServicesIcon />} label="Designer" color="primary" size="small" />;
            default: return <Chip icon={<PersonIcon />} label="User" color="success" size="small" />;
        }
    };

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
                    {canEdit && (
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                            <Button variant="contained" sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }} onClick={handleUploadButtonClick} disabled={loading}>
                                {selectedFile ? 'Change Photo' : 'Upload New Photo'}
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                            <Button variant="outlined" color="error" onClick={handleDeletePhoto} disabled={loading}>Delete Photo</Button>
                        </div>
                    )}
                </div>

                {selectedFile && canEdit && (
                    <div className="mb-6 flex justify-center md:justify-start">
                        <Button variant="contained" color="secondary" onClick={handleUploadConfirm} disabled={loading} size="small">
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
                        <TextField label="Email Address" name="email" type="email" value={user.email} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>), }} disabled />
                        <TextField label="Phone Number" name="phone" value={user.phone || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>), }} disabled={loading || !canEdit} />
                    </div>

                    {canEdit && (
                        <div className="flex justify-end gap-4 pt-4">
                            <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
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
.center-screen { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Cus_Profile_Form;
