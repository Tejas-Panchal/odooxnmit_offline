import React from 'react';
import { GetTaxes } from '../features/TaxAuth';

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


// --- The Main Taxes Master Page Component ---

const TaxesMasterPage = () => {

    const [taxes, setTaxes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchTaxes = async () => {
            try {
                setLoading(true);
                const data = await GetTaxes();
                setTaxes(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch taxes');
                console.error("Error fetching taxes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTaxes();
    }, []);

    console.log("Taxes Data:", taxes);
    const emptyRows = Array(2).fill({});

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />
            <PageSubHeader />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto py-8 px-4">
                
                {/* New Button */}
                <div className="flex justify-end mb-4">
                    <h3 className="text-3xl text-gray-500 mr-auto">Taxes Master</h3>
                    <button 
                    onClick={() => window.location.href = '/Create_New_Tax'}
                    className="flex items-center space-x-2 bg-green-300 text-green-800 font-bold py-2 px-4 rounded-full hover:bg-green-400 transition-colors">
                        <span>New</span>
                        <div className="bg-white rounded-full p-0.5">
                            <PlusIcon />
                        </div>
                    </button>
                </div>

                {/* Taxes Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Table Header */}
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    {['Tax Name', 'Tax Computation', 'Tax for', 'Tax Value'].map(header => (
                                        <th key={header} className="p-3 text-left font-semibold tracking-wide border-l border-gray-600 first:border-l-0">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            
                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">
                                            Loading taxes...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-red-500">
                                            {error}
                                        </td>
                                    </tr>
                                ) : taxes.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">
                                            No taxes found. Create your first tax!
                                        </td>
                                    </tr>
                                ) : (
                                    taxes.map((tax, index) => (
                                        <tr key={tax.tax_id || index} className="hover:bg-gray-50">
                                            <td className="p-3 border-r text-gray-800">{tax.tax_name}</td>
                                            <td className="p-3 border-r text-gray-800">{tax.computation_method}</td>
                                            <td className="p-3 border-r text-gray-800">{tax.applicable_on}</td>
                                            <td className="p-3 text-gray-800">
                                                {tax.computation_method === 'Percentage' ? `${tax.value}%` : `₹${tax.value}`}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                
                                {/* Empty Rows for Visual Spacing */}
                                {!loading && !error && taxes.length > 0 && emptyRows.map((_, index) => (
                                     <tr key={`empty-${index}`}>
                                        <td className="p-3 h-12 border-r">&nbsp;</td>
                                        <td className="p-3 border-r"></td>
                                        <td className="p-3 border-r"></td>
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

export default TaxesMasterPage;