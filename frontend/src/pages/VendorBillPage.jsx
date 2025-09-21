
import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../assests/logo_1.png';

const PageHeader = () => (
    <header className="bg-[#714B67] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-3">
                <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full" />
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

const InfoField = ({ label, value, isInput = false, placeholder }) => (
    <div className="flex items-center">
        <label className="w-32 font-bold text-gray-700">{label}</label>
        {isInput ? (
            <input 
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                className="flex-1 bg-purple-100 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#714B67]"
            />
        ) : (
            <span className="font-semibold">{value}</span>
        )}
    </div>
);

const VendorBillPage = () => {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [error, setError] = useState(null);

    const billId = 1;

    const tableItems = [
        { sr: 1, product: '(from Product Master - Many to one)', qty1: 86, price1: '', qty2: 85, price2: 2300, untaxed: 1250, tax: '0%', amount: '5%', total: '17,857.5', isPlaceholder: true },
        { sr: 2, product: 'Table', qty1: 6, price1: 2300, qty2: 6, price2: 550, untaxed: 1950, tax: '10%', amount: '5%', total: '17,857.5' },
        { sr: 4, product: 'Chair', qty1: 50, price1: 46600, qty2: 3, price2: 800, untaxed: 1950, tax: '5%', amount: '150', total: '17,857.5' },
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

            const response = await axios.post(
                `http://127.0.0.1:5000/api/payments/initiate-vendor-bill-payment/${billId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { payment_url } = response.data;
            
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

            <main className="flex-grow container mx-auto py-8 px-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
                    <div className="space-y-3">
                        <InfoField label="PO No." value="P00001" />
                        <InfoField label="Vendor Name" value="Azure Interior" isInput />
                        <InfoField label="Reference" value="SUP-25-001" isInput />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className="w-24 font-bold">Bill Date</label>
                            <input type="text" placeholder="Date" className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]" />
                        </div>
                        <div className="flex items-center">
                            <label className="w-24 font-bold">Due Date</label>
                            <input type="text" placeholder="Date" className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-purple-300">
                    
                    <div className="flex items-center space-x-2 pb-4">
                        <button className="px-5 py-2 rounded-md font-semibold bg-white text-[#714B67] border-2 border-[#714B67]">Confirm</button>
                        {['Print', 'Send', 'Cancel'].map(action => (
                            <button key={action} className="px-5 py-2 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300">{action}</button>
                        ))}
                        <button
                            onClick={handlePayClick}
                            className="px-5 py-2 rounded-md font-semibold bg-[#714B67] text-white hover:bg-purple-800"
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? 'Processing...' : 'Pay'}
                        </button>
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="overflow-x-auto border-t-4 border-gray-600">
                        <table className="min-w-full w-full">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    {['Sr. No.', 'Product', 'Qty', 'Price', 'Qty', 'Untaxed Amount', 'Tax', 'Amount', 'Total'].map(header => (
                                        <th key={header} className="p-3 text-sm font-semibold text-left border-l border-gray-600 first:border-l-0">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableItems.map(item => (
                                    <tr key={item.sr} className={item.isPlaceholder ? 'text-red-500' : 'text-gray-800'}>
                                        <td className="p-3 border-r">{item.sr}</td>
                                        <td className="p-3 border-r">{item.product}</td>
                                        <td className="p-3 border-r">{item.qty1}</td>
                                        <td className="p-3 border-r">
                                            {item.isPlaceholder ? (
                                                <div className="flex items-center space-x-2 text-blue-500">
                                                    <label><input type="radio" name="delivery" /> Send</label>
                                                    <label><input type="radio" name="delivery" defaultChecked /> Receive</label>
                                                </div>
                                            ) : item.price1}
                                        </td>
                                        <td className="p-3 border-r">{item.qty2}</td>
                                        <td className="p-3 border-r">{item.price2}</td>
                                        <td className="p-3 border-r">{item.untaxed}</td>
                                        <td className="p-3 border-r">{item.tax}</td>
                                        <td className="p-3 border-r">{item.amount}</td>
                                        <td className="p-3 font-bold">{item.total}</td>
                                    </tr>
                                ))}
                                {Array(4).fill(0).map((_, idx) => (
                                    <tr key={`empty-${idx}`}><td colSpan="10" className="p-4 border-r">&nbsp;</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <PageFooter />
        </div>
    );
};

export default VendorBillPage;