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
            <p className="text-gray-400 mb-8">
                In tempus nisl turpis, at ultricies dui eleifend a. Quisque et quam vel
                ipsum tincidunt ullamcorper id purus eu, rhoncus consequat velit.
            </p>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {contactItems.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg text-center">
                        <i className={`${item.icon} text-2xl text-white mb-2 block`}></i>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.detail}</p>
                    </div>
                ))}
            </div>

            {/* Map Embed Placeholder */}
            <div className="w-full h-80 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 italic">
                {/* Thay thế bằng iframe Google Maps */}
                [Vị trí nhúng Google Maps]
            </div>
        </div>
    );
};

export default ContactDetails;