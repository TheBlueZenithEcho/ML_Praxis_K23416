import React, { FC } from "react";

const ContactForm: FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Form submitted (Demo)");
    };

    return (
        <section className="flex items-center justify-center py-20 mt-25">
            <div className="bg-[#e8ecf1] rounded-3xl p-10 w-[420px] shadow-[10px_10px_20px_#c9ccd1,-10px_-10px_20px_#ffffff]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-700">Get In Touch</h1>
                    <p className="text-gray-500 text-sm mt-1">Send us a message</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Input Wrapper */}
                    <div className="bg-[#e8ecf1] rounded-xl flex items-center gap-3 px-4 h-12 shadow-inner shadow-[inset_8px_8px_16px_#c7cacc,inset_-8px_-8px_16px_#ffffff]">
                        <i className="bi bi-person text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="flex-1 bg-transparent outline-none text-gray-700"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="bg-[#e8ecf1] rounded-xl flex items-center gap-3 px-4 h-12 shadow-[inset_8px_8px_16px_#c7cacc,inset_-8px_-8px_16px_#ffffff]
                    ">
                        <i className="bi bi-envelope text-gray-500"></i>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="flex-1 bg-transparent outline-none text-gray-700"
                            required
                        />
                    </div>

                    {/* Subject */}
                    <div className="
                        bg-[#e8ecf1] 
                        rounded-xl 
                        flex 
                        items-center 
                        gap-3 
                        px-4 
                        h-12 
                        shadow-[inset_8px_8px_16px_#c7cacc,inset_-8px_-8px_16px_#ffffff]
                    ">
                        <i className="bi bi-chat-left-text text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="flex-1 bg-transparent outline-none text-gray-700"
                        />
                    </div>

                    {/* Message */}
                    <div className="
                        bg-[#e8ecf1] 
                        rounded-2xl 
                        px-4 
                        py-3 
                        shadow-[inset_8px_8px_16px_#c7cacc,inset_-8px_-8px_16px_#ffffff]
                    ">
                        <textarea
                            placeholder="Your Message..."
                            rows={4}
                            className="w-full bg-transparent outline-none text-gray-700 resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="
                            w-full 
                            py-3 
                            rounded-xl 
                            text-white 
                            font-semibold 
                            bg-[#4fb3d4]
                            shadow-[6px_6px_12px_#c1c4c9,-6px_-6px_12px_#ffffff]
                            hover:brightness-105
                            transition
                        "
                    >
                        Send Message
                    </button>
                </form>

            </div>
        </section>
    );
};

export default ContactForm;
