import React from 'react';
const HERO_IMAGE_URL = '@/img/hero/about_hero.jpg';

const AboutHeroSection: React.FC = () => {
    return (
        <header
            className="h-screen w-full bg-cover bg-center flex flex-col justify-center items-center p-8 relative font-serif"
            style={{
                backgroundImage: `url(${HERO_IMAGE_URL})`,
                // Áp dụng lớp phủ tối (Dark Overlay) để tăng độ tương phản cho chữ
                backgroundBlendMode: 'multiply',
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            }}
        >
            {/* Nav Bar (Thêm vào nếu cần, nhưng yêu cầu trước đó là không cần header) 
            <nav className="absolute top-10 w-full flex justify-center text-sm font-light uppercase tracking-widest">
                ... Menu Items ...
            </nav>
            */}

            {/* Nội dung chính giữa */}
            <div className="flex flex-col items-center justify-center text-center text-white mt-10">
                <p className="text-sm font-extralight tracking-[0.3em] uppercase mb-4 text-yellow-400">
                    OUR HISTORY AND VISION
                </p>
                <h1 className="text-5xl md:text-7xl font-light uppercase tracking-wider mb-8 drop-shadow-lg">
                    THE FUTUREBLOX STORY
                </h1>

                {/* CTA hoặc mô tả ngắn */}
                <a
                    href="#team"
                    className="text-base uppercase tracking-widest border-b border-white pb-1 font-light hover:text-yellow-400 transition duration-300"
                >
                    Meet The Team Below
                </a>
            </div>

            {/* Thêm mũi tên xuống dưới nếu cần */}
            <div className="absolute bottom-10 animate-bounce">
                <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </header>
    );
};

export default AboutHeroSection;