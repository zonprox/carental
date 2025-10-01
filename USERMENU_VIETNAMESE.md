# UserMenu Component - Vietnamese Localization Guide

## 📋 Overview

UserMenu component has been **fully Vietnamese localized** and **simplified** for the CarRental internal project to better serve Vietnamese users.

**Project**: CarRental Internal  
**Repository**: https://github.com/zonprox/carental  
**Docker Image**: ghcr.io/zonprox/carental:latest

## 🎯 Menu Structure

### 1. **Header** - User Information
```
┌─────────────────────────────────┐
│ 👤 [Avatar]  User Name          │
│              email@example.com  │
└─────────────────────────────────┘
```

### 2. **Account** - 3 Items
```
👤 Hồ sơ cá nhân    (Profile)
⚙️ Cài đặt          (Settings)
🔔 Thông báo        (Notifications)
```

### 3. **Appearance** - Sub-menu
```
🎨 Giao diện ▶      (Appearance)
    ☀️ Sáng        (Light)
    🌙 Tối         (Dark)
    🖥️ Hệ thống    (System)
```

### 4. **Support**
```
🆘 Hỗ trợ           (Support)
```

### 5. **Logout**
```
🚪 Đăng xuất        (Logout - red color)
```

## 🔤 Vietnamese Translation Table

| English | Vietnamese | Usage |
|---------|------------|-------|
| Profile | Hồ sơ cá nhân | View and edit user information |
| Settings | Cài đặt | System configuration |
| Notifications | Thông báo | Manage notifications |
| Appearance | Giao diện | Theme switching |
| Light | Sáng | Light mode |
| Dark | Tối | Dark mode |
| System | Hệ thống | System preference |
| Support | Hỗ trợ | Customer support |
| Logout | Đăng xuất | Sign out |

## ✅ Retained Features

1. ✅ **Hồ sơ cá nhân** - View and edit user profile
2. ✅ **Cài đặt** - System settings and preferences
3. ✅ **Thông báo** - Notification management
4. ✅ **Giao diện** - Theme switching (Light/Dark/System)
5. ✅ **Hỗ trợ** - Contact support team
6. ✅ **Đăng xuất** - Sign out from account

## ❌ Removed Features

1. ❌ **Billing** - Not needed for internal project
2. ❌ **Team** - Not used
3. ❌ **Invite users** - Not required
4. ❌ **GitHub** - Not relevant
5. ❌ **API** - Not needed
6. ❌ **Keyboard Shortcuts** (⌘, ⇧) - macOS shortcuts removed

## 🎨 Icons Used

Total: **9 icons** from Lucide React v0.544.0

| Icon | Purpose | Vietnamese Name |
|------|---------|----------------|
| `User` | Profile | Hồ sơ cá nhân |
| `Settings` | Settings | Cài đặt |
| `Bell` | Notifications | Thông báo |
| `Palette` | Appearance | Giao diện |
| `Sun` | Light theme | Chế độ sáng |
| `Moon` | Dark theme | Chế độ tối |
| `Monitor` | System theme | Theo hệ thống |
| `LifeBuoy` | Support | Hỗ trợ |
| `LogOut` | Logout | Đăng xuất |
| `ChevronsUpDown` | Dropdown | Menu indicator |

## 📱 Interface

### Desktop
- Width: 256px (w-64)
- Shadow: shadow-lg
- Border radius: rounded-lg
- Position: Right side, End aligned

### Mobile
- Responsive layout
- Touch-friendly
- Auto-adjust position

## 🎨 Colors

### Avatar
- Gradient: `from-blue-500 to-purple-600`
- Ring: `ring-2 ring-border`
- Text: White, font-semibold

### Menu Items
- Default: `text-foreground`
- Hover: `bg-accent`
- Active: `bg-accent`

### Logout (Special)
- Text: `text-red-600`
- Hover (Light): `bg-red-50`
- Hover (Dark): `bg-red-950`

## 🌍 Localization

### Configuration Files
- `apps/frontend/src/locales/vi.js` - Vietnamese
- `apps/frontend/src/locales/en.js` - English

### Usage Example
```jsx
import { t } from '@/locales'

<span>{t('userMenu.profile')}</span>
// Output: "Hồ sơ cá nhân"
```

### Adding New Translations

**In vi.js:**
```javascript
userMenu: {
  profile: 'Hồ sơ cá nhân',
  settings: 'Cài đặt',
  notifications: 'Thông báo',
  support: 'Hỗ trợ',
  appearance: 'Giao diện',
  logout: 'Đăng xuất',
  // ... add your new items here
}
```

**In en.js:**
```javascript
userMenu: {
  profile: 'Profile',
  settings: 'Settings',
  notifications: 'Notifications',
  support: 'Support',
  appearance: 'Appearance',
  logout: 'Logout',
  // ... add your new items here
}
```

## 🚀 Implementation

### Import Component
```jsx
import UserMenu from '@/components/admin/UserMenu'
```

### Usage
```jsx
<UserMenu 
  user={{
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: 'https://...'
  }}
  onLogout={handleLogout}
/>
```

## 📝 Notes

1. **Simpler**: Menu reduced from ~15 items to 6 main items
2. **More Understandable**: All in Vietnamese
3. **Cleaner**: Removed unnecessary features
4. **User-friendly**: No complex keyboard shortcuts
5. **More Focused**: Only essential functions

## 🔧 Customization

### Add New Menu Item
```jsx
<DropdownMenuItem className="cursor-pointer">
  <YourIcon className="mr-2 h-4 w-4" />
  <span>{t('userMenu.yourItem')}</span>
</DropdownMenuItem>
```

### Add Translation in vi.js
```javascript
userMenu: {
  // ... existing translations
  yourItem: 'Mục của bạn',
}
```

### Add Translation in en.js
```javascript
userMenu: {
  // ... existing translations
  yourItem: 'Your Item',
}
```

## ✨ Benefits

UserMenu optimized for Vietnamese users with:
- ✅ 100% Vietnamese localization
- ✅ Simple and clear interface
- ✅ Intuitive icons from Lucide
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Full accessibility

## 🏢 Project Information

**Project Type**: Internal (Non-open source)  
**Repository**: https://github.com/zonprox/carental  
**Docker Registry**: ghcr.io/zonprox/carental:latest  
**Primary Language**: Vietnamese  
**Secondary Language**: English  
**Target Users**: Internal staff  
**Environment**: Production internal deployment
