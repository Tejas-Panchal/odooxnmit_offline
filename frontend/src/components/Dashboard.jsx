import React from 'react';

// Reusable component for each statistic card
const StatDisplay = ({ period, value, change }) => (
    <div className="text-center p-2">
        <p className="text-gray-500 text-sm">{period}</p>
        <p className="text-3xl font-bold text-gray-800 my-1">₹{value}</p>
        {change && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {change}%
            </span>
        )}
    </div>
);


const Dashboard = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-teal-300 w-full">
            {/* Total Invoice */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-[#714B67] tracking-wider uppercase mb-4">
                    TOTAL INVOICE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatDisplay period="Last 24 hours" value="0" />
                    <StatDisplay period="Last 7 Days" value="23,610" />
                    <StatDisplay period="Last 30 Days" value="23,610" />
                </div>
            </div>
            
            <hr className="my-6" />

            {/* Total Purchase */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-[#714B67] tracking-wider uppercase mb-4">
                    TOTAL PURCHASE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatDisplay period="Last 24 hours" value="0" change={-83.33} />
                    <StatDisplay period="Last 7 Days" value="17,857" />
                    <StatDisplay period="Last 30 Days" value="17,857" />
                </div>
            </div>
            
            <hr className="my-6" />

            {/* Total Payment */}
            <div>
                <h3 className="text-sm font-bold text-[#714B67] tracking-wider uppercase mb-4">
                    TOTAL PAYMENT
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatDisplay period="Last 24 hours" value="0" change={-80.00} />
                    <StatDisplay period="Last 7 Days" value="5,752" />
                    <StatDisplay period="Last 30 Days" value="5,752" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;