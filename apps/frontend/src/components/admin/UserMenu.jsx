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
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Settings, 
  LogOut, 
  Palette,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import { messages } from '@/lib/messages'

export default function UserMenu({ user, onLogout }) {
  const [theme, setTheme] = useState('system')

  // User data with fallbacks
  const userData = {
    name: user?.name || messages.userMenu.fallback.name,
    email: user?.email || messages.userMenu.fallback.email,
    avatar: user?.avatar || null,
    initials: user?.name 
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : messages.userMenu.fallback.initials
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

  const truncateEmail = (email) => {
    if (email.length > 25) {
      return email.substring(0, 22) + '...'
    }
    return email
  }

  // Loading skeleton
  if (!user && !userData.name) {
    return (
      <div className="flex items-center gap-2 p-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="hidden sm:block">
          <div className="h-3 w-16 bg-muted rounded animate-pulse mb-1" />
          <div className="h-2 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-auto px-2 rounded-lg hover:bg-accent/50"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-sm font-medium leading-none">
                {userData.name}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-1">
                {truncateEmail(userData.email)}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>{messages.userMenu.account}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            <span>{messages.userMenu.appearance}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
              <DropdownMenuRadioItem value="light" className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                <span>{messages.userMenu.theme.light}</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>{messages.userMenu.theme.dark}</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                <span>{messages.userMenu.theme.system}</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{messages.userMenu.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
