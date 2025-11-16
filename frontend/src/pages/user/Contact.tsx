import CallToAction from "@/components/user/CallToAction";
import ContactDetails from "@/components/user/ContactDetails";
import ContactForm from "@/components/user/ContactForm";
import Footer from "@/components/user/Footer";

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* Header/Banner Section */}
            <div className="py-20 text-center bg-[url('/img/decor/contact_hero.jpg')] bg-cover bg-center overflow-hidden -top-4">
            </div>

            {/* Main Content (Form và Chi tiết) */}
            <main className="container mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
                    {/* Component Form */}
                    <ContactForm/>

                    {/* Component Chi tiết & Map */}
                    <ContactDetails />
                </div>
            </main>
            <div className="mb-48">
                <CallToAction />
            </div>
            {/* Component Call To Action */}
            

            {/* Component Footer */}
            <Footer />
        </div>
    );
};

export default ContactPage;
