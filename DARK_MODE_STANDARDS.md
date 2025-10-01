# Dark Mode Standards & Guidelines - CarRental Internal

## 📦 Project Information

**Repository**: https://github.com/zonprox/carental  
**Docker Image**: ghcr.io/zonprox/carental:latest  
**Version**: 2.1.3  
**Standard Reference**: [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode/)  
**Last Updated**: October 1, 2025

---

## 🎯 Purpose

This document defines the **dark mode standards and guidelines** for the entire CarRental project to ensure consistency, reusability, and excellent user experience.

---

## 🎨 Color Palette (GitHub-inspired)

### Official Color Scheme

```css
/* Light Mode */
:root {
  --background: #ffffff          /* Pure white */
  --foreground: #0a0a0f          /* Near black */
  --primary: #0a0a0f             /* Dark */
  --muted-foreground: #737373    /* Gray 500 */
}

/* Dark Mode (GitHub-inspired) */
.dark {
  --background: #0d1117          /* GitHub dark */
  --foreground: #e6edf3          /* Soft white - 91% lightness */
  --card: #161b22                /* Elevated surface */
  --primary: #58a6ff             /* GitHub blue */
  --muted-foreground: #8b949e    /* Gray - 64% lightness */
  --border: #30363d              /* Visible border */
}
```

### HSL Values (Exact)
```css
.dark {
  --background: 224 71% 4%;         /* #0d1117 */
  --foreground: 213 31% 91%;        /* #e6edf3 */
  --card: 220 13% 9%;               /* #161b22 */
  --primary: 213 94% 68%;           /* #58a6ff */
  --muted-foreground: 217 10% 64%;  /* #8b949e */
  --border: 215 14% 18%;            /* #30363d */
}
```

---

## 📐 Component Standards

### 1. Page Structure (Mandatory)

All admin pages MUST use these reusable components:

**File**: `apps/frontend/src/components/ui/page-header.jsx`

```jsx
import { PageContainer, PageHeader } from '@/components/ui/page-header'

export default function YourPage() {
  return (
    <AdminLayout>
      <PageContainer>
        <PageHeader 
          title="Page Title"
          description="Page description"
        >
          {/* Action buttons */}
          <Button>Add New</Button>
        </PageHeader>
        
        {/* Page content */}
        <div className="space-y-4">
          {/* Your content */}
        </div>
      </PageContainer>
    </AdminLayout>
  )
}
```

**Benefits**:
- ✅ Consistent spacing (p-6 md:p-8 lg:p-10)
- ✅ Consistent typography (text-2xl font-bold)
- ✅ Responsive layout
- ✅ Automatic theme adaptation

### 2. Text Colors (Mandatory Rules)

**DO's** ✅:
```jsx
// Page titles
<h1 className="text-2xl font-bold text-foreground">

// Descriptions
<p className="text-sm text-muted-foreground">

// Card titles
<CardTitle className="text-foreground">

// Table headers
<TableHead className="text-foreground">

// Primary text
<span className="text-foreground">

// Secondary text  
<span className="text-muted-foreground">

// Primary accent
<span className="text-primary">
```

**DON'Ts** ❌:
```jsx
// ❌ Never use hardcoded grays
<h1 className="text-gray-900">
<p className="text-gray-500">
<span className="text-gray-600">

// ❌ Never use hardcoded colors
<div className="bg-white">
<div className="bg-black">
<span className="text-blue-600">
```

### 3. Background Colors (Mandatory Rules)

**DO's** ✅:
```jsx
// Page background
<div className="bg-background">

// Cards and panels
<Card className="bg-card">

// Elevated surfaces
<div className="bg-card border">

// Muted backgrounds
<div className="bg-muted">

// Accent backgrounds
<div className="bg-accent">
```

**DON'Ts** ❌:
```jsx
// ❌ Never hardcode
<div className="bg-white">
<div className="bg-gray-50">
<div className="bg-gray-100">
<Card className="bg-white">
```

### 4. Border Colors (Mandatory Rules)

**DO's** ✅:
```jsx
<div className="border border-border">
<Table className="border-border">
<Card className="border-border">
```

**DON'Ts** ❌:
```jsx
// ❌ Never hardcode
<div className="border border-gray-200">
<div className="border-gray-300">
```

---

## 🧩 Reusable Components

### PageHeader Component

**Purpose**: Consistent page titles across all admin pages

**Usage**:
```jsx
<PageHeader 
  title={t('page.title')}
  description={t('page.description')}
>
  <Button>Action</Button>
</PageHeader>
```

**Styling**:
- Title: `text-2xl font-bold tracking-tight text-foreground`
- Description: `text-sm text-muted-foreground`
- Spacing: `space-y-1`

### PageContainer Component

**Purpose**: Consistent padding and spacing

**Usage**:
```jsx
<PageContainer>
  {/* Page content */}
</PageContainer>
```

**Styling**:
- Padding: `p-6 md:p-8 lg:p-10`
- Spacing: `space-y-6`

### ThemeToggle Component

**Purpose**: Quick theme switching

**Usage**:
```jsx
import { ThemeToggle } from '@/components/ThemeToggle'

<ThemeToggle />
```

**Features**:
- Animated Sun/Moon icon
- Dropdown menu
- Vietnamese labels

---

## 🎨 Styling Patterns

### Cards
```jsx
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Tables
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-foreground">Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="text-foreground">Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Stat Cards (Dashboard style)
```jsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Label
    </CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">Value</div>
    <p className="text-xs text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

### Forms
```jsx
<form className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      Label
    </label>
    <Input 
      className="bg-background border-input text-foreground"
      placeholder="Placeholder"
    />
  </div>
</form>
```

---

## 🔍 Code Review Checklist

Before committing, verify:

- [ ] **No hardcoded colors**: `text-gray-*`, `bg-gray-*`, `text-blue-*`
- [ ] **Use theme variables**: `text-foreground`, `bg-background`, `text-primary`
- [ ] **PageHeader used**: For all admin pages
- [ ] **PageContainer used**: For consistent padding
- [ ] **CardTitle explicit**: `className="text-foreground"`
- [ ] **TableHead explicit**: `className="text-foreground"`
- [ ] **Borders use variable**: `border-border`
- [ ] **Test both modes**: Light and Dark

---

## 🧪 Testing Procedure

### Manual Testing
```
1. Switch to dark mode
2. Check every page:
   - HomePage
   - Login/Register
   - Admin Dashboard
   - Car Management
   - User Management
3. Verify:
   - Text is readable (not dim)
   - Backgrounds are synchronized
   - Borders are visible
   - Icons have proper colors
   - Hover states work
```

### Automated Testing (Future)
```jsx
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/ThemeProvider'

test('component renders in dark mode', () => {
  const { container } = render(
    <ThemeProvider defaultTheme="dark">
      <YourComponent />
    </ThemeProvider>
  )
  
  // Verify dark mode applied
  expect(document.documentElement).toHaveClass('dark')
})
```

---

## 📊 Migration Guide

### Converting Existing Components

**Before** (Hardcoded):
```jsx
<div className="p-6 bg-gray-50">
  <h1 className="text-3xl font-bold text-gray-900">Title</h1>
  <p className="text-gray-500">Description</p>
  <Card className="bg-white">
    <CardContent>
      <p className="text-gray-600">Content</p>
    </CardContent>
  </Card>
</div>
```

**After** (Theme-aware):
```jsx
<PageContainer>
  <PageHeader title="Title" description="Description" />
  <Card>
    <CardContent>
      <p className="text-muted-foreground">Content</p>
    </CardContent>
  </Card>
</PageContainer>
```

**Steps**:
1. Replace `<div className="p-6">` with `<PageContainer>`
2. Replace title/description with `<PageHeader>`
3. Change all `text-gray-*` to theme variables
4. Change all `bg-white`, `bg-gray-*` to theme variables
5. Test in both light and dark modes

---

## 🎯 Reusable Component List

### Layout Components
- ✅ `PageContainer` - Consistent padding wrapper
- ✅ `PageHeader` - Page title and actions
- ✅ `AdminLayout` - Admin panel wrapper
- ✅ `Sidebar` - Navigation sidebar
- ✅ `UserMenu` - User dropdown with theme switcher

### Theme Components
- ✅ `ThemeProvider` - Theme context
- ✅ `ThemeToggle` - Quick theme button
- ✅ `useTheme()` - Theme hook

### UI Components (shadcn/ui)
All auto-adapt to dark mode:
- ✅ Button, Card, Input, Label
- ✅ Table, Dialog, Dropdown
- ✅ Avatar, Badge, Alert
- ✅ Select, Textarea

---

## 📝 Examples

### Example 1: Dashboard Page
```jsx
import { PageContainer, PageHeader } from '@/components/ui/page-header'

export default function Dashboard() {
  return (
    <AdminLayout>
      <PageContainer>
        <PageHeader title="Dashboard" description="Overview">
          <Button>Refresh</Button>
        </PageHeader>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                1,234
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AdminLayout>
  )
}
```

### Example 2: Management Page with Table
```jsx
<PageContainer>
  <PageHeader title="Items" description="Manage items">
    <Button><Plus /> Add Item</Button>
  </PageHeader>
  
  <Card>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-foreground">Item 1</TableCell>
            <TableCell className="text-muted-foreground">Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</PageContainer>
```

---

## 🚫 Common Mistakes

### Mistake 1: Hardcoded Gray Colors
```jsx
// ❌ Wrong
<p className="text-gray-600">

// ✅ Correct
<p className="text-muted-foreground">
```

### Mistake 2: Missing Theme Classes
```jsx
// ❌ Wrong - No explicit color
<CardTitle>Title</CardTitle>

// ✅ Correct - Explicit foreground
<CardTitle className="text-foreground">Title</CardTitle>
```

### Mistake 3: Not Using PageHeader
```jsx
// ❌ Wrong - Inconsistent
<div className="p-6">
  <h1 className="text-3xl font-bold">Title</h1>
  <p>Description</p>
</div>

// ✅ Correct - Reusable component
<PageContainer>
  <PageHeader title="Title" description="Description" />
</PageContainer>
```

### Mistake 4: Hardcoded Backgrounds
```jsx
// ❌ Wrong
<div className="bg-white p-6">

// ✅ Correct
<PageContainer>
  {/* Content */}
</PageContainer>
```

---

## ✅ Quick Reference

### Text Colors
| Purpose | Class | Color |
|---------|-------|-------|
| Primary text | `text-foreground` | #e6edf3 (dark) |
| Secondary text | `text-muted-foreground` | #8b949e (dark) |
| Primary accent | `text-primary` | #58a6ff (dark) |
| Success | `text-emerald-500 dark:text-emerald-400` | Emerald |
| Error | `text-rose-500 dark:text-rose-400` | Rose |

### Background Colors
| Purpose | Class | Color |
|---------|-------|-------|
| Page bg | `bg-background` | #0d1117 (dark) |
| Card bg | `bg-card` | #161b22 (dark) |
| Muted bg | `bg-muted` | #21262d (dark) |
| Accent bg | `bg-accent` | #21262d (dark) |

### Border Colors
| Purpose | Class | Color |
|---------|-------|-------|
| Default border | `border-border` | #30363d (dark) |
| Input border | `border-input` | #30363d (dark) |

---

## 🔧 Implementation Checklist

When creating/updating a page:

**Structure**:
- [ ] Use `<PageContainer>` as wrapper
- [ ] Use `<PageHeader>` for title/description
- [ ] Use `space-y-*` for vertical spacing

**Colors**:
- [ ] All text uses theme variables
- [ ] All backgrounds use theme variables
- [ ] All borders use `border-border`
- [ ] No `text-gray-*` classes
- [ ] No `bg-gray-*` or `bg-white` classes

**Components**:
- [ ] Import from `@/components/ui/`
- [ ] Use shadcn/ui components
- [ ] Apply explicit color classes

**Testing**:
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify text readability
- [ ] Check contrast ratios

---

## 📚 Resources

### Official Documentation
- [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode/) - Official guide
- [shadcn/ui Dashboard](https://ui.shadcn.com/examples/dashboard) - Example reference
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode) - Tailwind docs

### Project Documentation
- `DARK_MODE_MODERN.md` - Modern implementation
- `DARK_MODE_GUIDE.md` - Complete guide
- `DARKMODE_README.md` - Quick reference
- `DARK_MODE_STANDARDS.md` - This file

### Project Files
- `apps/frontend/src/components/ui/page-header.jsx` - Reusable header
- `apps/frontend/src/components/ThemeProvider.jsx` - Theme context
- `apps/frontend/src/components/ThemeToggle.jsx` - Toggle button
- `apps/frontend/src/index.css` - Color variables

---

## 🎉 Benefits

Following these standards ensures:

1. **Consistency**: All pages look and feel the same
2. **Maintainability**: Easy to update colors globally
3. **Reusability**: Components used across pages
4. **Accessibility**: WCAG AAA compliance
5. **Performance**: CSS-only theme switching
6. **Developer Experience**: Clear patterns to follow

---

## 📋 Summary

### Mandatory Rules

1. **Use PageContainer & PageHeader** for all admin pages
2. **Use theme variables** for all colors (text, bg, border)
3. **Never hardcode** gray colors or specific color values
4. **Explicit classes** on CardTitle, TableHead, etc.
5. **Test both modes** before committing

### Color System

```
Light Mode: White bg, dark text
Dark Mode: GitHub dark (#0d1117), soft white text (#e6edf3)
Primary: GitHub blue (#58a6ff)
Muted: Readable gray (#8b949e)
```

### Components to Use

```
Layout: PageContainer, PageHeader, AdminLayout
Theme: ThemeProvider, ThemeToggle, useTheme
UI: All shadcn/ui components (auto-adaptive)
```

---

**Version**: 2.1.3  
**Standard**: shadcn/ui + Modern Web Apps  
**Maintained By**: @zonprox  
**Repository**: https://github.com/zonprox/carental

