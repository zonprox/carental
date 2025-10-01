import { useState } from 'react'
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
import { 
  User, 
  LogOut, 
  Palette,
  Sun,
  Moon,
  Monitor,
  ChevronsUpDown
} from 'lucide-react'
import { t } from '@/locales'

export default function UserMenu({ user, onLogout }) {
  const [theme, setTheme] = useState('system')

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
    // TODO: Implement actual theme switching logic
    console.log('Theme changed to:', newTheme)
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
          className="w-full justify-start gap-2 px-2 h-auto py-2 rounded-lg hover:bg-accent data-[state=open]:bg-accent"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {userData.initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userData.name}</span>
            <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 rounded-lg" 
        side="right"
        align="end" 
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userData.name}</span>
              <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User />
            {t('userMenu.account')}
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Palette />
              {t('userMenu.appearance')}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-lg">
              <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  <Sun />
                  {t('userMenu.theme.light')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                  <Moon />
                  {t('userMenu.theme.dark')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className="cursor-pointer">
                  <Monitor />
                  {t('userMenu.theme.system')}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut />
          {t('userMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
