import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}

