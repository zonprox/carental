import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import {
  User,
  Calendar,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Palette,
  Sun,
  Moon,
  Monitor,
  Shield,
  Home,
} from "lucide-react";
import { t } from "@/locales";

/**
 * UserNavMenu - User dropdown menu for homepage navbar
 * Features: User-focused actions, car rentals, favorites
 */
export default function UserNavMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

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
            {user?.name || t("userMenu.fallback.name")}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-lg shadow-lg"
        align="end"
        forceMount
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-3 text-left bg-muted/50">
            <Avatar className="h-10 w-10 ring-2 ring-border">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-sm text-foreground">
                {user?.name || t("userMenu.fallback.name")}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email || t("userMenu.fallback.email")}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Admin Panel Access (Admin only) */}
        {isAdmin && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleNavigate("/admin/dashboard")}
                className="cursor-pointer"
              >
                <Shield className="mr-2 h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-medium">Trang quản trị</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        {/* User Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigate("/")}
            className="cursor-pointer"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Trang chủ</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleNavigate("/user/dashboard")}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleNavigate("/user/profile")}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Hồ sơ cá nhân</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Rental Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigate("/user/bookings")}
            className="cursor-pointer"
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Đặt xe của tôi</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleNavigate("/user/favorites")}
            className="cursor-pointer"
          >
            <Heart className="mr-2 h-4 w-4" />
            <span>Xe yêu thích</span>
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
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={handleThemeChange}
              >
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Sáng</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Tối</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="system"
                  className="cursor-pointer"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Hệ thống</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigate("/user/settings")}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
