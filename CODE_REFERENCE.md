# Code Reference - Quick Lookup

> **Quick reference cho toàn bộ reusable code trong project**

## 📦 Available Components

### UI Components (`client/src/components/ui/`)

| Component | Usage | Props |
|-----------|-------|-------|
| `Button` | Buttons với variants | `variant`, `size`, `disabled` |
| `Card` | Container cards | `CardHeader`, `CardTitle`, `CardContent` |
| `Dialog` | Modals/Dialogs | `open`, `onOpenChange` |
| `Input` | Text inputs | `type`, `value`, `onChange` |
| `Label` | Form labels | `htmlFor` |
| `Table` | Data tables | `TableHeader`, `TableBody`, `TableRow` |
| `Badge` | Status badges | `variant`, `className` |
| `Select` | Dropdowns | `value`, `onValueChange` |
| `Calendar` | Date picker | `mode`, `selected`, `onSelect` |
| `Tabs` | Tab navigation | `TabsList`, `TabsTrigger`, `TabsContent` |
| `Switch` | Toggle switches | `checked`, `onCheckedChange` |
| `Avatar` | User avatars | `AvatarImage`, `AvatarFallback` |
| `Dropdown Menu` | Context menus | `DropdownMenuTrigger`, `DropdownMenuContent` |
| `Textarea` | Multi-line input | `value`, `onChange` |
| `Toast` / `Sonner` | Notifications | `toast.success()`, `toast.error()` |
| `Tooltip` | Hover tooltips | `TooltipTrigger`, `TooltipContent` |
| `Separator` | Dividers | - |
| `Scroll Area` | Scrollable areas | - |
| `Skeleton` | Loading placeholders | - |

### Custom Components (`client/src/components/`)

| Component | Purpose | Usage |
|-----------|---------|-------|
| `CarCard` | Display car info | `<CarCard car={car} />` |
| `CarQuickView` | Car detail popup | `<CarQuickView car={car} onClose={fn} />` |
| `Navbar` | Main navigation | `<Navbar />` |
| `ThemeToggle` | Dark/Light toggle | `<ThemeToggle />` |
| `ProtectedRoute` | Auth route wrapper | `<ProtectedRoute><Page /></ProtectedRoute>` |
| `AuthGuard` | Auth page wrapper | `<AuthGuard><Content /></AuthGuard>` |

### Layout Components (`client/src/components/layouts/`)

| Component | Purpose | Usage |
|-----------|---------|-------|
| `AdminLayout` | Admin panel layout | Wrap admin pages |

---

## 🔌 API Methods Reference

### Auth (`api.auth.*`)

```typescript
api.auth.login({ email, password })
api.auth.register({ name, email, password, phone })
api.auth.logout()
api.auth.me()  // Get current user
```

### Cars (`api.cars.*`)

```typescript
api.cars.list({ page?, limit?, search?, type?, minPrice?, maxPrice? })
api.cars.getById(id)
api.cars.create({ name, brand, type, dailyPrice, ... })
api.cars.update(id, data)
api.cars.delete(id)
```

### Bookings (`api.bookings.*`)

```typescript
api.bookings.list({ page?, limit?, status?, search? })
api.bookings.getById(id)
api.bookings.create({ carId, startDate, endDate, ... })
api.bookings.updateStatus(id, { status, notes? })
api.bookings.delete(id)
api.bookings.stats()  // Get statistics
```

### Users (`api.users.*`)

```typescript
api.users.list({ page?, limit?, search?, verified? })
api.users.profile()
api.users.updateProfile({ name?, phone?, address? })
api.users.uploadDocument(type, file)  // 'idCard' | 'driverLicense'
api.users.pendingVerification()
api.users.verifyUser(id, { status, notes? })
api.users.updateRole(id, { isAdmin })
```

### Settings (`api.settings.*`)

```typescript
api.settings.get()
api.settings.update({ app_name?, ... })
```

---

## 🛡️ Middleware Reference

### Auth Middleware (`server/src/middleware/auth.ts`)

```typescript
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth'

// Require logged in user
router.get('/profile', requireAuth, handler)

// Require admin role
router.post('/admin', requireAuth, requireAdmin, handler)

// Optional auth (sets req.user if logged in)
router.get('/public', optionalAuth, handler)
```

### Validation Middleware (`server/src/middleware/validation.ts`)

```typescript
import { validateRequest } from '../middleware/validation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

router.post('/', validateRequest(schema), handler)
```

### Upload Middleware (`server/src/middleware/upload.ts`)

```typescript
import { upload } from '../middleware/upload'

// Single file
router.post('/upload', upload.single('file'), handler)

// Multiple files
router.post('/upload', upload.array('files', 5), handler)

// Access file
req.file.filename
req.file.path
```

### Setup Guard (`server/src/middleware/setupGuard.ts`)

```typescript
import { requireSetup } from '../middleware/setupGuard'

// Require app configured
router.get('/dashboard', requireSetup, handler)
```

---

## 🎨 Tailwind Patterns

### Layout Patterns

```tsx
// Flex row with gap
<div className="flex items-center gap-4">

// Flex column
<div className="flex flex-col space-y-4">

// Centered
<div className="flex items-center justify-center">

// Space between
<div className="flex items-center justify-between">

// Grid 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Full width container
<div className="container mx-auto px-4 py-8">
```

### Card Patterns

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>

// Card with custom styling
<Card className="bg-card border rounded-lg">
```

### Button Patterns

```tsx
// Primary button
<Button>Click me</Button>

// Destructive (delete)
<Button variant="destructive">Delete</Button>

// Outline
<Button variant="outline">Cancel</Button>

// Ghost (subtle)
<Button variant="ghost">More</Button>

// Small size
<Button size="sm">Small</Button>

// Icon button
<Button size="icon">
  <Icon className="h-4 w-4" />
</Button>

// With icon
<Button>
  <Icon className="h-4 w-4 mr-2" />
  Text
</Button>
```

### Form Patterns

```tsx
<div className="space-y-4">
  <div>
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="Enter name" />
  </div>
  
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  
  <Button type="submit">Submit</Button>
</div>
```

### Badge Patterns

```tsx
// Status badges
<Badge className="bg-green-100 text-green-700">Active</Badge>
<Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
<Badge className="bg-red-100 text-red-700">Cancelled</Badge>
<Badge className="bg-blue-100 text-blue-700">Confirmed</Badge>
```

---

## 🗄️ Database Schema Reference

### Available Models

```typescript
// User
{
  id: string
  email: string
  name: string
  phone: string
  passwordHash: string
  isAdmin: boolean
  isVerified: boolean
  idCardImage: string?
  driverLicenseImage: string?
  address: string?
  createdAt: DateTime
  updatedAt: DateTime
  bookings: Booking[]
}

// Car
{
  id: string
  name: string
  brand: string
  type: string  // 'sedan' | 'suv' | 'van' | 'other'
  seats: number
  transmission: string
  fuel: string
  dailyPrice: number
  priceWithDriver: number?
  image: string?
  description: string?
  year: number?
  licensePlate: string?
  location: string?
  available: boolean
  featured: boolean
  createdAt: DateTime
  updatedAt: DateTime
  bookings: Booking[]
}

// Booking
{
  id: string
  userId: string
  carId: string
  startDate: DateTime
  endDate: DateTime
  withDriver: boolean
  totalPrice: number
  status: BookingStatus
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string?
  notes: string?
  verificationNotes: string?
  createdAt: DateTime
  updatedAt: DateTime
  user: User
  car: Car
}

// BookingStatus enum
'pending' | 'verified' | 'confirmed' | 'delivered' | 
'active' | 'returning' | 'completed' | 'cancelled'

// AppConfig
{
  id: string
  key: string
  value: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Common Prisma Queries

```typescript
// Find all with pagination
await prisma.car.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
})

// Find with relations
await prisma.booking.findMany({
  include: {
    car: true,
    user: true,
  },
})

// Find with where clause
await prisma.car.findMany({
  where: {
    available: true,
    type: 'sedan',
    dailyPrice: { lte: 500000 },
  },
})

// Create
await prisma.car.create({
  data: { name, brand, type, dailyPrice },
})

// Update
await prisma.car.update({
  where: { id },
  data: { available: false },
})

// Delete
await prisma.car.delete({
  where: { id },
})

// Count
await prisma.car.count({
  where: { available: true },
})

// Aggregate
await prisma.booking.aggregate({
  _sum: { totalPrice: true },
  where: { status: 'completed' },
})
```

---

## 🎯 Common Code Snippets

### Loading State Pattern

```tsx
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    await api.something()
  } catch (error: any) {
    toast.error('Error', { description: error.message })
  } finally {
    setLoading(false)
  }
}

return <Button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

### Data Fetching Pattern

```tsx
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  try {
    const result = await api.items.list()
    setData(result.items)
  } catch (error: any) {
    toast.error('Error', { description: error.message })
  } finally {
    setLoading(false)
  }
}
```

### Delete Confirmation Pattern

```tsx
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure?')) return
  
  try {
    await api.items.delete(id)
    toast.success('Deleted successfully')
    fetchData() // Refresh list
  } catch (error: any) {
    toast.error('Error', { description: error.message })
  }
}
```

### File Upload Pattern

```tsx
const [uploading, setUploading] = useState(false)

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  setUploading(true)
  try {
    await api.users.uploadDocument('idCard', file)
    toast.success('Uploaded successfully')
  } catch (error: any) {
    toast.error('Error', { description: error.message })
  } finally {
    setUploading(false)
  }
}

return <Input type="file" onChange={handleFileUpload} disabled={uploading} />
```

### Search/Filter Pattern

```tsx
const [searchQuery, setSearchQuery] = useState('')
const [filteredData, setFilteredData] = useState([])

useEffect(() => {
  if (searchQuery === '') {
    setFilteredData(data)
  } else {
    setFilteredData(
      data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }
}, [searchQuery, data])

return (
  <Input
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
)
```

---

## 📚 TypeScript Types Reference

### Common Types

```typescript
// User
interface User {
  id: string
  email: string
  name: string
  phone: string
  isAdmin: boolean
  isVerified: boolean
}

// Car
interface Car {
  id: string
  name: string
  brand: string
  type: string
  dailyPrice: number
  priceWithDriver?: number
  available: boolean
  featured: boolean
}

// Booking
interface Booking {
  id: string
  carId: string
  carName: string
  startDate: string
  endDate: string
  withDriver: boolean
  totalPrice: number
  status: BookingStatus
  customerName: string
  customerEmail: string
  customerPhone: string
}

type BookingStatus = 
  | 'pending' 
  | 'verified' 
  | 'confirmed' 
  | 'delivered'
  | 'active' 
  | 'returning' 
  | 'completed' 
  | 'cancelled'

// API Response
interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}
```

---

## 🔍 Where to Find Things

### Need a UI component?
→ Check `client/src/components/ui/`

### Need an API call?
→ Check `client/src/lib/api.ts`

### Need authentication?
→ Check `server/src/middleware/auth.ts`

### Need file upload?
→ Check `server/src/middleware/upload.ts`

### Need validation?
→ Use Zod + `server/src/middleware/validation.ts`

### Need styling?
→ Use Tailwind utilities (see patterns above)

### Need a layout?
→ Check `client/src/components/layouts/`

### Need database access?
→ Use `server/src/lib/prisma.ts`

### Need global state?
→ Check `client/src/contexts/`

---

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start both client & server
npm run build            # Build both
npm run lint             # Lint check

# Database
npm run migrate:dev      # Run migrations (dev)
npm run migrate          # Run migrations (prod)
npm run prisma:generate  # Generate Prisma client
npm run seed             # Seed database

# Docker
cd infra/docker
docker-compose --profile dev up -d    # Start all services
docker-compose --profile dev down     # Stop all
docker-compose logs -f server         # View logs
```

---

**Last Updated:** October 23, 2025
