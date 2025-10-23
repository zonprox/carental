import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Users, LayoutDashboard, LogOut, Menu, X, Settings, Calendar, ChevronDown, ChevronRight, Mail, MessageSquare, Bell, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      toast({ title: 'Đăng xuất thành công' });
      navigate('/auth/login');
    } catch (_error) {
      toast({
        title: 'Đăng xuất thất bại',
        description: 'Vui lòng thử lại',
        variant: 'destructive',
      });
    }
  };

  const [expandedMenus, setExpandedMenus] = useState<string[]>(['settings']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const navItems = [
    {
      id: 'dashboard',
      title: 'Bảng điều khiển',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      id: 'cars',
      title: 'Quản lý xe',
      href: '/admin/cars',
      icon: Car,
    },
    {
      id: 'bookings',
      title: 'Đặt xe',
      href: '/admin/bookings',
      icon: Calendar,
    },
    {
      id: 'users',
      title: 'Người dùng',
      href: '/admin/users',
      icon: Users,
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: Settings,
      subItems: [
        {
          id: 'general',
          title: 'Cài đặt chung',
          href: '/admin/settings/general',
          icon: Settings,
        },
        {
          id: 'booking',
          title: 'Đặt xe',
          href: '/admin/settings/booking',
          icon: Calendar,
        },
        {
          id: 'notifications',
          title: 'Thông báo',
          href: '/admin/settings/notifications',
          icon: Bell,
        },
        {
          id: 'security',
          title: 'Bảo mật',
          href: '/admin/settings/security',
          icon: Shield,
        },
        {
          id: 'email',
          title: 'Email SMTP',
          href: '/admin/settings/email',
          icon: Mail,
        },
        {
          id: 'telegram',
          title: 'Telegram Bot',
          href: '/admin/settings/telegram',
          icon: MessageSquare,
        },
        {
          id: 'system',
          title: 'Hệ thống',
          href: '/admin/settings/system',
          icon: Database,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2 font-bold text-lg text-white">
              <Car className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          )}
          {collapsed && (
            <Car className="h-6 w-6 text-white mx-auto" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('text-white hover:bg-blue-800', collapsed && 'mx-auto')}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            
            if (hasSubItems) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => !collapsed && toggleMenu(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      'text-foreground hover:bg-accent',
                      collapsed && 'justify-center'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {!collapsed && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-2">
                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.href;
                        
                        return (
                          <Link key={subItem.id} to={subItem.href}>
                            <div
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                                isSubActive
                                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 font-medium'
                                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                              )}
                            >
                              <SubIcon className="h-4 w-4 flex-shrink-0" />
                              <span>{subItem.title}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
            return item.href ? (
              <Link key={item.id} to={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600'
                      : 'text-foreground hover:bg-accent',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </div>
              </Link>
            ) : null;
          })}
        </nav>

        <Separator className="my-4" />

        {/* Public Site Link */}
        <div className="p-2">
          <Link to="/">
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Xem trang công khai</span>}
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t bg-card">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
