import { Link, useLocation } from 'react-router-dom'
import { Car, Users, LayoutDashboard, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { t } from '@/locales'
import UserMenu from './UserMenu'

const navigation = [
  { name: t('nav.dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
  { name: t('nav.vehicles'), href: '/admin/cars', icon: Car },
  { name: t('nav.users'), href: '/admin/users', icon: Users },
]

export default function Sidebar({ onLogout }) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-foreground">CarRental Admin</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r admin-sidebar transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 px-6 py-6 border-b">
            <Car className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">CarRental</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t px-3 py-4">
            <UserMenu 
              user={(() => {
                const userData = localStorage.getItem('user')
                if (userData) {
                  try {
                    return JSON.parse(userData)
                  } catch (error) {
                    console.error('Error parsing user data:', error)
                  }
                }
                return {
                  name: 'Quản Trị Viên',
                  email: 'admin@carental.com',
                  avatar: null
                }
              })()}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

