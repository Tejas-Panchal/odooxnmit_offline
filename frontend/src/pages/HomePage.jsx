import React from 'react';
import Header from '../components/Header';

// Placeholder URLs for images - replace with your actual assets
const logoUrl = 'https://i.imgur.com/sC44oMA.png'; // Shiv Accounts Cloud Logo
const heroImageUrl = 'https://i.imgur.com/Ab8a2xG.png'; // Illustration for hero section
const visionImageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
const invoiceImageUrl = 'https://images.unsplash.com/photo-1599056007024-34736a69a669?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';
const balanceSheetImageUrl = 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
const stockLedgerImageUrl = 'https://images.unsplash.com/photo-1576185244589-9387f354d2c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';


// Reusable Arrow Icon for buttons
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);


const HomePage = () => {
    return (
        <div className="bg-white font-sans">
            {/* Header / Navbar */}
            <Header />

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="py-20 px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-800">Shiv Accounts Cloud</h1>
                        <p style={{ fontFamily: "'Brush Script MT', cursive" }} className="text-3xl text-gray-600 mt-2">
                            Elevate Efficiency with Innovative Financial Management
                        </p>
                    </div>
                    <div className="container mx-auto grid md:grid-cols-2 items-center gap-12 bg-[#e9e4e8] p-10 rounded-3xl">
                        <div className="flex justify-center">
                            <img src={heroImageUrl} alt="Financial Management Illustration" className="max-w-md w-full" />
                        </div>
                        <div className="text-gray-700">
                            <p className="text-lg leading-relaxed mb-8">
                                Take control of your business finances with Shiv Accounts Cloud—a powerful, cloud-based accounting system built for modern businesses like Shiv Furniture. From managing contacts and products to recording sales, purchases, and payments, everything is streamlined in one place. Generate real-time financial and stock reports with just a few clicks, and keep your business always audit-ready.
                            </p>
                            <button 
                            onClick={() => window.location.href = '/register'}
                            className="bg-[#017384] text-white font-bold py-3 px-8 rounded-full flex items-center hover:bg-teal-700 transition-transform hover:scale-105">
                                Get started <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Vision and Mission Section */}
                <section className="bg-[#7BA9A5] text-white py-20 px-6">
                    <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
                            <p className="mb-10 text-lg leading-relaxed">
                                At Shiv Accounts Cloud, we provide a tailored accounting system designed specifically for the furniture industry. Our platform enables clients to manage data effortlessly and generate important financial reports.
                            </p>
                            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg leading-relaxed">
                                Our mission is to facilitate the transition from outdated spreadsheets to an efficient cloud-based accounting system.
                            </p>
                        </div>
                        <div>
                            <img src={visionImageUrl} alt="Laptop with financial charts" className="rounded-lg shadow-2xl" />
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="bg-gray-700 text-white py-20 px-6">
                    <div className="container mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-3">Services</h2>
                        <div className="w-24 h-1 bg-teal-500 mx-auto mb-12"></div>
                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <img src={invoiceImageUrl} alt="Invoice Generation" className="h-56 w-full object-cover rounded-md mb-6" />
                                <h3 className="text-2xl font-semibold">Invoice Generation</h3>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg border-4 border-blue-400">
                                <img src={balanceSheetImageUrl} alt="Balance Sheet Generation" className="h-56 w-full object-cover rounded-md mb-6" />
                                <h3 className="text-2xl font-semibold">Balance sheet Generation</h3>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <img src={stockLedgerImageUrl} alt="Stock Ledger Generation" className="h-56 w-full object-cover rounded-md mb-6" />
                                <h3 className="text-2xl font-semibold">Stock Ledger Generation</h3>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Newsletter Section */}
                <section className="bg-[#F3EFF2] py-20 px-6 text-center">
                    <div className="container mx-auto max-w-2xl">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Connect with us</h2>
                        <p className="text-gray-600 mb-8">
                            Subscribe to our NewsLetter to stay updated on latest developments
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email" className="flex-grow border rounded-full px-6 py-3 outline-none focus:border-[#714B67]" />
                            <button className="bg-[#017384] text-white font-bold py-3 px-8 rounded-full hover:bg-teal-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-[#5a2d5d] text-white py-12">
                <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-sm px-6">
                    <div>
                        <h4 className="font-semibold mb-3">Quick links</h4>
                        <ul className="space-y-2">
                            {Array(2).fill("link 1").map((link, idx) => (
                                <li key={idx} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">{link}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">FAQs</h4>
                        <ul className="space-y-2">
                            {Array(2).fill("link 1").map((link, idx) => (
                                <li key={idx} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">{link}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">About</h4>
                        <ul className="space-y-2">
                            {Array(2).fill("link 1").map((link, idx) => (
                                <li key={idx} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">{link}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Features</h4>
                        <ul className="space-y-2">
                            {Array(2).fill("link 1").map((link, idx) => (
                                <li key={idx} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">{link}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Social Media</h4>
                        <ul className="space-y-2">
                            {Array(2).fill("link 1").map((link, idx) => (
                                <li key={idx} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">{link}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;