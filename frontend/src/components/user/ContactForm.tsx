import React, { FC } from 'react';

// Giả sử logic gửi form được xử lý ở đây hoặc truyền qua props
const ContactForm: FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Form submitted (Demo)");
    };

    return (
        <div className="lg:w-1/2 p-8 bg-gray-800 rounded-lg shadow-xl">
            <h3 className="text-lg text-gray-400 font-light mb-1">Contact Us</h3>
            <h2 className="text-4xl font-semibold mb-8">Get In Touch</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Name..." required
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-white focus:border-white placeholder-gray-400" />

                <input type="email" placeholder="example@email.com" required
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-white focus:border-white placeholder-gray-400" />

                <input type="text" placeholder="Title..."
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-white focus:border-white placeholder-gray-400" />

                <textarea placeholder="Type Here..." rows={6}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-white focus:border-white resize-none placeholder-gray-400" />

                <button type="submit"
                    className="px-8 py-3 bg-gray-800 border border-gray-500 rounded-md hover:bg-gray-700 transition-colors font-medium">
                    Send Now
                </button>
            </form>
        </div>
    );
};

export default ContactForm;