import React, { useState } from 'react';

// Close Icon SVG
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DashboardNav = ({ isOpen, onClose }) => {
    const [openMenu, setOpenMenu] = useState(null);

    const menuItems = {
        Purchase: ['Purchase Order', 'Purchase Bill', 'Payment'],
        Sale: ['Sale Order', 'Sale Invoice', 'Receipt'],
        Report: ['Profit & Loss', 'Balance Sheet', 'Stock Statement'],
    };

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    // If the nav is not open, render nothing.
    if (!isOpen) return null;

    return (
        // Fullscreen overlay
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            
            {/* Menu Container */}
            <div className="bg-[#2a2a2a] text-white border-2 border-gray-500 rounded-2xl shadow-lg w-full max-w-3xl font-['cursive'] relative">
               
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close menu"
                >
                    <CloseIcon />
                </button>
               
                {/* Main Menu Titles */}
                <div className="grid grid-cols-3 text-center">
                    {Object.keys(menuItems).map((menu, index) => (
                        <div key={menu} className={`py-4 ${index < 2 ? 'border-r border-gray-500' : ''}`}>
                            <h2 className="text-3xl font-bold">{menu}</h2>
                            <button onClick={() => toggleMenu(menu)} className="text-sm text-gray-400 hover:text-teal-400">
                                (Open on Click)
                            </button>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t-2 border-gray-500"></div>

                {/* Submenu Content */}
                <div className="grid grid-cols-3 text-center min-h-[160px]">
                     {Object.keys(menuItems).map((menu, index) => (
                        <div key={`${menu}-items`} className={`py-4 px-2 ${index < 2 ? 'border-r border-dashed border-gray-600' : ''}`}>
                            {openMenu === menu && (
                                <ul className="space-y-3 text-lg">
                                    {menuItems[menu].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="hover:text-teal-400 transition-colors">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardNav;