import React from "react";
import Hero from "../../components/user/Hero";
import Features from "../../components/user/Features";
import Catalog from "../../components/user/Catalog";
import Footer from "../../components/user/Footer";

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
