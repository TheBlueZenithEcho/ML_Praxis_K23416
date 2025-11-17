import React, { FC } from 'react';

// Dữ liệu chi tiết liên hệ
const contactItems = [
    { icon: "bi bi-phone-fill", title: "Phone Number", detail: "XXX-XXX-XXX" },
    { icon: "bi bi-envelope-fill", title: "Email Address", detail: "Praxis@Email.com" },
    { icon: "bi bi-whatsapp", title: "Whatsapp", detail: "XXX-XXX-XXX" },
    { icon: "bi bi-geo-alt-fill", title: "Our Office", detail: "University of Economics and Law" },
];

const ContactDetails: FC = () => {
    return (
        <div className="lg:w-1/2 pt-10">
            <p className="text-gray-500 mb-8">
                We are always here for you—supporting every step of your journey
                 to create a home that truly reflects who you are.
            </p>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {contactItems.map((item, index) => (
                    <div
                        key={index}
                        className="
                            p-6 rounded-2xl text-center
                            bg-[#FDFBCE] bg-opacity-40
                            shadow-[10px_10px_20px_#c9ccd1,-10px_-10px_20px_#ffffff]
                        "
                    >
                        <i className={`${item.icon} text-2xl text-gray-600 mb-3 block`}></i>
                        <h4 className="font-semibold text-gray-700">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.detail}</p>
                    </div>
                ))}
            </div>

            {/* Map Embed Placeholder */}
            <div
                className="
                    w-full h-80 rounded-2xl
                    bg-[#FDFBCE] bg-opacity-40
                    shadow-[10px_10px_20px_#c9ccd1,-10px_-10px_20px_#ffffff]
                    flex items-center justify-center text-gray-500 italic
                "
            >
                [Vị trí nhúng Google Maps]
            </div>
        </div>
    );
};

export default ContactDetails;
