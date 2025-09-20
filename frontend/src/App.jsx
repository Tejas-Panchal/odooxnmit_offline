import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import PurchaseOrderPage from './pages/PurchaseOrderPage'
import VendorBillPage from './pages/VendorBillPage'

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
        </Routes>
      </Router>
    </div>
  )
}

export default App