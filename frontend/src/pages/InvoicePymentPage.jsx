import React from 'react';


// Placeholder Logo URL
const logoUrl = 'https://i.imgur.com/sC44oMA.png';

// Header component with this page's specific navigation
const PageHeader = () => (
    <header className="bg-[#714B67] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-3">
                <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full" />
                <h1 className="text-xl font-semibold">Shiv Accounts Cloud</h1>
            </div>
            <nav className="flex items-center space-x-6">
                <button className="bg-green-400 text-green-900 px-5 py-1.5 rounded-md font-bold hover:bg-green-300 transition-colors">
                    New
                </button>
                <button onClick={() => window.location.href = '/dashboard'} className="font-semibold hover:underline">Home</button>
                <button onClick={() => window.history.back()} className="font-semibold hover:underline">Back</button>
            </nav>
        </div>
    </header>
);

// Consistent Footer Component
const PageFooter = () => (
    <footer className="bg-[#714B67] text-white py-8 mt-10">
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
);

// Reusable component for form fields to keep the code clean
const FormField = ({ label, children, isNote = false }) => (
    <div className="flex items-center space-x-4">
        <label className={`w-32 font-semibold ${isNote ? 'text-blue-600 underline' : 'text-blue-500'}`}>
            {label}
        </label>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

// --- The Main Bill Payment Page Component ---

const InvoicePymentPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto py-8 px-4">
                <h2 className="text-3xl text-gray-500 mb-6">Bill Payment</h2>

                {/* Sub-header Bar */}
                <div className="bg-gray-200 flex items-center space-x-4 p-3 rounded-t-lg border-b-2 border-gray-300">
                    <button className="bg-green-400 text-green-900 px-4 py-1 rounded-md font-bold text-sm">
                        New
                    </button>
                    <span className="font-semibold text-gray-700">Pay/25/0001</span>
                </div>

                {/* Main Content Card */}
                <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow-lg">
                    
                    {/* Action Buttons & Status Indicators */}
                    <div className="flex justify-between items-center pb-8">
                        <div className="flex space-x-2">
                            <button className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800">Confirm</button>
                            {['Print', 'Send', 'Cancel'].map(action => (
                                <button key={action} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">{action}</button>
                            ))}
                        </div>
                        <div className="flex space-x-2 items-center font-semibold text-gray-500">
                             {['Draft', 'Confirm', 'Cancelled'].map(status => (
                                <span key={status} className="bg-gray-200 px-4 py-1.5 rounded-md border border-gray-300">{status}</span>
                             ))}
                        </div>
                    </div>

                    {/* The Payment Form */}
                    <div className="border-t pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            
                            {/* Left Column */}
                            <div className="space-y-8">
                                <FormField label="Payment Type">
                                    <div className="flex space-x-6 text-gray-700">
                                        <label className="flex items-center space-x-2"><input type="radio" name="paymentType" className="form-radio" /><span>Send</span></label>
                                        <label className="flex items-center space-x-2"><input type="radio" name="paymentType" className="form-radio" defaultChecked /><span>Receive</span></label>
                                    </div>
                                </FormField>
                                <FormField label="Partner Type">
                                    <div className="flex space-x-6 text-gray-700">
                                        <label className="flex items-center space-x-2"><input type="radio" name="partnerType" className="form-radio" /><span>Customer</span></label>
                                        <label className="flex items-center space-x-2"><input type="radio" name="partnerType" className="form-radio" defaultChecked /><span>Vendor</span></label>
                                    </div>
                                </FormField>
                                <FormField label="Partner">
                                    <input type="text" className="w-full border-b-2 border-gray-400 outline-none focus:border-[#714B67] py-1" />
                                </FormField>
                                <FormField label="Amount">
                                    <input type="text" className="w-full border-b-2 border-gray-400 outline-none focus:border-[#714B67] py-1" />
                                </FormField>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <FormField label="Date">
                                    <input type="text" className="w-full border-b-2 border-gray-400 outline-none focus:border-[#714B67] py-1" />
                                </FormField>
                                <FormField label="Payment Via">
                                     <input type="text" className="w-full border-b-2 border-gray-400 outline-none focus:border-[#714B67] py-1" />
                                </FormField>
                                <FormField label="Note" isNote>
                                     <input type="text" className="w-full border-b-2 border-gray-400 outline-none focus:border-[#714B67] py-1" />
                                </FormField>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <PageFooter />
        </div>
    );
};

export default InvoicePymentPage;