import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GetSalesOrders } from '../features/SalesOrderAuth';


// A unique header specifically for the Sales Order page
const PageHeader = () => (
    <div className="bg-[#5a2d5d] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-bold">Sales Order</h1>
            </div>
            <nav className="flex items-center space-x-4">
                <button 
                onClick={() => window.location.href = '/Create_Sales_Order'}
                className="bg-green-400 text-green-900 px-5 py-1.5 rounded-md font-bold hover:bg-green-300 transition-colors">New</button>
                
                <button 
                onClick={() => window.history.back()}
                className="bg-gray-200 text-gray-800 px-5 py-1.5 rounded-md font-bold hover:bg-gray-300">Back</button>
            </nav>
        </div>
    </div>
);

// A reusable Form Field component for the top section
const InfoField = ({ label, children }) => (
    <div>
        <label className="text-red-500 font-['cursive'] text-2xl">{label}</label>
        {children}
    </div>
);



const SalesOrderPage = () => {
    // Data for the items table
    const [tableItems, setTableItems] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchSalesOrders = async () => {
            try {
                const orders = await GetSalesOrders();
                setTableItems(orders);
            } catch (error) {
                console.error("Error fetching sales orders:", error);
            }
        };

        fetchSalesOrders();
    }, []);

    console.log("Sales Orders Data:", tableItems);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <PageHeader />

            {/* Main Content Area */}
            <main className="container mx-auto py-8 px-4">
                
                {/* Main Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-purple-300">
                
                    {/* Top Information Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pb-6 border-b border-gray-200">
                        {/* Left Side */}
                        <div className="space-y-4">
                            <div className="flex items-baseline">
                                <label className="text-red-500 font-['cursive'] text-2xl w-40 flex-shrink-0">SO No.</label>
                                <span className="font-bold text-lg mr-2">S00001</span>
                                <span className="text-gray-500 text-sm">(auto generate PO Number + 1 of last order)</span>
                            </div>
                            <InfoField label="Customer Name">
                                <input type="text" defaultValue="Nimesh Pathak" className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]" />
                                <p className="text-xs text-gray-500 mt-1">(From Contact Master - Many to one)</p>
                            </InfoField>
                            <InfoField label="Reference">
                                <input type="text" defaultValue="Alpha numeric (text)" className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]" />
                            </InfoField>
                        </div>
                        {/* Right Side */}
                        <div>
                             <InfoField label="SO Date">
                                <input type="text" placeholder="Date" className="w-full border-b-2 py-1 outline-none focus:border-[#714B67]" />
                            </InfoField>
                        </div>
                    </div>

                    {/* Action Buttons & Status */}
                    <div className="flex justify-between items-center py-6">
                        <div className="flex space-x-2">
                            <button 
                            onClick={() => window.location.href = '/Customer_Invoice'}
                            className="bg-[#714B67] text-white px-6 py-2 rounded-md font-semibold border-2 border-purple-800">Confirm</button>
                            {['Print', 'Send', 'Cancel'].map(action => (
                                <button key={action} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">{action}</button>
                            ))}
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
                            <div className="grid grid-cols-[80px_1fr_100px_120px_150px_100px_120px_150px] text-center font-bold text-red-500 border-y-2 border-gray-300">
                                <div className="py-2 border-x border-dashed">Sr. No.</div>
                                <div className="py-2 border-r border-dashed">(from Product Master - Many to one)</div>
                                <div className="py-2 border-r border-dashed"><p>1</p>Qty</div>
                                <div className="py-2 border-r border-dashed"><p>2</p>Unit Price</div>
                                <div className="py-2 border-r border-dashed"><p>3</p>Untaxed Amount</div>
                                <div className="py-2 border-r border-dashed"><p>4</p>Tax</div>
                                <div className="py-2 border-r border-dashed"><p>5</p>Tax <p className="text-xs font-normal">(5=3x4)</p></div>
                                <div className="py-2 border-r border-dashed"><p>6</p>Total <p className="text-xs font-normal">(6=3+5)</p></div>
                            </div>

                            {/* Table Body */}
                             {tableItems.map(item => (
                                <div key={item.sr} className={`grid grid-cols-[80px_1fr_100px_120px_150px_100px_120px_150px] text-center items-center border-b border-gray-300 text-gray-800`}>
                                    <div className="py-3 border-x border-dashed h-full">{item.sr}</div>
                                    <div className="py-3 border-r border-dashed h-full text-left px-4">{item.product}</div>
                                    <div className="py-3 border-r border-dashed h-full">{item.qty}</div>
                                    <div className="py-3 border-r border-dashed h-full">{item.price}</div>
                                    <div className="py-3 border-r border-dashed h-full">
                                        <p>{item.untaxed}</p>
                                        {item.untaxedNote && <p className="text-xs text-gray-500">{item.untaxedNote}</p>}
                                    </div>
                                    <div className="py-3 border-r border-dashed h-full text-red-500">{item.tax}</div>
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
                            
                            {/* Empty rows for spacing */}
                            {Array(5).fill(0).map((_, idx) => (
                                <div key={`empty-${idx}`} className="grid grid-cols-[80px_1fr_100px_120px_150px_100px_120px_150px] border-b border-gray-300">
                                    <div className="py-4 border-x border-dashed h-full">&nbsp;</div>
                                    <div className="py-4 border-r border-dashed h-full col-span-7"></div>
                                </div>
                            ))}

                            {/* Table Footer / Totals */}
                             <div className="grid grid-cols-[80px_1fr_100px_120px_150px_100px_120px_150px] text-center font-bold">
                                <div className="col-span-4 py-4 text-right pr-8 text-red-500 font-['cursive'] text-2xl">Total</div>
                                <div className="py-4 border-x border-dashed">21,600</div>
                                <div className="py-4 border-r border-dashed"></div>
                                <div className="py-4 border-r border-dashed">2,010</div>
                                <div className="py-4 border-r border-dashed bg-gray-200 border-2 border-gray-400 rounded-lg">23,610</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default SalesOrderPage;