# API Documentation

> **Complete API reference for Car Rental Application**

## Base URL

```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

## Authentication

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Cookies

```
token=<jwt_token>; HttpOnly; Secure; SameSite=Strict
```

---

## Endpoints

### 🔐 Authentication

#### POST `/auth/register`

Register new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "isVerified": false
  }
}
```

#### POST `/auth/login`

Login user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "isVerified": true
  }
}
```

#### POST `/auth/logout`

Logout current user

**Auth:** Required

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### GET `/auth/me`

Get current user

**Auth:** Required

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "isAdmin": false,
    "isVerified": true,
    "idCardImage": "...",
    "driverLicenseImage": "..."
  }
}
```

---

### 🚗 Cars

#### GET `/cars`

List all cars (with optional filters)

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 10)
search: string
type: 'sedan' | 'suv' | 'van' | 'other'
minPrice: number
maxPrice: number
available: boolean
featured: boolean
```

**Response:**
```json
{
  "cars": [
    {
      "id": "...",
      "name": "Toyota Camry",
      "brand": "Toyota",
      "type": "sedan",
      "seats": 5,
      "transmission": "automatic",
      "fuel": "petrol",
      "dailyPrice": 500000,
      "priceWithDriver": 700000,
      "image": "/uploads/...",
      "available": true,
      "featured": true,
      "year": 2023,
      "licensePlate": "30A-12345"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### GET `/cars/:id`

Get car by ID

**Response:**
```json
{
  "car": {
    "id": "...",
    "name": "Toyota Camry",
    "brand": "Toyota",
    "type": "sedan",
    "dailyPrice": 500000,
    "priceWithDriver": 700000,
    "description": "Luxury sedan...",
    "available": true
  }
}
```

#### POST `/cars`

Create new car

**Auth:** Admin required

**Request:**
```json
{
  "name": "Toyota Camry",
  "brand": "Toyota",
  "type": "sedan",
  "seats": 5,
  "transmission": "automatic",
  "fuel": "petrol",
  "dailyPrice": 500000,
  "priceWithDriver": 700000,
  "description": "Luxury sedan",
  "year": 2023,
  "licensePlate": "30A-12345",
  "location": "Hanoi",
  "featured": false
}
```

**Response:**
```json
{
  "car": { ... }
}
```

#### PUT `/cars/:id`

Update car

**Auth:** Admin required

**Request:** Same as create

**Response:**
```json
{
  "car": { ... }
}
```

#### DELETE `/cars/:id`

Delete car

**Auth:** Admin required

**Response:**
```json
{
  "message": "Car deleted successfully"
}
```

---

### 📅 Bookings

#### GET `/bookings`

List bookings

**Auth:** Required (Admin sees all, user sees own)

**Query Parameters:**
```
page: number
limit: number
status: BookingStatus
search: string
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "...",
      "carId": "...",
      "carName": "Toyota Camry",
      "userId": "...",
      "startDate": "2025-10-25T00:00:00Z",
      "endDate": "2025-10-27T00:00:00Z",
      "withDriver": true,
      "totalPrice": 2100000,
      "status": "confirmed",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "0123456789",
      "notes": "Airport pickup",
      "createdAt": "2025-10-23T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET `/bookings/:id`

Get booking by ID

**Auth:** Required

**Response:**
```json
{
  "booking": {
    "id": "...",
    "car": {
      "name": "Toyota Camry",
      "image": "..."
    },
    "startDate": "...",
    "endDate": "...",
    "totalPrice": 2100000,
    "status": "confirmed"
  }
}
```

#### POST `/bookings`

Create booking

**Auth:** Required

**Request:**
```json
{
  "carId": "...",
  "startDate": "2025-10-25",
  "endDate": "2025-10-27",
  "withDriver": true,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "0123456789",
  "customerAddress": "123 Street, Hanoi",
  "notes": "Airport pickup please"
}
```

**Response:**
```json
{
  "booking": { ... }
}
```

#### PATCH `/bookings/:id/status`

Update booking status

**Auth:** Admin required

**Request:**
```json
{
  "status": "confirmed",
  "verificationNotes": "ID verified"
}
```

**Response:**
```json
{
  "booking": { ... }
}
```

#### DELETE `/bookings/:id`

Cancel/Delete booking

**Auth:** Required (Admin can delete any, user can delete own)

**Response:**
```json
{
  "message": "Booking deleted successfully"
}
```

#### GET `/bookings/stats`

Get booking statistics

**Auth:** Admin required

**Response:**
```json
{
  "totalBookings": 150,
  "pendingBookings": 10,
  "activeBookings": 25,
  "completedBookings": 100,
  "totalRevenue": 150000000,
  "revenueByMonth": {
    "2025-10": 15000000,
    "2025-09": 12000000
  }
}
```

---

### 👤 Users

#### GET `/users`

List users

**Auth:** Admin required

**Query Parameters:**
```
page: number
limit: number
search: string
verified: boolean
```

**Response:**
```json
{
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "isVerified": true,
      "isAdmin": false,
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

#### GET `/users/profile`

Get current user profile

**Auth:** Required

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Street",
    "idCardImage": "/uploads/...",
    "driverLicenseImage": "/uploads/...",
    "isVerified": true
  }
}
```

#### PUT `/users/profile`

Update profile

**Auth:** Required

**Request:**
```json
{
  "name": "John Updated",
  "phone": "0987654321",
  "address": "456 New Street"
}
```

**Response:**
```json
{
  "user": { ... }
}
```

#### POST `/users/upload/:type`

Upload document

**Auth:** Required

**Params:** `type = 'idCard' | 'driverLicense'`

**Request:** FormData with file

**Response:**
```json
{
  "user": {
    "idCardImage": "/uploads/...",
    "driverLicenseImage": "/uploads/..."
  }
}
```

#### GET `/users/pending-verification`

Get users pending verification

**Auth:** Admin required

**Response:**
```json
{
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "idCardImage": "/uploads/...",
      "driverLicenseImage": "/uploads/...",
      "isVerified": false
    }
  ]
}
```

#### POST `/users/:id/verify`

Verify user

**Auth:** Admin required

**Request:**
```json
{
  "status": "approved",
  "notes": "Documents verified"
}
```

**Response:**
```json
{
  "user": {
    "isVerified": true
  }
}
```

#### PATCH `/users/:id/role`

Update user role

**Auth:** Admin required

**Request:**
```json
{
  "isAdmin": true
}
```

**Response:**
```json
{
  "user": {
    "isAdmin": true
  }
}
```

---

### ⚙️ Settings

#### GET `/settings`

Get all app settings

**Auth:** Admin required

**Response:**
```json
{
  "settings": {
    "app_name": "Car Rental",
    "app_url": "http://localhost:5173",
    "server_port": "4000",
    "client_port": "5173",
    "db_mode": "docker",
    "allow_registration": "true",
    "require_verification": "true",
    "enable_driver_option": "true"
  }
}
```

#### PUT `/settings`

Update settings

**Auth:** Admin required

**Request:**
```json
{
  "app_name": "My Car Rental",
  "allow_registration": "false"
}
```

**Response:**
```json
{
  "settings": { ... }
}
```

---

### 🏥 Health

#### GET `/health`

Health check endpoint

**Response:**
```json
{
  "status": "ok" | "needs_setup",
  "timestamp": "2025-10-23T15:00:00Z",
  "database": "connected" | "disconnected",
  "configured": true | false
}
```

---

### 🔧 Setup

#### GET `/setup`

Get setup status

**Response:**
```json
{
  "configured": false,
  "config": {
    "appUrl": null,
    "serverPort": null,
    "dbMode": null
  }
}
```

#### POST `/setup`

Complete initial setup

**Request:**
```json
{
  "adminName": "Admin User",
  "adminEmail": "admin@example.com",
  "adminPassword": "securepassword",
  "adminPhone": "0123456789",
  "appUrl": "http://localhost:5173",
  "serverPort": 4000,
  "clientPort": 5173,
  "dbMode": "docker",
  "dbHost": "localhost",
  "dbPort": 5432,
  "dbName": "carental",
  "dbUser": "user",
  "dbPassword": "password"
}
```

**Response:**
```json
{
  "message": "Setup completed successfully",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

---

## Status Codes

```
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Internal Server Error
```

## Error Response Format

```json
{
  "error": "Error message here"
}
```

## Booking Status Flow

```
pending
  ↓
verified (admin verified documents)
  ↓
confirmed (admin confirmed booking)
  ↓
delivered (car delivered to customer)
  ↓
active (rental period active)
  ↓
returning (customer returning car)
  ↓
completed (rental completed)

OR

cancelled (at any point)
```

## File Upload

**Endpoint:** POST `/users/upload/:type`

**Content-Type:** `multipart/form-data`

**Max Size:** 5MB

**Allowed Types:** jpg, jpeg, png, pdf

**Field Name:** `file`

**Example:**
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])

await fetch('/api/users/upload/idCard', {
  method: 'POST',
  body: formData,
  credentials: 'include'
})
```

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production.

## CORS

Configured to allow:
- Origin: `http://localhost:5173` (configurable)
- Credentials: true
- Methods: GET, POST, PUT, PATCH, DELETE

---

**Last Updated:** October 23, 2025
