# UserMenu Component - shadcn/ui Design with Vietnamese Localization

## 🎨 Overview

UserMenu component has been completely redesigned following shadcn/ui standards with Lucide React v0.544.0 icons and full Vietnamese localization for the CarRental internal project.

**Repository**: https://github.com/zonprox/carental  
**Docker Image**: ghcr.io/zonprox/carental:latest

## ✨ Features

### 1. **Header with Gradient Avatar**
- Avatar with gradient from blue-500 to purple-600
- 2px ring border around avatar
- Semibold font for user name
- Larger avatar size: **h-10 w-10** (40px) in dropdown

### 2. **Account Section** (Vietnamese Localized)
3 main menu items:
- 👤 **Hồ sơ cá nhân** (Profile)
- ⚙️ **Cài đặt** (Settings)
- 🔔 **Thông báo** (Notifications)

### 3. **Appearance Theme** (Vietnamese Localized - Fully Functional)
Sub-menu for theme switching with real-time updates:
- ☀️ **Sáng** (Light) - Light mode
- 🌙 **Tối** (Dark) - Dark mode
- 🖥️ **Hệ thống** (System) - System preference

**Features**:
- ✅ Real-time theme switching
- ✅ Persists to localStorage
- ✅ System preference detection
- ✅ Smooth transitions
- ✅ All components support dark mode

### 4. **Support Section** (Vietnamese Localized)
- 🆘 **Hỗ trợ** (Support) - Customer support

### 5. **Logout** (Vietnamese Localized)
- 🚪 **Đăng xuất** (Logout)
- Red color with hover effect
- Dark mode support
- No keyboard shortcuts

## 🎯 Lucide Icons Used

### Import from lucide-react v0.544.0:
```javascript
import {
  User,           // Profile
  LogOut,         // Logout
  Palette,        // Appearance
  Sun,            // Light theme
  Moon,           // Dark theme
  Monitor,        // System theme
  ChevronsUpDown, // Dropdown indicator
  Settings,       // Settings
  Bell,           // Notifications
  LifeBuoy,       // Support
} from 'lucide-react'
```

### Removed unnecessary icons:
- ❌ `CreditCard` (Billing) - Removed
- ❌ `Users` (Team) - Removed
- ❌ `UserPlus` (Invite users) - Removed
- ❌ `Mail` (Email) - Removed
- ❌ `MessageSquare` (Message) - Removed
- ❌ `Plus` (More) - Removed
- ❌ `Github` (GitHub) - Removed
- ❌ `Cloud` (API) - Removed
- ❌ `HelpCircle` (Help) - Removed
- ❌ `Keyboard` (Shortcuts) - Removed

## 🎨 Design Improvements

### 1. **Spacing & Layout**
- Width: `w-64` (256px) - wider than before
- Increased padding: `px-2 py-3` for header
- Gap: `gap-3` between elements
- Shadow: `shadow-lg` for depth

### 2. **Typography**
- Font weight: `font-semibold` for user name
- Optimized text sizes for readability
- Truncate: Auto-cut long text

### 3. **Colors**
- Gradient avatar: `from-blue-500 to-purple-600`
- Ring border: `ring-2 ring-border`
- Red logout: `text-red-600` with hover states
- Dark mode: `dark:focus:bg-red-950`

### 4. **Transitions**
- `transition-colors` for smooth hover
- Radix UI animations for dropdown
- Rounded corners: `rounded-lg`

### 5. **Icons Consistency**
- All icons: `h-4 w-4` (16px)
- Margin right: `mr-2` between icon and text
- Muted foreground for secondary icons

## 📱 Responsive & Accessibility

- ✅ Keyboard navigation
- ✅ Clear focus states
- ✅ Disabled state for unavailable items
- ✅ ARIA labels from Radix UI
- ✅ Screen reader friendly

## 🔧 Customization

### Change gradient colors:
```jsx
<AvatarFallback className="rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
```

### Change width:
```jsx
<DropdownMenuContent className="w-72 rounded-lg shadow-lg">
```

### Add menu items:
```jsx
<DropdownMenuItem className="cursor-pointer">
  <YourIcon className="mr-2 h-4 w-4" />
  <span>{t('yourMenu.item')}</span>
</DropdownMenuItem>
```

## 🚀 Best Practices

1. **Icon Size Consistency**: Always use `h-4 w-4` for menu icons
2. **Spacing**: Use `mr-2` between icon and text
3. **Cursor**: Add `cursor-pointer` for interactive items
4. **Shortcuts**: ❌ No keyboard shortcuts (removed)
5. **Sections**: Use `DropdownMenuSeparator` to divide sections
6. **Groups**: Use `DropdownMenuGroup` to group related items
7. **Localization**: Always use `t()` function for internationalization

## 📦 Dependencies

- `@radix-ui/react-dropdown-menu` - Dropdown primitive
- `@radix-ui/react-avatar` - Avatar component
- `lucide-react@0.544.0` - Icons
- `tailwindcss` - Styling
- `class-variance-authority` - Variants

## 🎯 Conclusion

New UserMenu component designed with:
- ✅ shadcn/ui design system standard
- ✅ Lucide React v0.544.0 icons (9 icons)
- ✅ Modern UI/UX patterns
- ✅ Full accessibility support
- ✅ **Dark mode fully implemented** with ThemeProvider
- ✅ **Real-time theme switching** (Light/Dark/System)
- ✅ **Theme persistence** in localStorage
- ✅ Responsive design
- ✅ **Vietnamese localization**
- ✅ **Simplified menu structure**
- ❌ No keyboard shortcuts (Removed macOS shortcuts)
- ❌ No Team/Billing/GitHub/API sections

## 📝 Changelog

### Version 2.1 - Dark Mode Implementation
- ✅ Added ThemeProvider component with React Context
- ✅ Implemented real-time theme switching
- ✅ Theme persistence in localStorage
- ✅ System preference detection and auto-switch
- ✅ All components now support dark mode
- ✅ Smooth transitions between themes
- ✅ Full integration with UserMenu appearance settings

### Version 2.0 - Vietnamese Localization and Simplification
- ✅ Full Vietnamese localization for all menu items
- ✅ Removed Team section
- ✅ Removed Invite users sub-menu
- ✅ Removed Billing menu item
- ✅ Removed GitHub menu item
- ✅ Removed API menu item
- ✅ Removed all keyboard shortcuts (macOS)
- ✅ Kept: Profile, Settings, Notifications, Appearance, Support, Logout
- ✅ Reduced from 19 icons to 9 icons
- ✅ Cleaner and more focused menu

## 🏢 Project Information

**Project Type**: Internal (Non-open source)  
**Repository**: https://github.com/zonprox/carental  
**Docker Registry**: ghcr.io/zonprox/carental:latest  
**Tech Stack**: React 19.1.1, Node.js 22.20.0 LTS, PostgreSQL 16  
**UI Library**: shadcn/ui 3.3.1  
**Build Tool**: Vite 6.0.7  
**Icons**: Lucide React v0.544.0
