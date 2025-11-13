import CallToAction from "@/components/user/CallToAction";
import ContactDetails from "@/components/user/ContactDetails";
import ContactForm from "@/components/user/ContactForm";
import Footer from "@/components/user/Footer";


const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">

            {/* Header/Banner Section */}
            <div className="py-20 text-center bg-gray-950">
                <h1 className="text-5xl font-bold mb-2">Contact Us</h1>
            </div>

            {/* Main Content (Form và Chi tiết) */}
            <main className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Component Form */}
                    <ContactForm />

                    {/* Component Chi tiết & Map */}
                    <ContactDetails />
                </div>
            </main>

            {/* Component Call To Action */}
            <CallToAction />

            {/* Component Footer */}
            <Footer />
        </div>
    );
};

export default ContactPage;