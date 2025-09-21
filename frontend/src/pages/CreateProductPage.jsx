import React from 'react';
import Logo from '../assests/logo_1.png';

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




// Placeholder URLs for images
const profileImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80';


const PageHeader = () => (
    <header className="bg-[#5a2d5d] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
            <div className="flex items-center space-x-4">
                <button className="p-2"><HamburgerIcon /></button>
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center p-1">
                        <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                            <img src={Logo} alt="Logo" className="h-10 w-18 rounded-full" />
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
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold">
                <ArrowLeftIcon />
                <span>Back</span>
            </button>
        </div>
    </div>
);

// A reusable component for form fields to keep the form code DRY
const FormField = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <label className="w-36 text-gray-700 font-medium sm:text-right mb-2 sm:mb-0 flex-shrink-0">{label} :</label>
        <div className="flex-1">
            {children}
        </div>
    </div>
);


// --- The Main Create Product Page Component ---

const CreateProductPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />
            <PageSubHeader />

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-300">
                    <h2 style={{ fontFamily: "'Brush Script MT', cursive", color: '#008080' }} className="text-4xl mb-8">
                        Create New Product
                    </h2>

                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <FormField label="Product Name">
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Product Type">
                                    <div className="flex space-x-6">
                                        <label className="flex items-center space-x-2"><input type="radio" name="productType" className="form-radio accent-purple-600" defaultChecked /><span>Goods</span></label>
                                        <label className="flex items-center space-x-2"><input type="radio" name="productType" className="form-radio accent-purple-600" /><span>Services</span></label>
                                    </div>
                                </FormField>
                                <FormField label="HSN/SAC Code">
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Category">
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                                        <option>select category</option>
                                        <option>Category 1</option>
                                        <option>Category 2</option>
                                    </select>
                                </FormField>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <FormField label="Sale Price">
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Sales Tax">
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Purchase Price">
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Purchase Tax">
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4 mt-10 pt-6">
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

export default CreateProductPage;