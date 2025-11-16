import React, { FC } from 'react';

// Dữ liệu chi tiết liên hệ
const contactItems = [
    { icon: "bi bi-phone-fill", title: "Phone Number", detail: "+6282 4032 567" },
    { icon: "bi bi-envelope-fill", title: "Email Address", detail: "Example@Email.com" },
    { icon: "bi bi-whatsapp", title: "Whatsapp", detail: "085 245 7233" },
    { icon: "bi bi-geo-alt-fill", title: "Our Office", detail: "2443 Oak Ridge Omaha, GA 45065" },
];

const ContactDetails: FC = () => {
    return (
        <div className="lg:w-1/2 pt-10">
            <p className="text-gray-500 mb-8">
                In tempus nisl turpis, at ultricies dui eleifend a. Quisque et quam vel
                ipsum tincidunt ullamcorper id purus eu, rhoncus consequat velit.
            </p>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {contactItems.map((item, index) => (
                    <div
                        key={index}
                        className="
                            p-6 rounded-2xl text-center
                            bg-[#e8ecf1]
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
                    bg-[#e8ecf1]
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
