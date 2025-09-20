import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import PurchaseOrderPage from './pages/PurchaseOrderPage'
import VendorBillPage from './pages/VendorBillPage'
import InvoicePymentPage from './pages/InvoicePymentPage'
import SalesOrderPage from './pages/SalesOrderPage'
import CustomerInvoicePage from './pages/CustomerInvoicePage'
import ProfitAndLossPage from './pages/ProfitAndLossPage'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />}/>
          <Route path="/Purchase_Order" element={<PurchaseOrderPage />} />
          <Route path="/Vendor_Bill" element={<VendorBillPage />} />
          <Route path="/Invoice_Payment" element={<InvoicePymentPage />} />
          <Route path="/Sales_Order" element={<SalesOrderPage />} />
          <Route path="/Customer_Invoice" element={<CustomerInvoicePage />} />
          <Route path="/Profit_&_Loss" element={<ProfitAndLossPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App