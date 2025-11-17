import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface ResponsiveMenuProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    customerId?: string;
}

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({ open, setOpen, customerId }) => {
    const [typeRoomsOpen, setTypeRoomsOpen] = useState(false);

    const handleLinkClick = () => setOpen(false);
    const toggleTypeRooms = () => setTypeRoomsOpen((prev) => !prev);

    const safeCustomerLink = customerId ? `/customer/${customerId}` : "/";

    return (
        <AnimatePresence mode="wait">
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-14 left-0 w-full bg-white z-20 px-6 py-6"
                >
                    <ul className="flex flex-col gap-2 font-semibold">
                        <li>
                            <Link
                                to={safeCustomerLink}
                                onClick={handleLinkClick}
                                className="block py-2 w-full text-center hover:text-[#143E08] transition"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={safeCustomerLink}
                                onClick={handleLinkClick}
                                className="block py-2 w-full text-center hover:text-[#143E08] transition"
                            >
                                About
                            </Link>
                        </li>

                        {/* Type Rooms Accordion */}
                        <li className="w-full">
                            <button
                                onClick={toggleTypeRooms}
                                className="w-full flex justify-center items-center gap-2 py-2 hover:text-[#143E08] transition"
                            >
                                Type Rooms <i className={`bi bi-caret-${typeRoomsOpen ? "up" : "down"}-fill text-xs`}></i>
                            </button>

                            <AnimatePresence>
                                {typeRoomsOpen && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col gap-1 overflow-hidden bg-white mt-2 rounded-lg shadow-inner"
                                    >
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/bedroom` : "/bedroom"}
                                                onClick={handleLinkClick}
                                                className="block py-2 text-center hover:bg-[#E6F3E6] hover:font-semibold"
                                            >
                                                Bedroom
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/livingroom` : "/livingroom"}
                                                onClick={handleLinkClick}
                                                className="block py-2 text-center hover:bg-[#E6F3E6] hover:font-semibold"
                                            >
                                                Living Room
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={customerId ? `/customer/${customerId}/kitchen` : "/kitchen"}
                                                onClick={handleLinkClick}
                                                className="block py-2 text-center hover:bg-[#E6F3E6] hover:font-semibold"
                                            >
                                                Kitchen
                                            </Link>
                                        </li>
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>

                        <li>
                            <Link
                                to={customerId ? `/customer/${customerId}/contact` : "/contact"}
                                onClick={handleLinkClick}
                                className="block py-2 w-full text-center hover:text-[#143E08] transition"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResponsiveMenu;
