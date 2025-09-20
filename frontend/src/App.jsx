import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App