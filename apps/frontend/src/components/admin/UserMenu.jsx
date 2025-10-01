import { useNavigate } from 'react-router-dom'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeProvider'
import { 
  User, 
  LogOut, 
  Palette,
  Sun,
  Moon,
  Monitor,
  ChevronsUpDown,
  Settings,
  Bell,
  LifeBuoy,
  Shield,
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Home,
} from 'lucide-react'
import { t } from '@/locales'

export default function UserMenu({ user, onLogout }) {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  // User data with fallbacks
  const userData = {
    name: user?.name || t('userMenu.fallback.name'),
    email: user?.email || t('userMenu.fallback.email'),
    avatar: user?.avatar || null,
    initials: user?.name 
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : t('userMenu.fallback.initials')
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  // Loading skeleton
  if (!user && !userData.name) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg">
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1">
          <div className="h-3 w-16 bg-muted rounded animate-pulse mb-1" />
          <div className="h-2 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 px-2 h-auto py-2 rounded-full hover:bg-accent data-[state=open]:bg-accent transition-colors ring-2 ring-primary/10 hover:ring-primary/20"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {userData.initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-foreground">{userData.name}</span>
            <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 rounded-lg shadow-lg" 
        side="right"
        align="end" 
        sideOffset={8}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-3 text-left bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
            <Avatar className="h-10 w-10 ring-2 ring-orange-200 dark:ring-orange-800">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-semibold text-base">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                <span className="truncate font-semibold text-sm text-foreground">{userData.name}</span>
              </div>
              <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Admin Quick Access */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigate('/admin/dashboard')} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Tổng quan</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/admin/cars')} className="cursor-pointer">
            <Car className="mr-2 h-4 w-4" />
            <span>Quản lý xe</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/admin/users')} className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>Quản lý người dùng</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/admin/bookings')} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>Quản lý đơn thuê</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Go to Homepage */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigate('/')} className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            <span>Về trang chủ</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{t('userMenu.profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('userMenu.settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>{t('userMenu.notifications')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Appearance Theme */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Palette className="mr-2 h-4 w-4" />
              <span>Giao diện</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-lg w-48">
              <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Sáng</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Tối</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className="cursor-pointer">
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Hệ thống</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Support Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Hỗ trợ</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
