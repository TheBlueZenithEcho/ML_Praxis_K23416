import React, { useState } from "react"; // ✅ Đã sửa: Import React và useState từ 'react'
import { Link, useNavigate } from "react-router-dom"; // ✅ Đã sửa: Import Link và useNavigate từ 'react-router-dom'
// Giả định thư viện Framer Motion đã được cài đặt: npm install framer-motion
import { motion, AnimatePresence } from "framer-motion";

// Định nghĩa Interface (Typescript)
interface User {
    id: number; // Thêm ID vào interface
    img: string;
    name: string;
    role: 'admin' | 'designer' | 'user';
    email: string;
    phone: string;
    createdAt: string;
}

// URL API bạn cung cấp
const API_URL = "https://api.npoint.io/4a915d88732882680a44";

const LoginForm = () => {
    // State (Trạng thái) để lưu trữ dữ liệu nhập từ form
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // State cho Modal/Thông báo lỗi (chỉ hiển thị khi có lỗi)
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // Hàm đóng Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage("");
    };

    // Xử lý logic đăng nhập
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra input cơ bản
        if (email.trim() === "" || password.trim() === "") {
            setErrorMessage("Please enter your email and password.");
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            // Bước 1: Gọi API để lấy danh sách người dùng
            const response = await fetch(API_URL);

            if (!response.ok) {
                // Lỗi kết nối API
                throw new Error("Could not connect to the API server.");
            }

            const users: User[] = await response.json();

            // Bước 2: Tìm người dùng theo Email
            const foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

            if (foundUser) {
                // MÔ PHỎNG KIỂM TRA MẬT KHẨU: Giả định mật khẩu đúng là "123456"
                if (password === "123456") {

                    // ĐĂNG NHẬP THÀNH CÔNG: Chuyển hướng theo vai trò và ID
                    setEmail('');
                    setPassword('');

                    if (foundUser.role === 'admin') {
                        // Admin vẫn chuyển đến trang Admin cố định
                        navigate('/admin_homepage');
                    } else {
                        // ✅ CHUYỂN HƯỚNG THEO ID: Dẫn đến /customer/ID_CUA_KHACH_HANG
                        navigate(`/customer/${foundUser.id}`);
                    }
                    return;

                } else {
                    // Mật khẩu sai
                    setErrorMessage("Incorrect password. Please try again.");
                    setIsModalOpen(true);
                }
            } else {
                // Email không tồn tại
                setErrorMessage("Email not found. Please check your email address.");
                setIsModalOpen(true);
            }

        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("A system error occurred. Please try again later.");
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Component Modal
    const ErrorModal: React.FC = () => {
        return (
            <AnimatePresence>
                {isModalOpen && errorMessage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 250 }}
                            className="relative w-[380px] bg-white rounded-3xl shadow-2xl p-8 text-center"
                        >
                            {/* Nút đóng */}
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                            >
                                <i className="bi bi-x-lg text-2xl"></i>
                            </button>

                            {/* Icon - Sử dụng icon lỗi (X-circle) */}
                            <div className="flex justify-center mb-4">
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
                                    <i className="bi bi-x-circle-fill text-3xl text-red-600"></i>
                                </div>
                            </div>

                            {/* Tiêu đề */}
                            <h3 className="text-lg font-semibold text-red-700 mb-2">
                                Login Failed
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                {errorMessage}
                            </p>

                            {/* Nút Đóng */}
                            <button
                                onClick={closeModal}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full transition"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };


    return (
        <form onSubmit={handleLogin} className="loginForm relative z-10 bg-white/10 backdrop-blur-md rounded-3xl px-10 py-10 w-full flex flex-col items-center shadow-2xl">
            {/* Modal hiển thị thông báo lỗi */}
            <ErrorModal />

            <div className="text-center mb-8">
                <p className="text-white text-sm">
                    Don’t have an account?{" "}
                    <Link to="/SignUp" className="font-semibold text-white hover:underline">
                        Sign Up
                    </Link>
                </p>
                <h1 className="text-white text-3xl font-semibold mt-3">Login</h1>
            </div>

            {/* Input Email */}
            <div className="flex items-center w-full bg-white/20 hover:bg-white/25 focus-within:bg-white/30 text-white rounded-full px-5 h-12 mb-5 transition">
                <i className="bi bi-envelope text-lg mr-3"></i>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent flex-1 outline-none placeholder-white text-sm"
                    required
                />
            </div>

            {/* Input Password */}
            <div className="flex items-center w-full bg-white/20 hover:bg-white/25 focus-within:bg-white/30 text-white rounded-full px-5 h-12 mb-6 transition">
                <i className="bi bi-house-lock text-lg mr-3"></i>
                <input
                    type="password"
                    placeholder="Password (Dummy: 123456)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent flex-1 outline-none placeholder-white text-sm"
                    required
                    autoComplete="new-password"
                />
            </div>

            {/* Nút Submit */}
            <button
                type="submit"
                className="w-full bg-white/80 hover:bg-white/60 text-black font-semibold py-3 rounded-full transition disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? "Logging In..." : "Submit"}
            </button>

            {/* Remember Me */}
            <div className="flex items-center justify-between w-full text-sm text-white mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-white" />
                    <span>Remember Me</span>
                </label>
            </div>
        </form>
    );
};

export default LoginForm;
