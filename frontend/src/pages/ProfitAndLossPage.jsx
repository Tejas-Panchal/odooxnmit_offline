import React from 'react';

// --- Re-usable Components for this Page ---

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
                <button 
                onClick={() => window.history.back()}
                className="bg-gray-200 text-gray-800 px-5 py-1.5 rounded-md font-bold hover:bg-gray-300">Back</button>
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


// --- The Main Profit and Loss Page Component ---

const ProfitAndLossPage = () => {
    // Helper to generate empty rows for the table
    const emptyRows = Array(5).fill(0);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto py-8 px-4">
                <h2 className="text-3xl text-gray-500 mb-6">Profit and Loss Report</h2>
                
                {/* Action Bar */}
                <div className="bg-gray-200 p-3 flex justify-between items-center rounded-t-lg border-b-2 border-gray-300">
                    <button className="bg-green-400 text-green-900 px-5 py-1.5 rounded-md font-bold hover:bg-green-300">
                        Print
                    </button>
                    <div className="flex space-x-2">
                        {['Date', 'Month', 'Year'].map(filter => (
                             <button key={filter} className="bg-gray-400 text-white px-5 py-1.5 rounded-md font-semibold hover:bg-gray-500">{filter}</button>
                        ))}
                    </div>
                </div>

                {/* Report Table */}
                <div className="bg-white shadow-lg rounded-b-lg overflow-hidden">
                    <div className="grid grid-cols-2">
                        {/* Expenses Column */}
                        <div className="border-r border-gray-300">
                            {/* Header */}
                            <div className="grid grid-cols-2 bg-gray-600 text-white font-bold">
                                <div className="p-3">Expenses</div>
                                <div className="p-3 text-right">Amount</div>
                            </div>
                            {/* Body */}
                            <div>
                                <div className="grid grid-cols-2 border-b border-purple-200">
                                    <div className="p-3 font-semibold">Purchase Expense A/c</div>
                                    <div className="p-3 text-right font-semibold">17,857.50</div>
                                </div>
                                <div className="grid grid-cols-2 border-b border-purple-200">
                                    <div className="p-3 font-semibold">Other Expense A/c</div>
                                    <div className="p-3 text-right font-semibold">0.00</div>
                                </div>
                                {emptyRows.map((_, idx) => (
                                    <div key={idx} className="grid grid-cols-2 border-b border-purple-200 h-12">
                                        <div className="p-3">&nbsp;</div>
                                        <div className="p-3"></div>
                                    </div>
                                ))}
                            </div>
                            {/* Footer */}
                             <div className="font-bold">
                                <div className="grid grid-cols-2 border-b border-purple-200">
                                    <div className="p-3 text-blue-600">Net Profit</div>
                                    <div className="p-3 text-right">
                                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded">572.5</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="p-3 text-blue-600">Total</div>
                                    <div className="p-3 text-right">23,610</div>
                                </div>
                            </div>
                        </div>

                        {/* Income Column */}
                        <div>
                            {/* Header */}
                            <div className="grid grid-cols-2 bg-gray-600 text-white font-bold">
                                <div className="p-3">Income</div>
                                <div className="p-3 text-right">Amount</div>
                            </div>
                             {/* Body */}
                            <div>
                                <div className="grid grid-cols-2 border-b border-purple-200">
                                    <div className="p-3 font-semibold">Sales Income A/C</div>
                                    <div className="p-3 text-right font-semibold">23,610</div>
                                </div>
                                {emptyRows.map((_, idx) => (
                                    <div key={idx} className="grid grid-cols-2 border-b border-purple-200 h-12">
                                        <div className="p-3">&nbsp;</div>
                                        <div className="p-3"></div>
                                    </div>
                                ))}
                            </div>
                             {/* Footer */}
                             <div className="font-bold">
                                <div className="h-12 border-b border-purple-200"></div> {/* Spacer for Net Profit */}
                                <div className="grid grid-cols-2">
                                    <div className="p-3 text-blue-600">Total</div>
                                    <div className="p-3 text-right">23,610</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PageFooter />
        </div>
    );
};

export default ProfitAndLossPage;