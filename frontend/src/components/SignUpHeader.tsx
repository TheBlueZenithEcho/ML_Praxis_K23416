import React from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { useEffect } from "react"
import Button from "./Button";

const Header = () => {
    const [open, setOpen] = React.useState(false);
    const toggleMenu = () => {
        setOpen(prev => !prev);
    };
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <>
            <header className="fixed top-0 left-0 w-full z-30 bg-white shadow">
                <nav className="px-4 md:px-8">
                    <div className=" flex justify-between items-center py-2 ">
                        {/* Logo section */}
                        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
                            <p className=" font-serif text-secondary">PRAXIS</p>
                        </div>
                        {/* Menu section */}
                        <div className="hidden md:block ">
                            <ul className="flex items-center text-gray-950 gap-12 ">
                                <li className="text-center"><a href="/" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Home</a></li>
                                <li className="text-center"><a href="#" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Designer</a></li>
                                <li className="text-center relative group">
                                    <a
                                        href="#"
                                        className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300"
                                    >
                                        <span className="flex items-center justify-center">
                                            Type Rooms
                                            <i className="bi bi-caret-down-fill text-xs ml-1 ]"></i>
                                        </span>
                                    </a>
                                    <ul
                                        className="absolute left-0 top-full hidden group-hover:block bg-white text-[#143E08]  rounded-lg  w-40 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100  shadow-[0_10px_20px_-5px_rgba(0,0,0,0.15)]"
                                        style={{
                                            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)',
                                            marginTop: '2px'
                                        }}
                                    >
                                        <li><a href="#" className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold">Bedroom</a></li>
                                        <li><a href="#" className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold">Living Room</a></li>
                                        <li><a href="#" className="block px-8 py-3 text-left hover:bg-[#E6F3E6] transition hover:font-semibold">Kitchen</a></li>
                                    </ul>
                                </li>
                                <li className="text-center"><a href="#" className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Contact</a></li>
                            </ul>
                        </div>
                        {/* Icons section */}

                        <div className="flex items-center gap-4" >
                            <Button to="/SignIn">
                            Sign In
                            </Button>
                            {/* Mobile hamburger Menu section */}
                            <div className="md:hidden" onClick={toggleMenu} >
                                <i className="bi bi-list text-4xl"></i>
                            </div>

                        </div>

                    </div>
                </nav>

                {/* Mobile Sidebar section */}
                <ResponsiveMenu
                    open={open}
                    setOpen={setOpen}
                />
            </header>


        </>
    )
}

export default Header