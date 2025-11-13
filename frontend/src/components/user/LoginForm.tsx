import React, { useState } from "react"; // ✅ Đã sửa: Import React và useState từ 'react'
import { Link, useNavigate } from "react-router-dom"; // ✅ Đã sửa: Import Link và useNavigate từ 'react-router-dom'
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";

// Định nghĩa Interface (Typescript)
interface User {
    id: string; // Thêm ID vào interface
    img: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    createdAt: string;
}

// const API_URL = "https://api.npoint.io/4a915d88732882680a44";

const LoginForm = () => {
    // State (Trạng thái) để lưu trữ dữ liệu nhập từ form
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // State cho Modal/Thông báo lỗi (chỉ hiển thị khi có lỗi)
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { login } = useAuth()

    // Hàm đóng Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage("");
    };

    // Xử lý logic đăng nhập
    // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     // Kiểm tra input cơ bản
    //     if (email.trim() === "" || password.trim() === "") {
    //         setErrorMessage("Please enter your email and password.");
    //         setIsModalOpen(true);
    //         return;
    //     }

    //     setIsLoading(true);

    //     setErrorMessage("");

    //     try {
    //         const response = await fetch(API_URL);
    //         if (!response.ok) throw new Error("Could not connect to API");

    //         const users: User[] = await response.json();
    //         const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    //         if (!foundUser) {
    //             setErrorMessage("Email not found.");
    //             setIsModalOpen(true);
    //             return;
    //         }

    //         if (password !== "123456") {
    //             setErrorMessage("Incorrect password.");
    //             setIsModalOpen(true);
    //             return;
    //         }

    //         // ✅ Lưu thông tin user vào AuthContext
    //         login({
    //             id: foundUser.id,
    //             role: foundUser.role,
    //             name: foundUser.name,
    //             email: foundUser.email,
    //         });

    //         // ✅ Chuyển hướng theo role
    //         if (foundUser.role === "admin") {
    //             navigate("/admin_home");
    //         } else {
    //             navigate(`/customer/${foundUser.id}`);
    //         }

    //     } catch (error) {
    //         console.error("Login error:", error);
    //         setErrorMessage("A system error occurred. Please try again later.");
    //         setIsModalOpen(true);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

        const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            setErrorMessage("Please enter your email and password.");
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            // --- Bước 1: Đăng nhập bằng Supabase Auth ---
            // Thao tác này sẽ kiểm tra email và password_hash trong 'auth.users'
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            // Nếu Supabase trả về lỗi (sai pass, user không tồn tại)
            if (authError) {
                setErrorMessage(authError.message);
                setIsModalOpen(true);
                return;
            }

            // --- Bước 2: Lấy hồ sơ (profile) đầy đủ bằng RPC ---
            // Nếu đăng nhập thành công, gọi hàm 'get_my_profile'
            // Hàm này tự động biết auth.id (nhờ session ở Bước 1)
            const { data: profileArray, error: rpcError } = await supabase
                .rpc('get_my_profile'); 
            if (rpcError) {
                // Lỗi này xảy ra nếu hàm RPC bị lỗi
                setErrorMessage("Could not fetch user profile: " + rpcError.message);
                setIsModalOpen(true);
                return;
            }

            const userProfile = profileArray ? profileArray[0] as User : null;

            // 'userProfile' CHÍNH LÀ JSON MÀ BẠN MUỐN
            // { id, name, role, email, phone, ... }
            if (!userProfile) {
                setErrorMessage("User profile not found. Please contact support.");
                setIsModalOpen(true);
                return;
            }

            // --- Bước 3: Lưu vào Context và Chuyển hướng ---
            // Dùng userProfile (đã bao gồm 'role') để gọi hàm login từ Context
            login(userProfile); 

            if (userProfile.role === "admin") {
                navigate("/admin_home");
            } else {
                // Chuyển hướng user/designer...
                navigate(`/customer/${userProfile.id}`);
            }

        } catch (error: any) {
            // Bắt các lỗi chung
            console.error("Login error:", error);
            setErrorMessage(error.message || "A system error occurred.");
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
        <motion.form
                    onSubmit={handleLogin}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="loginForm relative z-10 bg-white/10 backdrop-blur-md rounded-3xl px-10 py-10 w-full flex flex-col items-center shadow-2xl">
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
        </motion.form>
    );
};

export default LoginForm;
