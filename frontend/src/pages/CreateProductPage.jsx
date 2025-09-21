import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateProduct, GetHSNs } from '../features/ProductAuth';
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

const PageSubHeader = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-2">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold"
                >
                    <ArrowLeftIcon />
                    <span>Back</span>
                </button>
            </div>
        </div>
    );
};

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
    const [name, setName] = React.useState('');
    const [type, setType] = React.useState('');
    const [hsn, setHsn] = React.useState('');
    const [hsnOptions, setHsnOptions] = React.useState([]);
    const [category, setCategory] = React.useState('');
    const [salesPrice, setSalesPrice] = React.useState('');
    const [salesTax, setSalesTax] = React.useState('');
    const [purchasePrice, setPurchasePrice] = React.useState('');
    const [purchaseTax, setPurchaseTax] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHSNs = async () => {
            if (!name.trim()) {
                setHsnOptions([]);
                return;
            }

            try {
                setLoading(true);
                const data = await GetHSNs(name);
                setHsnOptions(data.data);
                setError('');
            } catch (error) {
                console.error("Error fetching HSNs:", error);
                setHsnOptions([]);
                setError('Failed to fetch HSN codes');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchHSNs, 500); // Debounce API calls
        return () => clearTimeout(timeoutId);
    }, [name]);

    console.log("Fetched HSN Options:", hsnOptions);
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            setError('Product name is required');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            const result = await CreateProduct(name, type,salesPrice, category, purchasePrice, hsn, salesTax, purchaseTax);
            console.log("Product created successfully:", result);
            navigate("/Product_Masters");
        } catch (error) {
            console.error("Error creating product:", error);
            setError('Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

                    {/* Error Message Display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <FormField label="Product Name">
                                    <input 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Product Type">
                                    <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">Select Product Type</option>
                                        <option value="Goods">Goods</option>
                                        <option value="Services">Services</option>
                                    </select>
                                </FormField>
                                <FormField label="HSN/SAC Code">
                                   <select
                                   value={hsn}
                                   onChange={(e) => setHsn(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                   disabled={loading || hsnOptions.length === 0}
                                   >
                                       <option value="">
                                           {loading ? 'Loading HSN codes...' : 
                                            hsnOptions.length === 0 ? 'Enter product name to see HSN codes' : 
                                            'Select HSN/SAC Code'}
                                       </option>
                                       {hsnOptions.map((option, index) => (
                                           <option key={option.id || index} value={option.c}>
                                               {index + 1}. {option.c} - {option.n}
                                           </option>
                                       ))}
                                   </select>
                                </FormField>
                                <FormField label="Category">
                                    <input 
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <FormField label="Sale Price">
                                    <input 
                                    type="number"
                                    step="0.01"
                                    value={salesPrice}
                                    onChange={(e) => setSalesPrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Sales Tax">
                                    <input 
                                    type="text"
                                    value={salesTax}
                                    onChange={(e) => setSalesTax(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Purchase Price">
                                    <input 
                                    type="number"
                                    step="0.01"
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                                <FormField label="Purchase Tax">
                                    <input 
                                    type="text"
                                    value={purchaseTax}
                                    onChange={(e) => setPurchaseTax(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </FormField>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4 mt-10 pt-6">
                            <button 
                                type="button" 
                                onClick={() => navigate("/Product_Masters")}
                                className="bg-gray-600 text-white font-semibold py-2 px-10 rounded-full hover:bg-gray-700 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-teal-500 text-white font-semibold py-2 px-10 rounded-full hover:bg-teal-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateProductPage;