import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import CreateAccount from './CreateAccount.jsx'
import Dashboard from './StudentDashboard.jsx'
import ChooseCategory from './choose-category.jsx'
import LoginAdmin from './loginAdmin.jsx'
import AdminDashboard from './AdminDashborad.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/App" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/StudentDashboard" element={<Dashboard />} />
        <Route path="/ChooseCategory" element={<ChooseCategory />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
