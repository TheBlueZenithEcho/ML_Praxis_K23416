import Catalog from "@/components/user/Catalog";
import Features from "@/components/user/Features";
import Footer from "@/components/user/Footer";
import Hero from "@/components/user/Hero";
import React from "react";


const HomePage: React.FC = () => {
    return (
        <>
            <main className="flex-grow">
                <Hero />
                <Features />
                <Catalog />
            </main>
            <Footer />
        </>
    );
};

export default HomePage;
