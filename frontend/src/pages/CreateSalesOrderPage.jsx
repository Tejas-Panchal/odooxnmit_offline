import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUsers } from '../features/Auth';
import { GetCustomers } from '../features/ContactAuth';

// --- Re-usable SVG Icons ---
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> );
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 hover:text-red-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg> );

// --- Consistent Page Header ---
const PageHeader = () => {
    const logoUrl = 'https://i.imgur.com/sC44oMA.png';
    const profileImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=464&q=80';
    return (
        <header className="bg-[#5a2d5d] text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center px-6 py-3">
                 <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center p-1 shadow-md">
                        <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                            <img src={logoUrl} alt="Logo" className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-xl font-semibold">Shiv Accounts Cloud</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    <button 
                    onClick={() => window.history.back()}
                    className="bg-gray-200 text-gray-800 px-5 py-1.5 rounded-md font-bold hover:bg-gray-300">back</button>
                    <img src={profileImageUrl} alt="User Profile" className="h-10 w-10 rounded-full object-cover" />
                </nav>
            </div>
        </header>
    );
};
const PageSubHeader = () => (
    <div className="bg-white shadow-sm"><div className="container mx-auto px-6 py-2"><button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-semibold"><ArrowLeftIcon /><span>Back</span></button></div></div>
);

// --- MOCK DATA (Replace with API calls) ---
const mockCustomers = [
    { id: 'cust_01', name: 'Nimesh Pathak' },
    { id: 'cust_02', name: 'Azure Interior' },
    { id: 'cust_03', name: 'The Furniture Co.' },
];
const mockProducts = [
    { id: 'prod_01', name: 'Office Chair', price: 1500, taxRate: 0.05 }, // 5%
    { id: 'prod_02', name: 'Study Desk', price: 2500, taxRate: 0.15 }, // 15%
    { id: 'prod_03', name: 'Conference Table', price: 12000, taxRate: 0.18 }, // 18%
    { id: 'prod_04', name: 'Bookshelf', price: 4500, taxRate: 0.12 }, // 12%
];


// --- The Main Create Sales Order Page Component ---
const CreateSalesOrderPage = () => {
    const [customer, setCustomer] = useState('');
    const [soDate, setSoDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
    const [lineItems, setLineItems] = useState([
        { id: 1, productId: '', qty: 1, unitPrice: 0, taxRate: 0 }
    ]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch customers on component mount
        GetCustomers()
            .then(data => setUsers(data))
            .catch(err => console.error("Error fetching customers:", err));
    }, []);

    console.log("Fetched Customers:", users);
        

    // --- Line Item Handlers ---
    const addLineItem = () => {
        setLineItems([...lineItems, { id: Date.now(), productId: '', qty: 1, unitPrice: 0, taxRate: 0 }]);
    };

    const removeLineItem = (id) => {
        if (lineItems.length <= 1) return; // Always keep at least one line
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const handleLineItemChange = (id, field, value) => {
        const updatedItems = lineItems.map(item => {
            if (item.id === id) {
                const newItem = { ...item, [field]: value };
                
                // If product is changed, auto-fill price and tax
                if (field === 'productId') {
                    const product = mockProducts.find(p => p.id === value);
                    if (product) {
                        newItem.unitPrice = product.price;
                        newItem.taxRate = product.taxRate;
                    } else {
                        newItem.unitPrice = 0;
                        newItem.taxRate = 0;
                    }
                }
                return newItem;
            }
            return item;
        });
        setLineItems(updatedItems);
    };

    // --- Auto-Calculation with useMemo for efficiency ---
    const totals = useMemo(() => {
        let untaxedTotal = 0;
        let taxTotal = 0;

        lineItems.forEach(item => {
            const untaxedAmount = item.qty * item.unitPrice;
            const taxAmount = untaxedAmount * item.taxRate;
            untaxedTotal += untaxedAmount;
            taxTotal += taxAmount;
        });

        return {
            untaxed: untaxedTotal,
            tax: taxTotal,
            grandTotal: untaxedTotal + taxTotal,
        };
    }, [lineItems]);
    
    // --- Form Submission Handlers ---
    const handleSaveAsDraft = () => {
        console.log("Saving as Draft:", { customer, soDate, lineItems, totals });
        alert("Order saved as draft!");
    };
    
    const handleConfirmOrder = () => {
        if (!customer) {
            alert("Please select a customer.");
            return;
        }
        console.log("Confirming Order:", { customer, soDate, lineItems, totals });
        alert("Order Confirmed!");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <PageHeader />
            <PageSubHeader />

            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="w-full max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-300">
                    <h2 style={{  color: '#008080' }} className="text-4xl mb-8">
                        Create Sales Order
                    </h2>

                    {/* --- Top Form Section --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 pb-6 border-b">
                        <div className="flex items-center space-x-4">
                            <label className="w-32 text-gray-700 font-medium text-right">Customer:</label>
                            <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                                <option value="">Select a Customer</option>
                                {users.map(user => <option key={user.contact_id} value={user.contact_id}>{user.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-32 text-gray-700 font-medium text-right">SO Date:</label>
                            <input type="date" value={soDate} onChange={(e) => setSoDate(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>

                    {/* --- Line Items Table --- */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {['Product', 'Qty', 'Unit Price', 'Tax', 'Untaxed Amount', 'Tax Amount', 'Total', ''].map(h => <th key={h} className="p-3 text-left text-sm font-semibold text-gray-600">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map(item => {
                                    const untaxedAmount = item.qty * item.unitPrice;
                                    const taxAmount = untaxedAmount * item.taxRate;
                                    const total = untaxedAmount + taxAmount;

                                    return (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2 w-1/3">
                                                <select value={item.productId} onChange={(e) => handleLineItemChange(item.id, 'productId', e.target.value)} className="w-full p-2 border border-gray-200 rounded-md bg-white">
                                                    <option value="">Select Product</option>
                                                    {mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-2"><input type="number" value={item.qty} onChange={(e) => handleLineItemChange(item.id, 'qty', parseInt(e.target.value) || 1)} className="w-20 p-2 border border-gray-200 rounded-md" /></td>
                                            <td className="p-2"><input type="number" value={item.unitPrice} onChange={(e) => handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-28 p-2 border border-gray-200 rounded-md" /></td>
                                            <td className="p-2 text-sm text-gray-600">{(item.taxRate * 100).toFixed(0)}%</td>
                                            <td className="p-2 text-gray-800">{untaxedAmount.toFixed(2)}</td>
                                            <td className="p-2 text-gray-800">{taxAmount.toFixed(2)}</td>
                                            <td className="p-2 font-semibold text-gray-900">{total.toFixed(2)}</td>
                                            <td className="p-2 text-center"><button onClick={() => removeLineItem(item.id)}><TrashIcon /></button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <button onClick={addLineItem} className="mt-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition">+ Add Product</button>

                    {/* --- Totals & Actions --- */}
                    <div className="mt-8 flex justify-between items-start">
                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-6">
                            <button onClick={handleSaveAsDraft} className="bg-gray-600 text-white font-semibold py-2 px-10 rounded-full hover:bg-gray-700 transition">Save as Draft</button>
                            <button onClick={handleConfirmOrder} className="bg-teal-500 text-white font-semibold py-2 px-10 rounded-full hover:bg-teal-600 transition">Confirm Order</button>
                        </div>

                        {/* Totals Section */}
                        <div className="w-1/3 space-y-2">
                            <div className="flex justify-between"><span className="text-gray-600">Untaxed Amount:</span><span className="font-semibold">{totals.untaxed.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Total Tax:</span><span className="font-semibold">{totals.tax.toFixed(2)}</span></div>
                            <div className="flex justify-between text-xl border-t pt-2 mt-2"><span className="font-bold">Grand Total:</span><span className="font-bold text-teal-600">₹{totals.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CreateSalesOrderPage;