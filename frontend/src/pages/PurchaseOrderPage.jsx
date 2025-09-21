import React from 'react';
import Logo from '../assests/logo_1.png';

// --- Re-usable Components for this Page ---

// Main Header Component (Consistent with other pages)
const PageHeader = () => (
    <header className="bg-[#714B67] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-3">
                <img src={Logo} alt="Logo" className="h-10 w-18 rounded-full" />
                <h1 className="text-xl font-semibold">Shiv Accounts Cloud</h1>
            </div>
            <nav className="flex items-center space-x-4">
                <button 
                onClick={() => window.location.href = '/Create_Product'}
                className="bg-green-400 text-green-900 px-5 py-1.5 rounded-md font-bold hover:bg-green-300 transition-colors">
                    New
                </button>
                <button 
                onClick={() => window.history.back()}
                className="text-white font-bold hover:underline">
                    Back
                </button>
            </nav>
        </div>
    </header>
);

// Main Footer Component (Consistent with other pages)
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

// --- The Main Purchase Order Page Component ---

const PurchaseOrderPage = () => {
    // Data for the table rows
    const tableItems = [
        {
            sr: 1,
            product: '(From Product Master - Many to one)',
            qty: 'Number',
            price: 'Monetery',
            untaxed: 'Monetery (3=1x2)',
            tax: '5%',
            taxAmt: 'Monetery (5=3x4)',
            total: 'Monetery (6=3+5)',
            isPlaceholder: true,
        },
        {
            sr: 2,
            product: 'Table',
            qty: 6,
            price: '2,300',
            untaxed: '13,800',
            untaxedNote: '(6 qty * 2300)',
            tax: '10%',
            taxAmt: '1,580',
            taxAmtNote: '(13800 * 10%)',
            total: '15,180',
            totalNote: '(13800 + 1580)',
        },
        {
            sr: 3,
            product: 'Chair',
            qty: 3,
            price: '850',
            untaxed: '2,650',
            untaxedNote: '(3 qty * 850)',
            tax: '5%',
            taxAmt: '127.50',
            taxAmtNote: '(2550 * 5%)',
            total: '2,677.5',
            totalNote: '(2550 + 127.5)',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto py-8 px-4">
                <h2 className="text-3xl text-gray-500 mb-6">Purchase Order</h2>

                {/* Main Card */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
                    
                    {/* Top Info Section */}
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <span className="font-bold text-lg">PO No.</span>
                            <span className="text-lg ml-4">P00001</span>
                        </div>
                        <div>
                             <span className="font-bold text-lg">PO Date</span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="pt-6 pb-8 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div>
                                <label className="text-red-400 font-['cursive'] text-2xl">Vendor Name</label>
                                <input 
                                    type="text"
                                    defaultValue="Azure Interior"
                                    className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]"
                                />
                                <p className="text-xs text-gray-500 mt-1">(from Contact Master - Many to one)</p>
                            </div>
                            <div>
                                <label className="text-red-400 font-['cursive'] text-2xl">PO Date</label>
                                <input 
                                    type="text"
                                    placeholder="Date"
                                    className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]"
                                />
                            </div>
                            <div>
                                <label className="text-red-400 font-['cursive'] text-2xl">Reference</label>
                                <input 
                                    type="text"
                                    defaultValue="REQ-25-0001"
                                    className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons & Status */}
                    <div className="flex justify-between items-center py-6">
                        <div className="flex space-x-2">
                             {['Confirm', 'Print', 'Send', 'Cancel'].map(action => (
                                <button key={action} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">{action}</button>
                            ))}
                            <button 
                            onClick={() => window.location.href = '/Vendor_Bill'}
                            className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-800">Create Bill</button>
                        </div>
                         <div className="flex space-x-4 items-center font-semibold text-gray-400">
                            <span className="text-teal-600">Draft</span>
                            <span>Confirm</span>
                            <span>Cancelled</span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-[50px_1fr_100px_120px_150px_100px_120px_150px] text-center font-bold text-red-400 border-y-2 border-gray-300">
                                {['Sr. No.', 'Product', 'Qty', 'Unit Price', 'Untaxed Amount', 'Tax', 'Tax Amount', 'Total'].map((header, i) => (
                                    <div key={header} className="py-4 border-x border-dashed">
                                        <p>{i+1}</p>
                                        <p>{header}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                             {tableItems.map(item => (
                                <div key={item.sr} className={`grid grid-cols-[50px_1fr_100px_120px_150px_100px_120px_150px] text-center items-center border-b border-gray-300 ${item.isPlaceholder ? 'text-gray-400' : 'text-gray-800'}`}>
                                    <div className="py-3 border-x border-dashed h-full">{item.sr}</div>
                                    <div className="py-3 border-r border-dashed h-full text-left px-4">{item.product}</div>
                                    <div className="py-3 border-r border-dashed h-full">{item.qty}</div>
                                    <div className="py-3 border-r border-dashed h-full">{item.price}</div>
                                    <div className="py-3 border-r border-dashed h-full">
                                        <p>{item.untaxed}</p>
                                        {item.untaxedNote && <p className="text-xs text-gray-500">{item.untaxedNote}</p>}
                                    </div>
                                    <div className="py-3 border-r border-dashed h-full">{item.tax}</div>
                                    <div className="py-3 border-r border-dashed h-full">
                                        <p>{item.taxAmt}</p>
                                        {item.taxAmtNote && <p className="text-xs text-gray-500">{item.taxAmtNote}</p>}
                                    </div>
                                    <div className="py-3 border-r border-dashed h-full">
                                        <p className="font-bold">{item.total}</p>
                                        {item.totalNote && <p className="text-xs text-gray-500">{item.totalNote}</p>}
                                    </div>
                                </div>
                            ))}

                            {/* Table Footer / Totals */}
                             <div className="grid grid-cols-[50px_1fr_100px_120px_150px_100px_120px_150px] text-center font-bold">
                                <div className="col-span-4 py-4 text-right pr-8 text-red-400 font-['cursive'] text-2xl">Total</div>
                                <div className="py-4 border-x border-dashed">16,350</div>
                                <div className="py-4 border-r border-dashed"></div>
                                <div className="py-4 border-r border-dashed">1,507.5</div>
                                <div className="py-4 border-r border-dashed bg-gray-200 border-2 border-gray-400 rounded-lg">17,857.5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PageFooter />
        </div>
    );
};

export default PurchaseOrderPage;