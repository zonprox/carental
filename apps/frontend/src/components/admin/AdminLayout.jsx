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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col lg:pl-0 pt-16 lg:pt-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

