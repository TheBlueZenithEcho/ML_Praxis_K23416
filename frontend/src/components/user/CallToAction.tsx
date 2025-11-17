import { url } from 'inspector';
import React, { FC } from 'react';

const CallToAction: FC = () => {

    return (
        <section className="relative h-96 my-16 bg-cover bg-center bg-[url('/img/decor/contact.jpg')]">
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white">
                <h2 className="text-3xl font-bold mb-1">Hire Us Now</h2>
                <p className="text-lg mb-6">We Are Always Ready To Capture the Perfect Interior Shot</p>
                <button className="px-10 py-3 border-2 border-white text-white font-medium uppercase hover:bg-white hover:text-black transition-colors">
                    Get Started
                </button>
            </div>
        </section>
    );
};

export default CallToAction;