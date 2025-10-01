import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserDashboard from './pages/user/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import CarManagement from './pages/admin/CarManagement'
import UserManagement from './pages/admin/UserManagement'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<CarManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </div>
  )
}

export default App