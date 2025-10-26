import React from "react";

const AuthGallery = () => {
    return (
        <section className="AuthGallery  h-screen">
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full mt-[50px]">
                {/* Cột 1 */}
                <div className="flex flex-col gap-4">
                    <img
                        src="/img/Login/img1.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                    <img
                        src="/img/Login/img2.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                    <img
                        src="/img/Login/img9.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                </div>

                {/* Cột 2 */}
                <div className="flex flex-col gap-4">
                    <img
                        src="/img/Login/img3.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                    <img
                        src="/img/Login/img4.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                    <img
                        src="/img/Login/img5.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                </div>

                {/* Cột 3 */}
                <div className="flex flex-col gap-4">
                    <img
                        src="/img/Login/img6.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                    <img
                        src="/img/Login/img7.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                    <img
                        src="/img/Login/img8.jpg"
                        alt=""
                        className="w-full object-cover rounded-xl"
                    />
                </div>
            </div>
        </section>
        
    );
};

export default AuthGallery;
