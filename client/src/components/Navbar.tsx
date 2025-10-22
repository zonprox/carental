import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Truck,
  Newspaper,
  Info,
  Phone,
  LogOut,
  UserCircle,
  Settings,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';
import type { User } from '@/types';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    api.auth
      .me()
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      toast.success('Đăng xuất thành công');
      navigate('/');
    } catch (_error) {
      toast.error('Đăng xuất thất bại');
    }
  };

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Xe', href: '/cars', icon: Truck },
    { name: 'Tin tức', href: '/news', icon: Newspaper },
    { name: 'Giới thiệu', href: '/about', icon: Info },
    { name: 'Liên hệ', href: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = (user: User) => {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  return (
    <nav className="bg-background text-foreground border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl hover:text-blue-600 transition-colors"
          >
            <Truck className="h-7 w-7 text-blue-600" />
            <span className="hidden sm:inline">Thuê Xe</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    className={`gap-2 ${
                      active
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {loading ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 gap-2 rounded-full hover:bg-accent"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} alt={user.name || user.email} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline font-medium">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Quản trị</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link to="/auth/register">Đăng ký</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/auth/login" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-2">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} to={item.href} className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 ${
                      active
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
