import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
    TextField,
    Button,
    Avatar,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useAuth } from "@/context/AuthContext";

// --- API giả lập ---
const MOCK_API_URL = "https://api.npoint.io/4a915d88732882680a44";

// --- Kiểu dữ liệu ---
type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    img: string;
    createdAt: string;
    role: "user" | "designer" | "admin";
};

const Cus_Profile_Form: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Bảo vệ route ---
    if (currentUser && Number(currentUser.id) !== Number(id)) {
        return <Navigate to={`/customer/${currentUser.id}/profile`} replace />;
    }

    // --- Lấy thông tin khách hàng ---
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error("Missing ID");
                const res = await fetch(MOCK_API_URL);
                if (!res.ok) throw new Error("Cannot load user list");
                const list: Customer[] = await res.json();
                const found = list.find((u) => Number(u.id) === Number(id));
                if (!found) throw new Error(`Customer not found (ID: ${id})`);
                setCustomer(found);
                setPreviewUrl(found.img);
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    // --- Xử lý thay đổi input ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (customer) setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    // --- Xử lý chọn file ảnh ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    // --- Giả lập upload file ---
    const handleUploadConfirm = async () => {
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }
        alert("Mock upload: This is a simulation (no real API).");
        console.log("Uploading file:", selectedFile.name);
        setLoading(true);
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
        alert("Upload successful!");
    };

    // --- Xóa ảnh ---
    const handleDeletePhoto = () => {
        if (!customer) return;
        if (window.confirm("Remove profile photo?")) {
            setPreviewUrl(null);
            setSelectedFile(null);
            setCustomer({ ...customer, img: "" });
            alert("Photo removed (mock).");
        }
    };

    // --- Lưu thay đổi ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        alert("Changes saved (mock API).");
        setLoading(false);
    };

    // --- Render các trạng thái ---
    if (loading && !customer)
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <CircularProgress />
            </div>
        );
    if (error)
        return (
            <div className="p-8 text-center text-red-600 font-medium">{error}</div>
        );
    if (!customer) return null;

    // --- UI ---
    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 mt-16 bg-white rounded-xl shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6 mb-6">
                <Avatar
                    src={previewUrl || undefined}
                    sx={{ width: 100, height: 100 }}
                />
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {customer.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Joined: {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Buttons upload / delete */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUploadClick}
                        disabled={loading}
                    >
                        {selectedFile ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeletePhoto}
                        disabled={loading}
                    >
                        Delete Photo
                    </Button>
                </div>
            </div>

            {/* Hiển thị nút xác nhận upload */}
            {selectedFile && (
                <div className="mb-6 flex justify-center md:justify-start">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleUploadConfirm}
                        disabled={loading}
                        size="small"
                    >
                        Confirm Upload: {selectedFile.name}
                    </Button>
                </div>
            )}

            {/* Form thông tin */}
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                        label="Full Name"
                        name="name"
                        value={customer.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        disabled={loading}
                    />
                    <TextField
                        label="Customer ID"
                        value={customer.id}
                        fullWidth
                        variant="outlined"
                        disabled
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={customer.email}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        disabled
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={customer.phone}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/customer/${id}`)}
                        disabled={loading}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Cus_Profile_Form;
