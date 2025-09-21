import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateTax } from '../features/TaxAuth';
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
        
    </div>
);

// A reusable component for form fields to keep the form code DRY
const FormField = ({ label }) => (
    <div className="flex items-center space-x-4">
        <label className="w-40 text-gray-700 font-medium text-right flex-shrink-0">{label} :</label>
        <div className="flex-1">
            <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
        </div>
    </div>
);


// --- The Main Create New Tax Page Component ---

const CreateNewTaxPage = () => {
    const [name, setName] = React.useState('');
    const [computation, setComputation] = React.useState('');
    const [taxFor, setTaxFor] = React.useState('');
    const [value, setValue] = React.useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CreateTax(name, computation, taxFor, value);
            navigate('/Taxes_Master');
        } catch (error) {
            console.error("Error creating tax:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />
            <PageSubHeader />

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-300">
                    <h2 style={{ fontFamily: "'Brush Script MT', cursive", color: '#008080' }} className="text-4xl mb-10">
                        Create New Tax
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6 max-w-lg mx-auto">
                            <label className="w-40 text-gray-700 font-medium text-right flex-shrink-0">Tax Name :</label>   
                                <input 
                                    type="text" 
                                    placeholder='Tax Name'
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
        
                            <label className="w-40 text-gray-700 font-medium text-right flex-shrink-0">Computation Method :</label>
                                <select
                                    value={computation}
                                    onChange={(e) => setComputation(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Select Computation Method</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Percentage">Percentage</option>
                                </select>
                            
                            <label className="w-40 text-gray-700 font-medium text-right flex-shrink-0">Tax for :</label>
                                <select
                                    value={taxFor}
                                    onChange={(e) => setTaxFor(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Select Tax Category</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Purchase">Purchase</option>
                                    <option value="Both">Both</option>
                                </select>
                            
                            <label className="w-40 text-gray-700 font-medium text-right flex-shrink-0">Value :</label>  
                                <input 
                                    type="number" 
                                    placeholder='Tax Value'
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                           
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

export default CreateNewTaxPage;