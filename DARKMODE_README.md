# 🌙 Dim Mode - Quick Reference

## Overview
CarRental Internal now features full **Dim Mode** (soft dark theme) support with 3 theme options.

**What is Dim Mode?**
- Softer dark theme with dark blue-gray backgrounds instead of pure black
- Better readability and reduced eye strain
- Modern professional appearance

---

## 🎯 Quick Start

### For Users
1. Click on your avatar in the sidebar
2. Hover on **"Giao diện"** (Appearance)
3. Select your preferred theme:
   - ☀️ **Sáng** (Light) - Bright interface
   - 🌙 **Tối** (Dark) - Dark interface  
   - 🖥️ **Hệ thống** (System) - Follows your OS

Your choice is saved automatically!

---

## 🔧 For Developers

### Using Theme in Components
```jsx
import { useTheme } from '@/components/ThemeProvider'

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  // Current theme: 'light', 'dark', or 'system'
  console.log(theme)
  
  // Change theme
  setTheme('dark')
}
```

### Styling Components
```jsx
// Use CSS variables (recommended)
<div className="bg-background text-foreground">
  <Card className="bg-card border">
    Content
  </Card>
</div>

// Or use dark: prefix
<div className="bg-white dark:bg-slate-900">
  <p className="text-black dark:text-white">Text</p>
</div>
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `apps/frontend/src/components/ThemeProvider.jsx` | Theme context & logic |
| `apps/frontend/src/main.jsx` | ThemeProvider wrapper |
| `apps/frontend/src/index.css` | CSS variables for themes |
| `apps/frontend/tailwind.config.js` | Dark mode config |
| `apps/frontend/src/components/admin/UserMenu.jsx` | Theme switcher UI |

---

## ✅ What's Supported

All components work in dark mode:
- ✅ Admin Dashboard & Sidebar
- ✅ Car Management pages
- ✅ User pages
- ✅ Authentication pages
- ✅ All shadcn/ui components
- ✅ Tables, cards, forms, buttons
- ✅ Dropdowns, dialogs, modals

---

## 🎨 Theme Variables

**Light Mode**: White backgrounds, dark text  
**Dim Mode**: Dark blue-gray backgrounds (#1a1f2e), soft white text  
**System Mode**: Follows OS preference

### Dim Mode Colors
- Background: `#1a1f2e` (dark blue-gray)
- Text: `#f8f9fb` (soft white)
- Primary: `#3b82f6` (bright blue)
- Borders: `#343b4f` (medium gray)

All colors use CSS variables from `index.css`:
```css
--background    /* #1a1f2e in dim mode */
--foreground    /* #f8f9fb in dim mode */
--card          /* #222938 in dim mode */
--primary       /* #3b82f6 in dim mode */
--secondary
--muted
--accent
...
```

---

## 📚 Full Documentation

See `DARK_MODE_GUIDE.md` for:
- Complete implementation details
- Advanced usage
- Troubleshooting
- Best practices
- Testing guide

---

## 🐛 Troubleshooting

**Q: Theme not saving?**  
A: Check browser localStorage:
```javascript
localStorage.getItem('carental-ui-theme')
```

**Q: Some components look wrong?**  
A: Use theme CSS variables instead of hardcoded colors

**Q: Want to add new colors?**  
A: Add to both `:root` and `.dark` in `index.css`

---

## 🚀 Quick Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Test
npm run test
```

---

**Version**: 2.1.1  
**Last Updated**: October 1, 2025  
**Repository**: https://github.com/zonprox/carental

---

## ✨ What's New in v2.1.1

**Dim Mode Improvements**:
- Changed from pure dark to soft dim mode
- Dark blue-gray backgrounds (#1a1f2e) instead of black
- Softer contrast for better readability
- Bright blue accent color (#3b82f6)
- Enhanced shadow visibility
- Smooth transitions between themes
- All components fully compatible

