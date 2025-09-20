import React from 'react';

// --- Re-usable SVG Icons ---

const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
    </svg>
);


// --- Re-usable Page Components ---

// Placeholder URLs for images
const logoUrl = 'https://i.imgur.com/sC44oMA.png';
const profileImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80';


const PageHeader = () => (
    <header className="bg-[#5a2d5d] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
            <div className="flex items-center space-x-4">
                <button className="p-2"><HamburgerIcon /></button>
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center p-1">
                        <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                            <img src={logoUrl} alt="Logo" className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-xl font-semibold">Shiv Accounts Cloud</h1>
                </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="hover:text-gray-300">Purchase</a>
                <a href="#" className="hover:text-gray-300">Sale</a>
                <a href="#" className="hover:text-gray-300">Report</a>
                <img src={profileImageUrl} alt="User Profile" className="h-10 w-10 rounded-full object-cover" />
            </nav>
        </div>
    </header>
);

const PageSubHeader = () => (
    <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-2">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-bold text-lg">
                <ArrowLeftIcon />
                <span>Contacts</span>
            </button>
        </div>
    </div>
);


// --- The Main Contacts Master Page Component ---

const ContactsMasterPage = () => {

    // Sample data for the contacts table
    const contacts = [
        {
            img: 'https://i.pravatar.cc/40?u=azure',
            name: 'Azure Interior',
            email: 'azureinterior@gmail.com',
            phone: '7895456258',
            address: '53, Edward Colony, Highway Raod, West Bengal',
        },
        {
            img: 'https://i.pravatar.cc/40?u=nimesh',
            name: 'Nimesh Pathak',
            email: 'nimeshpathak@gmai.com',
            phone: '8945445177',
            address: '74/B Shikhar Heights, SP Road, Ahmedabad',
        },
    ];

    const emptyRows = Array(10).fill({});

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />
            <PageSubHeader />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto py-8 px-4">
                
                {/* New Button */}
                <div className="flex justify-end mb-4">
                    <button 
                    onClick={() => window.location.href = '/Create_Contact'}
                    className="flex items-center space-x-2 bg-green-300 text-green-800 font-bold py-2 px-4 rounded-full hover:bg-green-400 transition-colors">
                        <span>New</span>
                        <div className="bg-white rounded-full p-0.5">
                            <PlusIcon />
                        </div>
                    </button>
                </div>

                {/* Contacts Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Table Header */}
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    {['Image', 'Contact Name', 'Email', 'Phone Number', 'Address'].map(header => (
                                        <th key={header} className="p-3 text-left font-semibold tracking-wide border-t-2 border-gray-600">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            
                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200">
                                {contacts.map((contact, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-3">
                                            <img src={contact.img} alt={contact.name} className="h-8 w-8 rounded-full object-cover"/>
                                        </td>
                                        <td className="p-3 text-gray-800">{contact.name}</td>
                                        <td className="p-3 text-gray-800">{contact.email}</td>
                                        <td className="p-3 text-gray-800">{contact.phone}</td>
                                        <td className="p-3 text-gray-800">{contact.address}</td>
                                    </tr>
                                ))}
                                {/* Empty Rows for Visual Spacing */}
                                {emptyRows.map((_, index) => (
                                     <tr key={`empty-${index}`}>
                                        <td className="p-3 h-12">&nbsp;</td>
                                        <td className="p-3"></td>
                                        <td className="p-3"></td>
                                        <td className="p-3"></td>
                                        <td className="p-3"></td>
                                     </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactsMasterPage;