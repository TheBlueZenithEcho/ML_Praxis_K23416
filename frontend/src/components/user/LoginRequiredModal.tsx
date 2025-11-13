import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button";

interface LoginRequiredModalProps {
    show: boolean;
    onClose: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ show, onClose }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[10000]"
                    onClick={onClose}
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
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                        >
                            <i className="bi bi-x-lg text-2xl"></i>
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                                <i className="bi bi-person-circle text-3xl text-gray-600"></i>
                            </div>
                        </div>

                        {/* Tiêu đề */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            You need to sign in
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Please log in to receive personalized consultation and support.
                        </p>

                        {/* Nút Sign In */}
                        <div className="flex justify-center gap-3">
                            <Button to="/SignIn">
                                Sign In
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginRequiredModal;
