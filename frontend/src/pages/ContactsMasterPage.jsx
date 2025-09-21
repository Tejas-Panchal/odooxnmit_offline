import React, { useEffect, useState } from 'react';
import { GetContacts } from '../features/ContactAuth';
import axios from 'axios';
import Logo from "../assests/logo_1.png";

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

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


// --- Re-usable Page Components ---

// Placeholder URLs for images
const profileImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80';


const PageHeader = ({ userRole }) => {
    const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
    const [isUserManagementDropdownOpen, setIsUserManagementDropdownOpen] = useState(false);

    const reportOptions = [
        { name: 'Balance Sheet', path: '/reports/sales' },
        { name: 'Profit and Loss', path: '/Profit_&_Loss' },
        { name: 'Inventory Report', path: '/reports/inventory' }
    ];

    const userManagementOptions = [
        { name: 'Create User', path: '/create-user' },
    ];

    const handleReportSelect = (reportPath) => {
        setIsReportDropdownOpen(false);
        window.location.href = reportPath;
    };

    const handleUserManagementSelect = (userPath) => {
        setIsUserManagementDropdownOpen(false);
        window.location.href = userPath;
    };

    // Close dropdown when clicking outside - only for Admin dropdowns
    useEffect(() => {
        if (userRole !== 'Admin') return;
        
        const handleClickOutside = (event) => {
            if (isReportDropdownOpen && !event.target.closest('.report-dropdown')) {
                setIsReportDropdownOpen(false);
            }
            if (isUserManagementDropdownOpen && !event.target.closest('.user-management-dropdown')) {
                setIsUserManagementDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isReportDropdownOpen, isUserManagementDropdownOpen, userRole]);

    return (
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
                    
                    {/* Product Master - Only for Accountant */}
                    {userRole === 'Accountant' && (
                        <a href="/Product_Masters" className="hover:text-gray-300">Product Master</a>
                    )}
                    
                    {/* User Management Dropdown - Only for Admin */}
                    {userRole === 'Admin' && (
                        <div className="relative user-management-dropdown">
                            <button 
                                onClick={() => setIsUserManagementDropdownOpen(!isUserManagementDropdownOpen)}
                                className="flex items-center space-x-1 hover:text-gray-300 focus:outline-none"
                            >
                                <span>User Management</span>
                                <ChevronDownIcon />
                            </button>
                            
                            {isUserManagementDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                                    <div className="py-2">
                                        {userManagementOptions.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleUserManagementSelect(option.path)}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                            >
                                                {option.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Report Dropdown - Only for Admin */}
                    {userRole === 'Admin' && (
                        <div className="relative report-dropdown">
                            <button 
                                onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
                                className="flex items-center space-x-1 hover:text-gray-300 focus:outline-none"
                            >
                                <span>Report</span>
                                <ChevronDownIcon />
                            </button>
                            
                            {isReportDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                                    <div className="py-2">
                                        {reportOptions.map((report, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleReportSelect(report.path)}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                            >
                                                {report.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <img src={profileImageUrl} alt="User Profile" className="h-10 w-10 rounded-full object-cover" />
                </nav>
            </div>
        </header>
    );
};

const PageSubHeader = () => (
    <div className="bg-white shadow-sm">
        
    </div>
);


// --- The Main Contacts Master Page Component ---

const ContactsMasterPage = () => {
    const [contacts, setContacts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [role, setRole] = useState(''); // Assuming role is stored in localStorage

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:5000/api/protected', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Protected data:", response.data);
                setRole(response.data.role);
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };

        const fetchContacts = async () => {
            try {
                setLoading(true);
                const data = await GetContacts();
                setContacts(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch contacts');
                console.error('Error fetching contacts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchContacts();
    }, []);

    console.log("Contacts Data:", contacts);

    const emptyRows = Array(1).fill({});

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader userRole={role} />
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            Loading contacts...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-red-500">
                                            {error}
                                        </td>
                                    </tr>
                                ) : contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            No contacts found. Create your first contact!
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((contact, index) => (
                                        <tr key={contact.contact_id || index} className="hover:bg-gray-50">
                                            <td className="p-3">
                                                <img 
                                                    src={contact.profile_image || profileImageUrl} 
                                                    alt={contact.name} 
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = profileImageUrl;
                                                    }}
                                                />
                                            </td>
                                            <td className="p-3 text-gray-800">{contact.name}</td>
                                            <td className="p-3 text-gray-800">{contact.email || 'N/A'}</td>
                                            <td className="p-3 text-gray-800">{contact.mobile || 'N/A'}</td>
                                            <td className="p-3 text-gray-800">
                                                {contact.address ? 
                                                    `${contact.address}${contact.city ? `, ${contact.city}` : ''}${contact.state ? `, ${contact.state}` : ''}${contact.pincode ? `, ${contact.pincode}` : ''}` 
                                                    : 'N/A'
                                                }
                                            </td>
                                        </tr>
                                    ))
                                )}
                                
                                {/* Empty rows for spacing when we have data */}
                                {!loading && !error && contacts.length > 0 && emptyRows.map((_, index) => (
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