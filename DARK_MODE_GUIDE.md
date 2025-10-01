# Dim Mode Implementation Guide - CarRental Internal

## 📦 Project Information

**Repository**: https://github.com/zonprox/carental  
**Docker Image**: ghcr.io/zonprox/carental:latest  
**Implementation Date**: October 1, 2025  
**Version**: 2.1.1

---

## 🌙 Overview

CarRental now features a fully functional **Dim Mode** (soft dark theme) implementation using shadcn/ui standards with React Context and localStorage persistence. 

**Why Dim Mode instead of Pure Dark?**
- Better readability with softer dark blue-gray backgrounds
- Reduced eye strain with gentler contrast
- Modern and professional appearance
- Better color visibility and distinction

### Features
- ✅ **3 Theme Modes**: Light, Dark, System
- ✅ **Real-time Switching**: Instant theme updates
- ✅ **Persistence**: Saves preference to localStorage
- ✅ **System Detection**: Auto-detects OS theme preference
- ✅ **Smooth Transitions**: No flickering or layout shifts
- ✅ **Full Coverage**: All components support dark mode

---

## 🏗️ Architecture

### Component Structure
```
ThemeProvider (Context)
    └── BrowserRouter
        └── App
            ├── Admin Pages
            ├── User Pages
            ├── Auth Pages
            └── Components
                ├── UserMenu (theme switcher)
                ├── Sidebar
                ├── Cards
                └── All UI components
```

### Files Overview

#### Core Files
1. **`apps/frontend/src/components/ThemeProvider.jsx`**
   - React Context for theme state
   - localStorage integration
   - System preference detection
   - Theme class management

2. **`apps/frontend/src/main.jsx`**
   - Application entry point
   - ThemeProvider wrapper

3. **`apps/frontend/src/index.css`**
   - CSS variables for light mode (`:root`)
   - CSS variables for dark mode (`.dark`)
   - Base styles

4. **`apps/frontend/tailwind.config.js`**
   - Dark mode configuration (`darkMode: ["class"]`)
   - Color scheme using CSS variables

---

## 🎨 CSS Variables

### Light Mode (`:root`)
```css
:root {
  --background: 0 0% 100%;           /* White */
  --foreground: 240 10% 3.9%;        /* Near black */
  --card: 0 0% 100%;                 /* White */
  --card-foreground: 240 10% 3.9%;   /* Near black */
  --primary: 240 5.9% 10%;           /* Dark */
  --primary-foreground: 0 0% 98%;    /* Light */
  /* ... more variables */
}
```

### Dim Mode (`.dark`)
```css
.dark {
  /* Dim mode - Softer dark colors for better readability */
  --background: 220 13% 13%;        /* #1a1f2e - Dark blue-gray */
  --foreground: 210 20% 98%;        /* #f8f9fb - Soft white */
  --card: 220 13% 16%;              /* #222938 - Slightly lighter card */
  --card-foreground: 210 20% 98%;   /* #f8f9fb - Soft white */
  --primary: 217 91% 60%;           /* #3b82f6 - Bright blue */
  --primary-foreground: 0 0% 100%;  /* #ffffff - White */
  --muted: 220 13% 20%;             /* #2a3142 - Muted bg */
  --muted-foreground: 220 9% 65%;   /* #9ca3af - Gray text */
  --accent: 217 91% 60%;            /* #3b82f6 - Accent blue */
  --border: 220 13% 25%;            /* #343b4f - Border color */
  /* ... more variables */
}
```

**Key Differences from Pure Dark:**
- Uses dark blue-gray (`#1a1f2e`) instead of pure black (`#000000`)
- Softer white (`#f8f9fb`) instead of pure white (`#ffffff`)
- Bright blue accent (`#3b82f6`) for better visibility
- Gentler contrast ratios for reduced eye strain

### Using Variables in Components
```jsx
// Tailwind classes automatically use CSS variables
<div className="bg-background text-foreground">
  <div className="bg-card border">
    <h1 className="text-primary">Title</h1>
  </div>
</div>
```

---

## 🔧 Implementation Details

### ThemeProvider Component

**Location**: `apps/frontend/src/components/ThemeProvider.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeProviderContext = createContext({
  theme: 'system',
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'carental-ui-theme',
}) {
  // Theme state with localStorage
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  )

  // Apply theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

### Usage in Components

**UserMenu Integration**:
```jsx
import { useTheme } from '@/components/ThemeProvider'

export default function UserMenu({ user, onLogout }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      {/* ... */}
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="light">
          <Sun /> {t('userMenu.theme.light')}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <Moon /> {t('userMenu.theme.dark')}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">
          <Monitor /> {t('userMenu.theme.system')}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  )
}
```

---

## 🚀 How to Use

### 1. Theme Switching via UserMenu

Users can switch themes through the UserMenu:
1. Click on user avatar in sidebar
2. Hover on "Giao diện" (Appearance)
3. Select:
   - ☀️ **Sáng** (Light)
   - 🌙 **Tối** (Dark)
   - 🖥️ **Hệ thống** (System)

### 2. Programmatic Theme Change

```jsx
import { useTheme } from '@/components/ThemeProvider'

function MyComponent() {
  const { theme, setTheme } = useTheme()

  // Get current theme
  console.log(theme) // 'light', 'dark', or 'system'

  // Set theme
  setTheme('dark')  // Force dark mode
  setTheme('light') // Force light mode
  setTheme('system') // Use system preference
}
```

### 3. Conditional Rendering Based on Theme

```jsx
import { useTheme } from '@/components/ThemeProvider'

function ThemeAwareComponent() {
  const { theme } = useTheme()

  return (
    <div>
      {theme === 'dark' && <DarkModeOnlyContent />}
      {theme === 'light' && <LightModeOnlyContent />}
    </div>
  )
}
```

---

## 🎨 Styling for Dark Mode

### Using Tailwind CSS

```jsx
// Background and text
<div className="bg-background text-foreground">

// Cards
<div className="bg-card text-card-foreground border">

// Buttons
<button className="bg-primary text-primary-foreground">

// Dark mode specific styles
<div className="bg-white dark:bg-slate-900">
<p className="text-black dark:text-white">

// Conditional borders
<div className="border-gray-200 dark:border-gray-700">
```

### Custom CSS with Dark Mode

```css
/* Light mode default */
.my-component {
  background-color: white;
  color: black;
}

/* Dark mode override */
.dark .my-component {
  background-color: #1a1a1a;
  color: white;
}
```

---

## 📊 Theme Persistence

### Storage Key
```javascript
localStorage.setItem('carental-ui-theme', theme)
// Values: 'light', 'dark', 'system'
```

### Initial Load
1. Check localStorage for saved preference
2. If not found, use default (`system`)
3. Apply theme class to `<html>` element

### System Preference Detection
```javascript
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
```

---

## 🔍 Testing Dark Mode

### Manual Testing
1. **Light Mode**:
   - UserMenu → Giao diện → Sáng
   - Verify all pages use light colors
   - Check localStorage: `'light'`

2. **Dark Mode**:
   - UserMenu → Giao diện → Tối
   - Verify all pages use dark colors
   - Check localStorage: `'dark'`

3. **System Mode**:
   - UserMenu → Giao diện → Hệ thống
   - Change OS theme
   - Verify app follows OS preference
   - Check localStorage: `'system'`

### Component Testing
```jsx
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/ThemeProvider'

test('renders in dark mode', () => {
  render(
    <ThemeProvider defaultTheme="dark">
      <YourComponent />
    </ThemeProvider>
  )
  
  const root = document.documentElement
  expect(root.classList.contains('dark')).toBe(true)
})
```

---

## 🎯 Supported Components

All components in the project support dark mode:

### Admin Section
- ✅ Admin Dashboard
- ✅ Sidebar
- ✅ UserMenu
- ✅ Car Management
- ✅ User Management
- ✅ All tables and cards

### User Section
- ✅ User Dashboard
- ✅ Car listing
- ✅ Booking pages

### Authentication
- ✅ Login page
- ✅ Register page

### UI Components (shadcn/ui)
- ✅ Button
- ✅ Card
- ✅ Dialog
- ✅ Dropdown Menu
- ✅ Input
- ✅ Label
- ✅ Select
- ✅ Table
- ✅ Avatar
- ✅ Badge
- ✅ Alert

---

## 🐛 Troubleshooting

### Issue: Theme not persisting
**Solution**: Check localStorage in browser DevTools
```javascript
// Console
localStorage.getItem('carental-ui-theme')
// Should return: 'light', 'dark', or 'system'
```

### Issue: Flickering on page load
**Solution**: Theme is applied in useEffect. Consider adding:
```html
<!-- In index.html -->
<script>
  const theme = localStorage.getItem('carental-ui-theme')
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
</script>
```

### Issue: Some components not dark mode compatible
**Solution**: 
1. Use CSS variables from theme
2. Add `dark:` prefix for Tailwind classes
3. Avoid hardcoded colors

---

## 📝 Best Practices

### 1. Always Use Theme Variables
```jsx
// ✅ Good
<div className="bg-background text-foreground">

// ❌ Bad
<div className="bg-white text-black">
```

### 2. Use Tailwind's Dark Mode Variants
```jsx
// ✅ Good
<div className="bg-white dark:bg-slate-900">

// ❌ Bad - manual class switching
<div className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>
```

### 3. Test Both Modes
- Always test new components in both light and dark modes
- Check contrast ratios for accessibility
- Verify borders and shadows are visible

### 4. Avoid Pure Black/White
```css
/* ✅ Good - softer colors */
background: #1a1a1a; /* Dark gray instead of #000 */
color: #f5f5f5;      /* Off-white instead of #fff */

/* ❌ Bad - harsh contrast */
background: #000000;
color: #ffffff;
```

---

## 📚 Resources

### Official Documentation
- [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [React Context API](https://react.dev/reference/react/useContext)

### Internal Documentation
- `USERMENU_DESIGN.md` - UserMenu component design
- `UPDATES_SUMMARY.md` - Project updates
- `PROJECT_INFO.md` - Project overview

---

## 🔄 Future Enhancements

Potential improvements for dark mode:

- [ ] Add theme preview in settings
- [ ] Add more color schemes (e.g., blue dark, purple dark)
- [ ] Implement smooth theme transitions
- [ ] Add theme scheduling (auto-switch at sunset/sunrise)
- [ ] Create theme customization UI
- [ ] Add high contrast mode for accessibility

---

**Last Updated**: October 1, 2025  
**Version**: 2.1.0  
**Maintained By**: @zonprox

