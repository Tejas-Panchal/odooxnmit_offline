import React, { useState } from 'react';

// --- Re-usable Components for this Page ---

// Close Icon SVG for the Nav Menu
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Navigation Menu Overlay Component (Dark Theme)
const DashboardNav = ({ isOpen, onClose }) => {
    const [openMenu, setOpenMenu] = useState(null);

    const menuItems = {
        Purchase: ['Purchase_Order', 'Purchase_Bill', 'Payment'],
        Sale: ['Sale_Order', 'Sale_Invoice', 'Receipt'],
        Report: ['Profit_&_Loss', 'Balance_Sheet', 'Stock_Statement'],
    };

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2a2a2a] text-white border-2 border-gray-600 rounded-2xl shadow-xl w-full max-w-3xl font-['cursive'] relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close menu">
                    <CloseIcon />
                </button>
                <div className="grid grid-cols-3 text-center">
                    {Object.keys(menuItems).map((menu, index) => (
                        <div key={menu} className={`py-4 ${index < 2 ? 'border-r border-gray-600' : ''}`}>
                            <h2 className="text-3xl font-bold">{menu}</h2>
                            <button onClick={() => toggleMenu(menu)} className="text-sm text-gray-400 hover:text-teal-400">(Open on Click)</button>
                        </div>
                    ))}
                </div>
                <div className="border-t-2 border-gray-600"></div>
                <div className="grid grid-cols-3 text-center min-h-[160px]">
                    {Object.keys(menuItems).map((menu, index) => (
                        <div key={`${menu}-items`} className={`py-4 px-2 ${index < 2 ? 'border-r border-dashed border-gray-700' : ''}`}>
                            {openMenu === menu && (
                                <ul className="space-y-3 text-lg">
                                    {menuItems[menu].map((item) => <li key={item}><a href={`/${item}`} className="hover:text-teal-400 transition-colors">{item}</a></li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// Stat Display Component
const StatDisplay = ({ period, value, change }) => (
    <div className="text-center p-2">
        <p className="text-gray-500 text-sm">{period}</p>
        <p className="text-3xl font-bold text-gray-800 my-1">₹{value}</p>
        {change && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {change}%
            </span>
        )}
    </div>
);

// Main Dashboard Content Card
const DashboardContent = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-teal-300 w-full">
        <div className="mb-6">
            <h3 className="text-sm font-bold text-[#714B67] tracking-wider uppercase mb-4">TOTAL INVOICE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatDisplay period="Last 24 hours" value="0" />
                <StatDisplay period="Last 7 Days" value="23,610" />
                <StatDisplay period="Last 30 Days" value="23,610" />
            </div>
        </div>
        <hr className="my-6" />
        <div className="mb-6">
            <h3 className="text-sm font-bold text-[#714B67] tracking-wider uppercase mb-4">TOTAL PURCHASE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatDisplay period="Last 24 hours" value="0" change={-83.33} />
                <StatDisplay period="Last 7 Days" value="17,857" />
                <StatDisplay period="Last 30 Days" value="17,857" />
            </div>
        </div>
        <hr className="my-6" />
        <div>
            <h3 className="text-sm font-bold text-[#714B67] tracking-wider uppercase mb-4">TOTAL PAYMENT</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatDisplay period="Last 24 hours" value="0" change={-80.00} />
                <StatDisplay period="Last 7 Days" value="5,752" />
                <StatDisplay period="Last 30 Days" value="5,752" />
            </div>
        </div>
    </div>
);

// --- The Final Dashboard Page ---
const DashboardPage = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const logoUrl = 'https://i.imgur.com/sC44oMA.png';

    return (
        <>
            {/* The Navigation overlay is now at the top level */}
            <DashboardNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
            
            <div className="flex flex-col min-h-screen bg-gray-100">
                {/* Header (Purple Theme) */}
                <header className="bg-[#714B67] text-white shadow-lg">
                    <div className="container mx-auto flex justify-between items-center px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full" />
                            <h1 className="text-xl font-semibold">Shiv Accounts Cloud</h1>
                        </div>
                        <nav>
                            <button onClick={() => setIsNavOpen(true)} className="bg-white text-[#714B67] px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                Menu
                            </button>
                            <button className="ml-6 bg-white text-[#714B67] px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            >Log Out</button>
                        </nav>
                    </div>
                </header>
                
                {/* Main Content Area */}
                <main className="flex-grow flex flex-col items-center justify-center py-10 px-4">
                    <h2 className="text-4xl font-bold text-center mb-8 font-['cursive'] text-gray-700">Dashboard</h2>
                    <div className="max-w-4xl w-full">
                        <DashboardContent />
                    </div>
                </main>

                {/* Footer (Purple Theme) */}
                <footer className="bg-[#714B67] text-white py-8">
                    <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-sm px-6">
                        {['Quick links', 'FAQs', 'About', 'Features', 'Social Media'].map((title) => (
                            <div key={title}>
                                <h4 className="font-semibold mb-2">{title}</h4>
                                <ul className="space-y-1">
                                    {Array(2).fill("link 1").map((link, idx) => <li key={idx} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">{link}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </footer>
            </div>
        </>
    );
};

export default DashboardPage;