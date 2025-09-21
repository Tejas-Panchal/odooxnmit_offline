import React, { useState } from 'react';
import axios from 'axios';


const profileImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80';

// Placeholder Logo URL
const logoUrl = 'https://i.imgur.com/sC44oMA.png';

// Consistent Header Component
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
                <button 
                onClick={() => {
                    window.localStorage.removeItem('token');
                    window.location.href = '/login';
                }}
                className="bg-gray-200 text-gray-800 px-5 py-1.5 rounded-md font-bold hover:bg-gray-300 transition-colors">Log out</button>
                <img src={profileImageUrl} alt="User Profile" className="h-10 w-10 rounded-full object-cover" />
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

// Reusable component for the top form fields
const FormField = ({ label }) => (
    <div className="flex items-center space-x-4">
        <label className="w-40 flex-shrink-0 font-semibold text-blue-500">{label}</label>
        <input type="text" className="w-full border-b-2 border-gray-300 outline-none focus:border-[#714B67] py-1" />
    </div>
);

// --- The Main Customer Invoice Page Component ---
const CustomerInvoicePage = () => {
    // State to handle payment processing and errors
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [error, setError] = useState(null);

    // Hardcoded invoiceId for demonstration. In a real app, this would come from a URL parameter.
    const invoiceId = 1;

    // Data for the invoice table
    const tableItems = [
        { sr: 1, product: 'Table', hsn: '940370', account: 'Sales Income A/C', qty: 6, price: '3,100', untaxed: '18,600', tax: '10%', taxAmt: '1,850', total: '20,460' },
        { sr: 2, product: 'chair', hsn: '956300', account: 'Sales Income A/C', qty: 3, price: '1,000', untaxed: '3,000', tax: '5%', taxAmt: '160', total: '3,150' },
    ];

    const handlePayClick = async () => {
        setIsProcessingPayment(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authorization token missing. Please log in.");
                setIsProcessingPayment(false);
                return;
            }

            // Call the backend API to initiate payment
            const response = await axios.post(
                `http://127.0.0.1:5000/api/payments/initiate-customer-invoice-payment/${invoiceId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { payment_url } = response.data;
            
            // Redirect the user to the external payment link
            window.location.href = payment_url;

        } catch (err) {
            console.error("Payment initiation failed:", err);
            setError(err.response?.data?.msg || "An unexpected error occurred.");
            setIsProcessingPayment(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto py-8 px-4">
                <h2 className="text-3xl text-gray-500 mb-6">Customer Invoice</h2>
                
                {/* Top form section */}
                <div className="bg-white p-6 rounded-t-lg shadow-md border-x border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="space-y-4">
                            <FormField label="Customer Invoice No." />
                            <FormField label="Customer Name" />
                            <FormField label="Reference" />
                        </div>
                        <div className="space-y-4">
                            <FormField label="Invoice Data" />
                            <FormField label="Due date" />
                        </div>
                    </div>
                </div>

                {/* Actions and Status Bar */}
                <div className="bg-gray-200 p-3 flex justify-between items-center shadow-md border-x border-gray-200">
                    <div className="flex space-x-2">
                        <button className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800">Confirm</button>
                        <button className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800">Print</button>
                        <button className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800">Send</button>
                        <button className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800">Cancel</button>
                        <button 
                            onClick={handlePayClick}
                            className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800"
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? 'Processing...' : 'Pay'}
                        </button>
                    </div>
                    <div className="flex space-x-2 items-center font-semibold text-gray-600">
                        {['Draft', 'Confirm', 'Cancelled'].map(status => (
                            <span key={status} className="bg-white px-4 py-1.5 rounded-md border border-gray-300">{status}</span>
                        ))}
                    </div>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Invoice Table */}
                <div className="overflow-x-auto bg-white rounded-b-lg shadow-md border-x border-b border-gray-200">
                    <table className="min-w-full w-full">
                        <thead className="bg-gray-700 text-white">
                            <tr>
                                {['Sr. No.', 'Product', 'HSN No.', 'Account Name', 'Qty', 'Unit Price', 'Untaxed Amount', 'Tax', 'Tax Amount', 'Total'].map(header => (
                                    <th key={header} className="p-3 text-sm font-semibold text-left border-l border-gray-600 first:border-l-0">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-800">
                            {tableItems.map(item => (
                                <tr key={item.sr}>
                                    <td className="p-3 border-r">{item.sr}</td>
                                    <td className="p-3 border-r">{item.product}</td>
                                    <td className="p-3 border-r">{item.hsn}</td>
                                    <td className="p-3 border-r">{item.account}</td>
                                    <td className="p-3 border-r text-center">{item.qty}</td>
                                    <td className="p-3 border-r text-right">{item.price}</td>
                                    <td className="p-3 border-r text-right">{item.untaxed}</td>
                                    <td className="p-3 border-r text-center">{item.tax}</td>
                                    <td className="p-3 border-r text-right">{item.taxAmt}</td>
                                    <td className="p-3 font-bold text-right">{item.total}</td>
                                </tr>
                            ))}
                            {/* Empty rows for future entries */}
                            {Array(4).fill(0).map((_, idx) => (
                                <tr key={`empty-${idx}`}><td colSpan="10" className="p-4 border-r">&nbsp;</td></tr>
                            ))}
                        </tbody>
                        {/* Table Footer */}
                        <tfoot className="font-bold border-t-2 border-gray-300">
                            <tr>
                                <td colSpan="6" className="p-3 text-right pr-6">Total</td>
                                <td className="p-3 border-x text-right">21,600</td>
                                <td className="p-3"></td>
                                <td className="p-3 border-x text-right">2,010</td>
                                <td className="p-3 text-right">23,610</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </main>

            <PageFooter />
        </div>
    );
};

export default CustomerInvoicePage;