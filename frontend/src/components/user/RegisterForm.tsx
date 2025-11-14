import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext"; // ✅ dùng context thay cho Zustand
import { supabase } from "../../lib/supabaseClient";
import { a } from "node_modules/framer-motion/dist/types.d-BJcRxCew";

// 🧩 Định nghĩa kiểu dữ liệu của người dùng
interface User {
    id: string;
    img: string;
    name: string;
    role: "user";
    email: string;
    phone: string;
    createdAt: string;
}

// mock API chứa danh sách user
// const API_URL = "https://api.npoint.io/4a915d88732882680a44";

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ lấy login từ context

    // 📌 State lưu dữ liệu nhập
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 📌 State cho modal
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<User | null>(null);


    const DEFAULT_AVATAR_URL = "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600";

    // 🔹 Hàm xử lý đăng ký
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            setMessage("Vui lòng nhập đầy đủ thông tin.");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            // Đảm bảo chỉ có thể tạo profile với role này
            // const { data: roleData, error: roleError } = await supabase
            //     .from('roles')
            //     .select('id')
            //     .eq('role_name', 'user')
            //     .single();

            // if (roleError || !roleData) {
            //     setMessage("Lỗi hệ thống: Không tìm thấy ID vai trò 'user'. Vui lòng liên hệ Admin.");
            //     setIsSuccess(false);
            //     setIsModalOpen(true);
            //     return;
            // }
            // const customerRoleId = roleData.id;

            // --- Bước 1: Đăng ký người dùng mới bằng Supabase Auth ---
            // const { data: authData, error: authError } = await supabase.auth.signUp({
            //     email: email,
            //     password: password,
            //     options: {
            //         data: { 
            //             // Truyền Name vào raw_user_meta_data để trigger tạo profile sử dụng
            //             name: name 
            //         },
            //     },
            // });

            // if (authError) {
            //     // Xử lý các lỗi phổ biến như: mật khẩu quá ngắn, người dùng đã tồn tại
            //     const msg = authError.message.includes("Password should be at least 6 characters")
            //         ? "Mật khẩu phải có ít nhất 6 ký tự."
            //         : authError.message.includes("User already registered")
            //         ? "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác."
            //         : authError.message; // Giữ nguyên lỗi khác

            //     setMessage("Đăng ký thất bại: " + msg);
            //     setIsSuccess(false);
            //     setIsModalOpen(true);
            //     return;
            // }

            // // Kiểm tra: Nếu email xác thực đang bật, Supabase sẽ không trả về session, 
            // // người dùng cần kiểm tra email trước.
            // if (!authData.session) {
            //     setMessage(
            //         "Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác nhận tài khoản trước khi đăng nhập."
            //     );
            //     setIsSuccess(true); // Coi là thành công nhưng chưa đăng nhập
            //     setIsModalOpen(true);
            //     return;
            // }
            // BẠN CHỈ CẦN GỌI HÀM NÀY, KHÔNG GỌI .insert() HAY .update()
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    // Dữ liệu này sẽ được gửi đến trigger
                    // thông qua 'NEW.raw_user_meta_data'
                    data: {
                        name: name, // Dữ liệu từ form
                        avatar_url: DEFAULT_AVATAR_URL, // Dữ liệu từ form
                        source:'public_signup'

                        // QUAN TRỌNG:
                        // Client KHÔNG NÊN tự gán role.
                        // Việc gán role nên được làm ở server (trong trigger)
                        // để đảm bảo bảo mật.
                    }
                }
            });

            if (authError) {
                // Xử lý lỗi đăng ký (email tồn tại, mật khẩu yếu...)
                console.error("Sign up error:", authError);
                setMessage(authError.message);
                setIsSuccess(false);
                setIsModalOpen(true);
                return;
            }

            if (authData.user) {
                // Trigger SẼ tự động tạo profile.
                // Client không cần làm gì thêm.
                setMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
                setIsSuccess(true);
                setIsModalOpen(true);
            }

            if (!authData.session) {
                setMessage(
                    "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập."
                );
                setIsSuccess(true);
                setIsModalOpen(true);
                return;
            }

            if (authData.user && authData.session) {
                const userId = authData.user.id;
                console.log("User registered with ID:", userId);

                // --- Bước 2: Đăng ký thành công & Session có sẵn (Auto sign-in) ---
                // Lấy hồ sơ (profile) đầy đủ bằng RPC, giống như trong Login
                const { data: profileArray, error: rpcError } = await supabase.rpc('get_my_profile');

                if (rpcError) {
                    setMessage("Đăng ký thành công, nhưng không thể lấy hồ sơ người dùng: " + rpcError.message);
                    setIsSuccess(true);
                    setIsModalOpen(true);
                    return;
                }
                const userProfile = profileArray ? profileArray[0] as User : null;
                // if(userProfile)userProfile.phone= userProfile.phone?? "563 632 325";
                // console.log("Hồ sơ người dùng sau đăng ký, them avatar, phone:", userProfile);

                if (!userProfile) {
                    setMessage("Đăng ký thành công, nhưng không tìm thấy hồ sơ người dùng. Vui lòng liên hệ hỗ trợ.");
                    setIsSuccess(true);
                    setIsModalOpen(true);
                    return;
                }

               
            // --- Bước 3: Lưu vào Context và Chuyển hướng ---
            setUserProfile(userProfile);
            login(userProfile);

            setMessage(`Đăng ký thành công! Chào mừng ${userProfile.name}.`);
            setIsSuccess(true);
            setIsModalOpen(true);

        }
            

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setMessage("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
            setIsSuccess(false);
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setMessage("");

        // Nếu đăng ký thành công thì chuyển hướng
        if (isSuccess) {
            navigate(`/customer/${userProfile.id}`);
        }
    };
    // 🔹 Modal thông báo kết quả đăng ký
    const StatusModal: React.FC = () => {
        const iconClass = isSuccess
            ? "bi bi-check-circle-fill text-green-600"
            : "bi bi-x-circle-fill text-red-600";
        const title = isSuccess ? "Registration Successful" : "Registration Failed";
        const buttonText = isSuccess ? "Continue to Homepage" : "Try Again";
        const colorClass = isSuccess
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600";

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
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                            >
                                <i className="bi bi-x-lg text-2xl"></i>
                            </button>

                            <div className="flex justify-center mb-4">
                                <div
                                    className={`w-14 h-14 ${isSuccess ? "bg-green-100" : "bg-red-100"
                                        } rounded-full flex items-center justify-center shadow-inner`}
                                >
                                    <i className={`${iconClass} text-3xl`}></i>
                                </div>
                            </div>

                            <h3
                                className={`text-lg font-semibold ${isSuccess ? "text-green-700" : "text-red-700"
                                    } mb-2`}
                            >
                                {title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">{message}</p>

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

    // 🔹 UI form
    return (
        <motion.form
            onSubmit={handleRegister}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="loginForm relative z-10 bg-white/10 backdrop-blur-md rounded-3xl px-10 py-10 w-full flex flex-col items-center shadow-2xl"
        >
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

            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
            <div className="flex items-center w-full bg-white/20 hover:bg-white/25 focus-within:bg-white/30 text-white rounded-full px-5 h-12 mb-6 transition">
                <i className="bi bi-house-lock text-lg mr-3"></i>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent flex-1 outline-none placeholder-white text-sm"
                    required
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

            {/* Remember */}
            <div className="flex items-center justify-between w-full text-sm text-white mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-white" />
                    <span>Remember Me</span>
                </label>
                <a href="#" className="hover:underline">
                    Term & Conditions
                </a>
            </div>
        </motion.form>
    );
};

export default RegisterForm;
