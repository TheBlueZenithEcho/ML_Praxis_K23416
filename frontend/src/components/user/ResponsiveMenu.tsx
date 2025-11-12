import React from 'react'
import { motion, AnimatePresence } from "framer-motion"

const ResponsiveMenu = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const handleLinkClick = () => {
        setOpen(false); 
    };

    return (
        <AnimatePresence mode="wait">
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.3 }}
                    className='absolute top-14 left-0 w-full h-screen z-20'
                >
                    <div className=" font-semibold bg-white py-4 m-6 rounded-2xl">
                        <ul className='flex flex-col justify-center items-center gap-4'>
                            <li className="text-center"><a href="#" onClick={handleLinkClick} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Home</a></li>
                            <li className="text-center"><a href="#" onClick={handleLinkClick} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Designer</a></li>
                            <li className="text-center"><a href="#" onClick={handleLinkClick} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Type Rooms</a></li>
                            <li className="text-center"><a href="#" onClick={handleLinkClick} className="block py-1 w-[120px] font-semibold nav-link hover:text-[#143E08] transition-colors duration-300">Contact</a></li>
                        </ul>
                    </div>
                </motion.div>
            )}

        </AnimatePresence>
    )
}

export default ResponsiveMenu