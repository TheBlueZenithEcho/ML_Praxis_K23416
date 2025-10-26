import React, { useState, useEffect, useRef } from 'react';
// SỬA 1: Sửa import react-router-dom nếu chưa đúng
import { useParams, useNavigate } from 'react-router';
import { TextField, Button, Avatar, CircularProgress, Chip } from '@mui/material';
// Import icons cho Type Room (tùy chọn)
import WeekendIcon from '@mui/icons-material/Weekend'; // Sofa cho living room
import HotelIcon from '@mui/icons-material/Hotel';     // Giường cho bed room
import KitchenIcon from '@mui/icons-material/Kitchen'; // Tủ lạnh cho kitchen

// --- API URLs ---
// (1) API Giả lập (đang dùng - API mới của bạn)
const MOCK_API_GET_LIST_URL = 'https://api.npoint.io/3619c3ea1583a5bd1216'; // <<<--- API MỚI CỦA BẠN

// (2) API Thật (comment lại)
// const REAL_API_BASE_URL = '...';
// const REAL_API_INTERIOR_ENDPOINT = '...';
// const REAL_API_UPLOAD_ENDPOINT = '...';
// -----------------

// --- SỬA 2: KIỂU DỮ LIỆU (KHỚP API MỚI) ---
type InteriorProfileType = {
  id: string | number;
  img: string;
  name: string; // Thay thế 'title'
  designer: string;
  createdAt: string; // Thêm createdAt
  "type room": "living room" | "bed room" | "kitchen" | string; // Thêm type room
  // Các trường cũ location, year, style không còn
};
// ----------------------------------------

const InteriorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interior, setInterior] = useState<InteriorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State ảnh (giữ nguyên)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- READ --- (Logic fetch giữ nguyên, chỉ cần đảm bảo kiểu dữ liệu đúng)
  useEffect(() => {
    const fetchInterior = async () => {
      if (!id) { setError("ID thiết kế bị thiếu."); setLoading(false); return; }
      try {
        setLoading(true); setError(null);

        const response = await fetch(MOCK_API_GET_LIST_URL); // Gọi API mới
        if (!response.ok) throw new Error('Không thể tải danh sách thiết kế');
        // API mới trả về đúng kiểu InteriorProfileType (với 'name', 'createdAt', 'type room')
        const interiorList: InteriorProfileType[] = await response.json();

        const interiorIdNumber = parseInt(id, 10);
        const foundInterior = interiorList.find(item => Number(item.id) === interiorIdNumber);

        if (foundInterior) {
            setInterior(foundInterior);
            setPreviewUrl(foundInterior.img);
        } else {
            setError(`Không tìm thấy thiết kế với ID: ${id}`); setInterior(null);
        }
      } catch (err) {
        console.error("Lỗi khi fetch thiết kế:", err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setInterior(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInterior();
  }, [id]);

  // Xử lý thay đổi form (giữ nguyên)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (interior) {
        setInterior({ ...interior, [e.target.name]: e.target.value });
    }
  };

  // --- Xử lý Upload Ảnh --- (Giữ nguyên)
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { /* ... */
      const file = event.target.files?.[0];
      if (file) { setSelectedFile(file); const reader = new FileReader(); reader.onloadend = () => setPreviewUrl(reader.result as string); reader.readAsDataURL(file); }
      else { setSelectedFile(null); setPreviewUrl(interior?.img || null); }
   };
  const handleUploadButtonClick = () => fileInputRef.current?.click();
  const handleUploadConfirm = async () => { /* ... (giữ nguyên logic phân biệt API) ... */
      if (!selectedFile || !interior) return alert("Vui lòng chọn ảnh.");
      const useRealApi = false;
      if (useRealApi) { /* // Code API thật */ alert("API Upload thật đang bị comment."); }
      else { alert("Mock API upload simulation."); setLoading(true); await new Promise(r => setTimeout(r, 1500)); setLoading(false); alert("Mock upload success!"); }
  };
  const handleDeletePhoto = () => { /* ... (giữ nguyên logic phân biệt API) ... */
      const useRealApi = false;
      if(window.confirm("Xóa ảnh thiết kế?")) {
           if(useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
           else { setPreviewUrl(null); setSelectedFile(null); if(interior) setInterior({...interior, img: ''}); alert("Giả lập xóa ảnh!"); }
      }
  };
  // -------------------------

  // --- UPDATE --- (Cập nhật data gửi đi)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!interior) return;
    const useRealApi = false;

    // SỬA 3: Dữ liệu gửi đi khớp với API mới
    const interiorDataToSend = {
        id: interior.id, // ID có thể cần hoặc không tùy API thật
        img: previewUrl || interior.img,
        name: interior.name, // Đã dùng name
        designer: interior.designer,
        createdAt: interior.createdAt, // Có thể không cho sửa createdAt
        "type room": interior["type room"] // Giữ nguyên key "type room"
        // location, year, style không còn
    };
    // ------------------------------------

    if (useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
    else {
        alert("Mock API update simulation."); setLoading(true);
        console.log("Dữ liệu (giả lập) gửi đi:", interiorDataToSend);
        await new Promise(r => setTimeout(r, 1000)); setLoading(false);
        alert("Mock update success!");
    }
  };

  // --- DELETE --- (Giữ nguyên)
  const handleDeleteInterior = async () => { /* ... (giữ nguyên logic phân biệt API) ... */
      if (!interior) return;
      // Sửa: Dùng 'name' thay vì 'title' trong confirm
      if (window.confirm(`Xóa thiết kế "${interior.name}" (ID: ${id})?`)) {
          const useRealApi = false;
          if (useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
          else { alert("Mock API delete simulation."); setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); alert("Mock delete success!"); navigate('/admin_interior'); }
      }
  };

  // Loading/Error/Not Found states (giữ nguyên)
  if (loading && !interior) return <div className="center-screen"><CircularProgress /></div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!interior) return <div className="p-8 text-orange-500 text-center">Interior Design ID not found: {id}</div>;

   // SỬA 4: HÀM LẤY ICON CHO TYPE ROOM (tùy chọn)
   const getTypeRoomChip = (type: string) => {
       let icon = null;
       let color: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default" = "default";
       switch (type) {
           case 'living room': icon = <WeekendIcon />; color = "primary"; break;
           case 'bed room': icon = <HotelIcon />; color = "secondary"; break;
           case 'kitchen': icon = <KitchenIcon />; color = "warning"; break;
       }
       return <Chip icon={icon || undefined} label={type || 'N/A'} size="small" color={color} className="capitalize"/>;
   };
   // ----------------------------------------

  // --- RETURN JSX (Cập nhật hiển thị và form) ---
  return (
    <div className="p-6 md:p-10 bg-[#fcfcfc] min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Interior Design Details</h1>
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header: Ảnh, Name, Buttons */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-6">
          <img
            src={previewUrl || '/placeholder-image.png'}
            alt={interior.name} // Sửa: Dùng name
            className="w-40 h-40 object-cover border rounded bg-gray-100"
          />
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{interior.name}</h2> {/* Sửa: Dùng name */}
            <p className="text-gray-600">Designer: {interior.designer}</p>
             {/* SỬA 5: HIỂN THỊ TYPE ROOM VÀ CREATED AT */}
             <div className="mt-1">{getTypeRoomChip(interior["type room"])}</div>
             <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(interior.createdAt).toLocaleDateString()}
             </p>
             {/* Xóa Location, Year, Style */}
             {/* ------------------------------------- */}
          </div>
          {/* Nút Upload/Delete Ảnh (giữ nguyên) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
             <Button variant="contained" sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }} onClick={handleUploadButtonClick} disabled={loading}>
                 {selectedFile ? 'Change Photo' : 'Upload New Photo'}
             </Button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
             <Button variant="outlined" color="error" onClick={handleDeletePhoto} disabled={loading}>Delete Photo</Button>
           </div>
        </div>

         {/* Nút xác nhận Upload (giữ nguyên) */}
        {selectedFile && (
            <div className="mb-6 flex justify-center md:justify-start">
                <Button variant="contained" color="secondary" onClick={handleUploadConfirm} disabled={loading} size="small">
                    Confirm Upload: {selectedFile.name}
                </Button>
            </div>
        )}

        {/* --- SỬA 6: FORM (Cập nhật các trường) --- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TextField label="Name" name="name" value={interior.name} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
             <TextField label="Designer" name="designer" value={interior.designer} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Sử dụng TextField cho 'type room' hoặc Select nếu muốn */}
             <TextField label="Type Room" name="type room" value={interior["type room"]} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
             <TextField label="Created At" value={new Date(interior.createdAt).toLocaleString()} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }}/>
             {/* Xóa Location, Year, Style */}
             <TextField label="ID" value={interior.id} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} className="md:col-span-2"/> {/* ID chiếm cả dòng */}
          </div>

          {/* Buttons Save/Delete (giữ nguyên) */}
          <div className="flex justify-end gap-4 pt-4">
             <Button variant="contained" color="primary" type="submit" disabled={loading}>
                 {loading ? 'Saving...' : 'Save Changes'}
             </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteInterior} disabled={loading}>
                  Delete Interior
              </Button>
          </div>
        </form>
        {/* ----------------------------------- */}
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


export default InteriorProfile;