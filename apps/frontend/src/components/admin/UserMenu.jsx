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
} from 'lucide-react'
import { t } from '@/locales'

export default function UserMenu({ user, onLogout }) {
  const { theme, setTheme } = useTheme()

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
          <div className="flex items-center gap-3 px-2 py-3 text-left">
            <Avatar className="h-10 w-10 ring-2 ring-border">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-sm text-foreground">{userData.name}</span>
              <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
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
              <span>{t('userMenu.appearance')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-lg w-48">
              <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>{t('userMenu.theme.light')}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>{t('userMenu.theme.dark')}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className="cursor-pointer">
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>{t('userMenu.theme.system')}</span>
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
            <span>{t('userMenu.support')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('userMenu.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
