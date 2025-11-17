import React, { FC } from 'react';

const Footer: FC = () => {
    return (
        <footer className="relative bg-[#082503] pt-8 pb-0 mt-[100px] overflow-visible">
            {/* Ảnh ghế responsive */}
            <img
                src="/img/decor/footer.png"
                alt="Decor Chair"
                className=" hidden md:block absolute -top-[140px] pointer-events-none -right-[7px] md:w-90 " />

            <div className="container mx-auto px-4 border-b text-[#FDFBCE] pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Footer Logo/About */}
                    <div>
                        <div className="h-6 w-24 bg-gray-300 mb-4 rounded"></div>
                        <p className="text-[082503] text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eli.</p>
                        <div className="flex space-x-2">
                            <div className="w-8 h-8 rounded-full text-[#FDFBCE] flex items-center justify-center cursor-pointer"><i className="bi bi-facebook"></i></div>
                            <div className="w-8 h-8 rounded-full text-[#FDFBCE] flex items-center justify-center cursor-pointer"><i className="bi bi-twitter"></i></div>
                            <div className="w-8 h-8 rounded-full text-[#FDFBCE] flex items-center justify-center cursor-pointer"><i className="bi bi-instagram"></i></div>
                        </div>
                    </div>

                    {/* Our Store Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 font-serif">Our Store</h4>
                        <ul className="space-y-2 text-sm text-[#ffffff] font-inter">
                            <li>Home</li>
                            <li>About</li>
                            <li>Type Room</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                    {/* Get In Touch */}
                    <div className="col-span-2">
                        <h4 className="text-lg text-[#FDFBCE] font-semibold mb-4 font-serif">Get In Touch</h4>
                        <p className="text-sm text-[#ffffff] mb-2"><i className="bi bi-geo-alt-fill mr-2 font-inter"></i> University of Economics and Law</p>
                        <p className="text-sm text-[#ffffff] mb-2"><i className="bi bi-telephone-fill mr-2 font-inter"></i>XXX-XXX-XXX</p>
                        <p className="text-sm text-[#ffffff] mb-2"><i className="bi bi-telephone-fill mr-2 font-inter"></i>XXX-XXX-XXX</p>
                        <p className="text-sm text-[#ffffff] mb-2"><i className="bi bi-envelope-fill mr-2 font-inter"></i>support@site.com</p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-4 pb-4 font-inter">
                <p className="text-xs text-[#ffffff] ">Copyright © 2023 Prasix | Powered by Prasix</p>
            </div>
        </footer>

    );
};

export default Footer;