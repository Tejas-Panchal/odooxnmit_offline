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

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


// --- Re-usable Page Components ---

// Placeholder URLs for images
const logoUrl = 'https://i.imgur.com/sC44oMA.png';
const profileImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=464&q=80';


const PageHeader = () => (
    <header className="bg-[#5a2d5d] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
            <div className="flex items-center space-x-4">
                <button className="p-2"><HamburgerIcon /></button>
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center p-1 shadow-md">
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
                <span>Back</span>
            </button>
        </div>
    </div>
);

// A reusable component for form fields
const FormField = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
        <label className="w-36 text-gray-700 font-medium sm:text-right mb-2 sm:mb-0 flex-shrink-0 mt-2">{label} :</label>
        <div className="flex-1">
            {children}
        </div>
    </div>
);


// --- The Main Create Contact Page Component ---

const CreateContactPage = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />
            <PageSubHeader />

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-300">
                    <h2 style={{ fontFamily: "'Brush Script MT', cursive", color: '#008080' }} className="text-4xl mb-8">
                        Create New Contact
                    </h2>

                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
                            {/* Left Column for Form Fields */}
                            <div className="md:col-span-2 space-y-6">
                                <FormField label="Contact Name">
                                    <input type="text" placeholder="Enter contact name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Email">
                                    <input type="email" placeholder="Enter email adress of contact" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Phone Number">
                                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Address">
                                    <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                                </FormField>
                            </div>

                            {/* Right Column for Profile Photo */}
                            <div className="flex flex-col items-center mt-6 md:mt-0">
                                <h3 className="font-semibold text-gray-700 mb-2">Profile Photo</h3>
                                <div className="w-48 h-56 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-50">
                                    <p className="text-sm text-gray-500 mb-2">Upload Photo</p>
                                    <UploadIcon />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4 mt-10 pt-6 border-t border-gray-200">
                            <button type="button" className="bg-gray-600 text-white font-semibold py-2 px-10 rounded-full hover:bg-gray-700 transition duration-300">
                                Cancel
                            </button>
                            <button type="submit" className="bg-teal-500 text-white font-semibold py-2 px-10 rounded-full hover:bg-teal-600 transition duration-300">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateContactPage;