import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './pages/landing/App.jsx'
import Login from './pages/auth/Login.jsx'
import CreateAccount from './pages/auth/CreateAccount.jsx'
import Dashboard from './pages/student/StudentDashboard.jsx'
import ChooseCategory from './pages/landing/ChooseCategory.jsx'
import WatchDemo from './pages/landing/WatchDemo.jsx'
import ReadOverview from './pages/landing/ReadOverview.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/StudentDashboard" element={<Dashboard />} />
        <Route path="/ChooseCategory" element={<ChooseCategory />} />
        <Route path="/Watch-demo" element={<WatchDemo />} />
        <Route path="/Read-overview" element={<ReadOverview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
