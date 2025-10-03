import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token) {
      navigate('/login')
      return
    }

    if (!userStr) {
      localStorage.removeItem('token')
      navigate('/login')
      return
    }

    try {
      const user = JSON.parse(userStr)
      // Check if user has admin role
      if (user.role !== 'admin') {
        // Redirect non-admin users to their appropriate dashboard
        if (user.role === 'user') {
          navigate('/user/dashboard')
        } else {
          navigate('/login')
        }
        return
      }
    } catch (error) {
      // If parsing fails, clear invalid data and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
      return
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      <div className="lg:pl-64">
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

