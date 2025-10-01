import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Car, 
  Calendar, 
  Heart,
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react'
import { t } from '@/locales'

/**
 * UserNavMenu - User dropdown menu for homepage navbar
 * Simpler version than admin UserMenu
 */
export default function UserNavMenu({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-10 px-2 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden sm:inline-block">
            {user?.name || t('userMenu.fallback.name')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {user?.name || t('userMenu.fallback.name')}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || t('userMenu.fallback.email')}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* User Actions */}
        <DropdownMenuItem onClick={() => handleNavigate('/user/dashboard')}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigate('/user/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Hồ sơ cá nhân</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigate('/user/bookings')}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Đặt xe của tôi</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigate('/user/favorites')}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Xe yêu thích</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigate('/user/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('userMenu.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

