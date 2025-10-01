import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import CarManagement from './pages/admin/CarManagement'
import UserManagement from './pages/admin/UserManagement'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/cars" element={<CarManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </div>
  )
}

export default App