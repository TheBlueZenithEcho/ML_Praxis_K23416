import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Định nghĩa Interface (giống như LoginForm)
interface User {
    id: number;
    img: string;
    name: string;
    role: 'admin' | 'designer' | 'user';
    email: string;
    phone: string;
    createdAt: string;
}

// URL API bạn cung cấp
const API_URL = "https://api.npoint.io/4a915d88732882680a44";

const RegisterForm = () => {
    const navigate = useNavigate();

    // State để lưu trữ dữ liệu nhập từ form
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // State cho Modal/Thông báo
    const [message, setMessage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Hàm đóng Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setMessage("");
        // Sau khi đóng modal thành công, chuyển hướng người dùng
        if (isSuccess) {
            navigate('/cus_homepage');
        }
    };

    // Hàm xử lý logic Đăng Ký
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Kiểm tra input cơ bản
        if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
            setMessage("Please fill in all fields.");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            // 2. Gọi API để kiểm tra Email đã tồn tại chưa
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Could not connect to the API server.");
            }

            const users: User[] = await response.json();

            const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

            if (emailExists) {
                // Email đã tồn tại
                setMessage("This email is already registered. Please sign in or use a different email.");
                setIsSuccess(false);
                setIsModalOpen(true);
            } else {
                // 3. Đăng ký thành công (Mô phỏng)
                // Trong thực tế, bạn sẽ gửi dữ liệu này đến backend để lưu trữ

                // Mặc định vai trò là 'user' như yêu cầu
                const newUser = {
                    name,
                    email,
                    password, // Chỉ dùng cho mô phỏng, KHÔNG BAO GIỜ lưu mật khẩu plain text
                    role: 'user' as const,
                    // Các trường khác sẽ được backend xử lý
                };

                // Hiển thị thông báo thành công
                setMessage(`Registration successful! Welcome, ${name}. You will be redirected to the customer homepage.`);
                setIsSuccess(true);
                setIsModalOpen(true);
            }

        } catch (error) {
            console.error("Registration error:", error);
            setMessage("A system error occurred during registration. Please try again later.");
            setIsSuccess(false);
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Component Modal
    const StatusModal: React.FC = () => {
        const iconClass = isSuccess
            ? "bi bi-check-circle-fill text-green-600"
            : "bi bi-x-circle-fill text-red-600";
        const title = isSuccess ? "Registration Successful" : "Registration Failed";
        const buttonText = isSuccess ? "Continue to Homepage" : "Try Again";
        const colorClass = isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600";

        return (
            <AnimatePresence>
                {isModalOpen && message && (
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

                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className={`w-14 h-14 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center shadow-inner`}>
                                    <i className={`${iconClass} text-3xl`}></i>
                                </div>
                            </div>

                            {/* Tiêu đề */}
                            <h3 className={`text-lg font-semibold ${isSuccess ? 'text-green-700' : 'text-red-700'} mb-2`}>
                                {title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                {message}
                            </p>

                            {/* Nút Đóng */}
                            <button
                                onClick={closeModal}
                                className={`w-full text-white font-semibold py-3 rounded-full transition ${colorClass}`}
                            >
                                {buttonText}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };


    return (
        <form onSubmit={handleRegister} className="loginForm relative z-10 bg-white/10 backdrop-blur-md rounded-3xl px-10 py-10 w-full flex flex-col items-center shadow-2xl">
            {/* Modal hiển thị thông báo */}
            <StatusModal />

            <div className="text-center mb-8">
                <p className="text-white text-sm">
                    Have an account?{" "}
                    <Link to="/SignIn" className="font-semibold text-white hover:underline">
                        Sign In
                    </Link>
                </p>
                <h1 className="text-white text-3xl font-semibold mt-3">Register</h1>
            </div>

            {/* Input: Name */}
            <div className="flex items-center w-full bg-white/20 hover:bg-white/25 focus-within:bg-white/30 text-white rounded-full px-5 h-12 mb-5 transition">
                <i className="bi bi-person text-lg mr-3"></i>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent flex-1 outline-none placeholder-white text-sm"
                    required
                />
            </div>

            {/* Input: Email */}
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

            {/* Input: Password */}
            <div className="flex items-center w-full bg-white/20 hover:bg-white/25 focus-within:bg-white/30 text-white rounded-full px-5 h-12 mb-6 transition">
                <i className="bi bi-house-lock text-lg mr-3"></i>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent flex-1 outline-none placeholder-white text-sm"
                    required
                    // ✅ Áp dụng thuộc tính ngăn cảnh báo mật khẩu của trình duyệt
                    autoComplete="new-password"
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="w-full bg-white/80 hover:bg-white/60 text-black font-semibold py-3 rounded-full transition disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? "Registering..." : "Submit"}
            </button>

            {/* Remember + Conditions */}
            <div className="flex items-center justify-between w-full text-sm text-white mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-white" />
                    <span>Remember Me</span>
                </label>
                <a href="#" className="hover:underline">
                    Term & Conditions
                </a>
            </div>
        </form>
    );
};

export default RegisterForm;
