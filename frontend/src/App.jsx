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
import CreateProductPage from './pages/CreateProductPage'
import ContactsMasterPage from './pages/ContactsMasterPage'
import CreateContactPage from './pages/CreateContactPage'
import CreateUser from './pages/CreateUser'
import ProductMastersPage from './pages/ProductMastersPage'

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
          <Route path="/Create_Product" element={<CreateProductPage />} />
          <Route path="/Contacts_Master" element={<ContactsMasterPage />} />
          <Route path="/Create_Contact" element={<CreateContactPage />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/Product_Masters" element={<ProductMastersPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App