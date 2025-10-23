# Development Guide - Car Rental Application

> **Mục tiêu:** Tối ưu hóa code reuse, đảm bảo consistency và giảm thiểu code duplication

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Code Reuse Patterns](#code-reuse-patterns)
- [Component Library](#component-library)
- [API Patterns](#api-patterns)
- [Database Patterns](#database-patterns)
- [Styling Guidelines](#styling-guidelines)
- [State Management](#state-management)
- [Common Utilities](#common-utilities)
- [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### Tech Stack

```
Frontend: React 18 + TypeScript + Vite
Backend:  Express + TypeScript + Prisma
Database: PostgreSQL
UI:       shadcn/ui + TailwindCSS
State:    React Context API
```

### Architecture Layers

```
┌─────────────────────────────────────┐
│   Client (React + TypeScript)       │
│   - Pages (Business Logic)          │
│   - Components (Reusable UI)        │
│   - Contexts (Global State)         │
│   - Lib (API Client, Utils)         │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│   Server (Express + TypeScript)     │
│   - Routes (API Endpoints)          │
│   - Middleware (Auth, Validation)   │
│   - Lib (Prisma Client)             │
└──────────────┬──────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────┐
│   Database (PostgreSQL)             │
│   - Users, Cars, Bookings           │
│   - AppConfig, Settings             │
└─────────────────────────────────────┘
```

---

## 📁 Project Structure

```
carental/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # ✅ REUSE: UI components
│   │   │   ├── ui/          # shadcn/ui base components
│   │   │   ├── layouts/     # Layout wrappers
│   │   │   └── *.tsx        # Custom components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # ✅ REUSE: Global state
│   │   ├── lib/             # ✅ REUSE: Utilities
│   │   │   ├── api.ts       # API client
│   │   │   └── utils.ts     # Helper functions
│   │   └── types/           # ✅ REUSE: TypeScript types
│   └── package.json
│
├── server/                   # Backend application
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # ✅ REUSE: Middleware
│   │   ├── lib/             # ✅ REUSE: Utilities
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── shared/                   # ✅ REUSE: Shared utilities
│   └── env.ts               # Environment config
│
└── infra/                    # Infrastructure
    └── docker/              # Docker configs
```

---

## ♻️ Code Reuse Patterns

### 1. **Component Reuse (Client)**

#### ✅ Always Reuse Base Components

**Location:** `client/src/components/ui/`

```tsx
// ❌ KHÔNG TẠO MỚI
import { MyCustomButton } from './MyCustomButton'

// ✅ REUSE shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Table } from '@/components/ui/table'
```

**Available UI Components:**
- `button.tsx` - Buttons with variants
- `card.tsx` - Cards with header/content
- `dialog.tsx` - Modals and dialogs
- `input.tsx` - Form inputs
- `table.tsx` - Data tables
- `badge.tsx` - Status badges
- `select.tsx` - Dropdowns
- `calendar.tsx` - Date picker
- `toast.tsx` / `sonner.tsx` - Notifications
- `dropdown-menu.tsx` - Context menus
- `tabs.tsx` - Tab navigation
- `switch.tsx` - Toggle switches
- `avatar.tsx` - User avatars
- `separator.tsx` - Dividers

#### ✅ Reuse Layout Components

```tsx
// ❌ KHÔNG tự tạo admin layout
const MyAdminPage = () => (
  <div className="admin-layout">...</div>
)

// ✅ REUSE AdminLayout
import { AdminLayout } from '@/components/layouts/AdminLayout'

const MyAdminPage = () => (
  <AdminLayout>
    {/* Your content */}
  </AdminLayout>
)
```

#### ✅ Reuse Custom Components

**Available Components:**
- `CarCard.tsx` - Display car info (✅ dùng cho cars listing)
- `CarQuickView.tsx` - Car detail popup (✅ dùng thay vì dialog mới)
- `Navbar.tsx` - Main navigation (✅ dùng cho public pages)
- `ThemeToggle.tsx` - Dark/Light mode (✅ dùng mọi nơi cần toggle)
- `ProtectedRoute.tsx` - Route protection (✅ dùng cho authenticated routes)
- `AuthGuard.tsx` - Auth wrapper (✅ dùng cho protected pages)

**Example:**
```tsx
// ✅ GOOD: Reuse CarCard
import { CarCard } from '@/components/CarCard'

const CarsPage = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}
```

### 2. **API Client Reuse**

**Location:** `client/src/lib/api.ts`

#### ✅ ALWAYS Use Existing API Methods

```tsx
// ❌ KHÔNG tạo fetch mới
const response = await fetch('/api/cars')

// ✅ REUSE api client
import { api } from '@/lib/api'

const cars = await api.cars.list()
const car = await api.cars.getById(id)
const newCar = await api.cars.create(data)
```

**Available API Methods:**

```typescript
// Auth
api.auth.login(credentials)
api.auth.register(data)
api.auth.logout()
api.auth.me()

// Cars
api.cars.list(params?)
api.cars.getById(id)
api.cars.create(data)
api.cars.update(id, data)
api.cars.delete(id)

// Bookings
api.bookings.list(params?)
api.bookings.getById(id)
api.bookings.create(data)
api.bookings.updateStatus(id, status)
api.bookings.delete(id)
api.bookings.stats()

// Users
api.users.list(params?)
api.users.profile()
api.users.updateProfile(data)
api.users.uploadDocument(type, file)
api.users.pendingVerification()
api.users.verifyUser(id, data)

// Settings
api.settings.get()
api.settings.update(data)
```

### 3. **Middleware Reuse (Server)**

**Location:** `server/src/middleware/`

#### ✅ Reuse Existing Middleware

```typescript
// ❌ KHÔNG tạo auth middleware mới
router.get('/protected', (req, res) => {
  if (!req.cookies.token) return res.status(401)
})

// ✅ REUSE existing middleware
import { requireAuth, requireAdmin } from '../middleware/auth'

router.get('/protected', requireAuth, handler)
router.get('/admin', requireAuth, requireAdmin, handler)
```

**Available Middleware:**
- `auth.ts`:
  - `requireAuth` - Require authentication
  - `requireAdmin` - Require admin role
  - `optionalAuth` - Optional authentication
  
- `validation.ts`:
  - `validateRequest(schema)` - Zod validation
  
- `upload.ts`:
  - `upload.single('field')` - Single file upload
  - `upload.array('field')` - Multiple files
  
- `setupGuard.ts`:
  - `requireSetup` - Ensure app is configured

### 4. **Utility Functions Reuse**

**Location:** `client/src/lib/utils.ts`

```typescript
// ✅ Available utilities
import { cn } from '@/lib/utils'

// Merge Tailwind classes
className={cn('base-class', condition && 'conditional-class')}
```

### 5. **Context Reuse**

**Location:** `client/src/contexts/`

```tsx
// ✅ REUSE SettingsContext
import { useSettings } from '@/contexts/SettingsContext'

const MyComponent = () => {
  const { settings, updateSettings } = useSettings()
  
  return <div>{settings.app_name}</div>
}
```

**Available Contexts:**
- `SettingsContext` - Global app settings
- `ThemeProvider` - Theme management

### 6. **Database Patterns**

**Location:** `server/src/lib/prisma.ts`

```typescript
// ✅ ALWAYS reuse Prisma client
import { prisma } from '../lib/prisma'

// ❌ KHÔNG tạo new PrismaClient()
const db = new PrismaClient()

// ✅ REUSE singleton
const users = await prisma.user.findMany()
```

---

## 🎨 Styling Guidelines

### TailwindCSS Utility-First

```tsx
// ✅ GOOD: Use Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-card rounded-lg border">

// ❌ AVOID: Custom CSS
<div className="my-custom-container">
```

### Common Patterns to Reuse

```tsx
// Card container
className="bg-card border rounded-lg p-6"

// Flex row with gap
className="flex items-center gap-4"

// Grid layout
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Button variants
<Button variant="default | destructive | outline | ghost">
<Button size="default | sm | lg | icon">

// Text colors
className="text-foreground | text-muted-foreground | text-primary"

// Background colors
className="bg-background | bg-card | bg-primary"

// Spacing
className="p-4 | px-6 | py-2 | m-4 | space-y-4 | gap-4"

// Borders
className="border | border-t | rounded-lg | rounded-md"
```

### Design Tokens (Follow these!)

```typescript
// Colors (via Tailwind)
bg-background      // Main background
bg-card           // Card background
bg-primary        // Primary color
bg-destructive    // Error/delete color
text-foreground   // Main text
text-muted-foreground // Secondary text

// Spacing Scale
space-y-2 | 4 | 6 | 8 | 12
gap-2 | 4 | 6 | 8
p-2 | 4 | 6 | 8 | 12

// Border Radius
rounded-sm | md | lg | xl

// Font Sizes
text-xs | sm | base | lg | xl | 2xl | 3xl
```

---

## 📋 Common Patterns

### 1. **Form Pattern**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const MyForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.something.create(formData)
      toast.success('Thành công!')
    } catch (error: any) {
      toast.error('Lỗi', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>
    </form>
  )
}
```

### 2. **Data List Pattern**

```tsx
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

const MyListPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const data = await api.items.list()
      setItems(data.items)
    } catch (error: any) {
      toast.error('Lỗi', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(item => (
        <Card key={item.id}>{item.name}</Card>
      ))}
    </div>
  )
}
```

### 3. **Modal/Dialog Pattern**

```tsx
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const MyComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Open</Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
          {/* Content */}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### 4. **Table Pattern**

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

const MyTable = ({ data }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>
            <Button size="sm">Edit</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
```

### 5. **Status Badge Pattern**

```tsx
import { Badge } from '@/components/ui/badge'

const StatusBadge = ({ status }) => {
  const config = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  }

  const { label, className } = config[status] || config.pending

  return <Badge className={className}>{label}</Badge>
}
```

---

## 🔌 API Endpoint Patterns (Server)

### Standard Route Structure

```typescript
import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const router = Router()

// Schema validation
const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

// GET list with pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.item.count(),
    ])

    res.json({
      items,
      pagination: { page: Number(page), limit: Number(limit), total },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
    })

    if (!item) {
      return res.status(404).json({ error: 'Not found' })
    }

    res.json({ item })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// POST create
router.post('/', requireAuth, validateRequest(createSchema), async (req, res) => {
  try {
    const item = await prisma.item.create({
      data: req.body,
    })

    res.status(201).json({ item })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// PUT/PATCH update
router.put('/:id', requireAuth, validateRequest(createSchema), async (req, res) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: req.body,
    })

    res.json({ item })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' })
  }
})

// DELETE
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.item.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

export default router
```

---

## 📊 Database Schema Patterns

### Common Prisma Patterns

```prisma
// Base fields for all models
model Item {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Your fields
  name      String
  
  @@index([createdAt])
}

// Relations
model User {
  id       String    @id @default(cuid())
  bookings Booking[] // One-to-many
}

model Booking {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@index([userId])
}

// Enums
enum BookingStatus {
  pending
  confirmed
  completed
  cancelled
}
```

---

## ✅ Best Practices Checklist

### Before Writing New Code

- [ ] Check if similar component exists in `components/ui/`
- [ ] Check if similar component exists in `components/`
- [ ] Check if API method exists in `lib/api.ts`
- [ ] Check if middleware exists in `middleware/`
- [ ] Check if utility function exists in `lib/utils.ts`
- [ ] Review similar pages for patterns

### When Creating Components

- [ ] Use TypeScript with proper types
- [ ] Use shadcn/ui components as base
- [ ] Follow Tailwind utility-first approach
- [ ] Make components reusable (accept props)
- [ ] Extract common logic to utilities
- [ ] Use consistent spacing/layout patterns

### When Creating API Routes

- [ ] Use existing middleware (auth, validation)
- [ ] Reuse Prisma client singleton
- [ ] Follow standard CRUD pattern
- [ ] Add proper error handling
- [ ] Use Zod for validation
- [ ] Return consistent response format

### Code Quality

- [ ] No `any` types (use proper TypeScript)
- [ ] No inline styles (use Tailwind)
- [ ] No duplicate code (extract to functions/components)
- [ ] Proper error handling
- [ ] Loading states for async operations
- [ ] Accessibility (ARIA labels, keyboard nav)

---

## 🚀 Development Workflow

### 1. Starting Development

```bash
# Install dependencies
npm install

# Start database
cd infra/docker
docker-compose up -d db

# Run migrations
cd ../../server
npm run migrate:dev

# Start dev servers
npm run dev  # From root (starts both client & server)
```

### 2. Adding New Feature

1. **Check existing code** for similar patterns
2. **Reuse components/utilities** where possible
3. **Follow established patterns** from this guide
4. **Test locally** before committing
5. **Update this guide** if adding reusable patterns

### 3. Code Review Checklist

- Code reuse maximized?
- TypeScript types proper?
- Error handling present?
- Loading states added?
- Tailwind classes used correctly?
- Responsive design?
- Accessibility considered?

---

## 📚 Quick Reference

### Most Used Imports

```typescript
// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Layouts
import { AdminLayout } from '@/components/layouts/AdminLayout'

// API
import { api } from '@/lib/api'

// Utils
import { cn } from '@/lib/utils'

// Toast
import { toast } from 'sonner'

// Server
import { requireAuth, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { prisma } from '../lib/prisma'
```

### Common Tailwind Classes

```
// Layout
flex items-center justify-between gap-4
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

// Spacing
p-4 px-6 py-2
space-y-4 space-x-2

// Colors
bg-card bg-background text-foreground text-muted-foreground

// Borders
border rounded-lg

// Typography
text-sm text-lg font-medium font-bold
```

---

## 🎯 Summary

**Golden Rules:**

1. ✅ **ALWAYS check existing code first**
2. ✅ **Reuse shadcn/ui components**
3. ✅ **Use established API patterns**
4. ✅ **Follow Tailwind utility-first**
5. ✅ **Extract duplicated code**
6. ✅ **Use TypeScript properly**
7. ✅ **Test before committing**

**When in doubt:** Look at existing similar pages/components and follow the same pattern!

---

**Last Updated:** October 23, 2025
**Version:** 1.0.0
