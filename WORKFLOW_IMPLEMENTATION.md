# 🚗 Complete Car Rental Workflow - Implementation Guide

## ✅ **PHASE 1: FOUNDATION (COMPLETED)**

### Database Schema
**Status:** ✅ Complete & Deployed

The database now supports the complete workflow:

#### User Verification Fields:
- `isVerified`: Boolean flag for account verification status
- `verificationStatus`: unverified | pending | verified | rejected
- `idCardUrl`: URL to uploaded ID card/CCCD image
- `driverLicenseUrl`: URL to uploaded driver's license image
- `verificationNotes`: Staff notes during verification
- `verifiedAt`, `verifiedBy`: Audit trail

#### Booking Lifecycle Fields:
- **Pricing**: `basePrice`, `driverPrice`, `depositAmount`, `paidAmount`
- **Additional Charges**: `cleaningFee`, `damageFee`, `overtimeFee`, `fuelFee`, `otherFees`
- **Delivery/Return**: `deliveryAddress`, `deliveryDate`, `returnDate`, `actualReturnDate`
- **Status Tracking**: `verifiedAt`, `confirmedAt`, `deliveredAt`, `completedAt`
- **Notes**: `deliveryNotes`, `returnNotes`, `feesNotes`

#### Status Workflow:
```
pending → verified → confirmed → delivered → active → returning → completed/cancelled
```

### Backend APIs
**Status:** ✅ Complete

- ✅ Cars API (with priceWithDriver)
- ✅ Bookings API (create, list, stats, status updates)
- ✅ Users API (CRUD, verification support)
- ✅ Authentication & Authorization

---

## 🔧 **PHASE 2: CUSTOMER BOOKING FLOW (NEXT PRIORITY)**

### 2.1 Enhanced CarDetailPage with Booking Form
**File:** `client/src/pages/CarDetailPage.tsx`

**Features Needed:**
- ✅ Date picker for start/end dates (already has basic version)
- ⚠️ **TODO:** Add driver option toggle with price calculation
- ⚠️ **TODO:** Add customer info form (name, email, phone, delivery address)
- ⚠️ **TODO:** Show price breakdown:
  - Base rental: [X] days × [Y] đ = [Z] đ
  - Driver service: [X] days × [Y] đ = [Z] đ (if selected)
  - **Total: [Amount] đ**
  - **Deposit required (30%): [Amount] đ**
- ⚠️ **TODO:** Check user verification status before booking
- ⚠️ **TODO:** Call `api.bookings.create()` on submit

**Implementation Steps:**
1. Update CarDetailPage to fetch user verification status
2. Add checkbox for "With Driver" option
3. Real-time price calculation based on dates + driver option
4. Form validation for customer info
5. Redirect to login if not authenticated
6. Show verification required message if user not verified
7. Create booking and redirect to "My Bookings" page

---

### 2.2 Customer Profile & Verification Page
**File:** `client/src/pages/ProfilePage.tsx` (NEW)

**Features Needed:**
- ⚠️ **TODO:** Display user info (email, name, phone, address)
- ⚠️ **TODO:** Show verification status badge:
  - 🔴 Unverified
  - 🟡 Pending Review
  - 🟢 Verified
  - ⚠️ Rejected (with reason)
- ⚠️ **TODO:** Document upload section:
  - Upload ID Card/CCCD (front & back)
  - Upload Driver's License (front & back)
  - Preview uploaded documents
  - Submit for verification button
- ⚠️ **TODO:** Update profile info form

**Implementation Steps:**
1. Create ProfilePage component
2. Add file upload input (accept images only)
3. Implement image preview
4. Call upload API endpoint (needs to be created)
5. Update verification status to "pending" when submitted
6. Add route `/profile` to App.tsx

---

### 2.3 Customer Bookings Page
**File:** `client/src/pages/MyBookingsPage.tsx` (NEW)

**Features Needed:**
- ⚠️ **TODO:** List all user's bookings
- ⚠️ **TODO:** Filter by status (upcoming, active, completed)
- ⚠️ **TODO:** Show booking details:
  - Car info with image
  - Dates (start/end)
  - Price breakdown
  - Status with color badge
  - Timeline/progress indicator
- ⚠️ **TODO:** Actions based on status:
  - **Pending:** Cancel booking button
  - **Verified:** Wait for staff confirmation
  - **Confirmed:** View details, contact info
  - **Delivered:** Active rental info
  - **Returning:** Awaiting completion
  - **Completed:** View receipt, rate/review

**Implementation Steps:**
1. Create MyBookingsPage component
2. Fetch bookings using `api.bookings.list({ userId })`
3. Create BookingCard component for each booking
4. Add status badge with color coding
5. Implement cancel booking functionality
6. Add route `/my-bookings` to App.tsx
7. Add link in Navbar for logged-in users

---

## 👨‍💼 **PHASE 3: ADMIN/STAFF WORKFLOW**

### 3.1 User Verification Dashboard
**File:** `client/src/pages/AdminVerificationPage.tsx` (NEW)

**Features Needed:**
- ⚠️ **TODO:** List users with "pending" verification status
- ⚠️ **TODO:** Show user details and uploaded documents
- ⚠️ **TODO:** Document viewer (ID card, driver's license)
- ⚠️ **TODO:** Approve/Reject actions with notes field
- ⚠️ **TODO:** Quick filters (pending, verified, rejected)
- ⚠️ **TODO:** Search by name/email

**Implementation Steps:**
1. Create AdminVerificationPage
2. Fetch users with `verificationStatus: "pending"`
3. Display documents in modal/dialog
4. Add approve button → calls `api.users.update(id, { verificationStatus: "verified", verifiedAt: now, verifiedBy: adminId })`
5. Add reject button with notes → calls `api.users.update(id, { verificationStatus: "rejected", verificationNotes: notes })`
6. Add route `/admin/verification` to App.tsx
7. Add to admin navigation menu

---

### 3.2 Enhanced Booking Management
**File:** `client/src/pages/AdminBookingsPage.tsx` (UPDATE EXISTING)

**Features to Add:**
- ⚠️ **TODO:** Status workflow buttons:
  - **Pending:** Check user verification → Move to "Verified"
  - **Verified:** Confirm booking → Move to "Confirmed"
  - **Confirmed:** Mark as Delivered → Move to "Delivered"
  - **Delivered:** Mark as Active → Move to "Active"
  - **Active:** Mark as Returning → Move to "Returning"
  - **Returning:** Add charges & Complete → Move to "Completed"
- ⚠️ **TODO:** Additional charges form:
  - Cleaning fee input
  - Damage fee input (with notes)
  - Overtime fee input (auto-calculate from late return)
  - Fuel fee input
  - Other fees input
  - Total additional charges calculation
- ⚠️ **TODO:** Delivery/Return information:
  - Delivery date/time input
  - Delivery notes
  - Return date/time input
  - Return notes
  - Actual return date (auto-populated)
- ⚠️ **TODO:** Payment tracking:
  - Show deposit paid
  - Show total amount
  - Show additional charges
  - Show balance due
  - Mark as "Paid" button

**Implementation Steps:**
1. Update AdminBookingsPage detail modal
2. Add status transition buttons based on current status
3. Create AdditionalChargesForm component
4. Add delivery/return datetime pickers
5. Calculate overtime automatically if return late
6. Show payment summary section
7. Update booking status via `api.bookings.updateStatus()`
8. Update charges via new API endpoint (needs to be created)

---

### 3.3 Enhanced Dashboard with Analytics
**File:** `client/src/pages/AdminDashboard.tsx` (UPDATE)

**Charts & Stats Needed:**
- ⚠️ **TODO:** Revenue chart (last 6 months) using Recharts
- ⚠️ **TODO:** Booking status pie chart
- ⚠️ **TODO:** Stats cards:
  - Total revenue (completed bookings)
  - Active rentals count
  - Pending verifications count
  - Total users / Verified users
- ⚠️ **TODO:** Popular cars list
- ⚠️ **TODO:** Recent activities feed

**Implementation Steps:**
1. Install recharts (✅ already done)
2. Fetch dashboard stats via `api.bookings.stats()`
3. Create RevenueChart component using LineChart
4. Create StatusPieChart using PieChart
5. Add stat cards with icons
6. Fetch and display popular cars
7. Add recent activities section

---

## 📁 **PHASE 4: FILE UPLOAD SYSTEM**

### 4.1 Backend Upload API
**File:** `server/src/routes/uploads.ts` (NEW)

**Features Needed:**
- ⚠️ **TODO:** File upload endpoint using `multer`
- ⚠️ **TODO:** Image validation (size, format)
- ⚠️ **TODO:** Store files in `/uploads` directory
- ⚠️ **TODO:** Return file URL
- ⚠️ **TODO:** Secure file access (only owner or admin)

**Implementation Steps:**
1. Install `multer` package
2. Create uploads router with POST `/api/uploads`
3. Configure multer storage (disk or S3)
4. Add image validation middleware
5. Return file path/URL in response
6. Add static file serving in Express
7. Register route in `index.ts`

---

### 4.2 Frontend Upload Component
**File:** `client/src/components/FileUpload.tsx` (NEW)

**Features:**
- ⚠️ **TODO:** Drag & drop file input
- ⚠️ **TODO:** Image preview before upload
- ⚠️ **TODO:** Upload progress indicator
- ⚠️ **TODO:** File size/format validation
- ⚠️ **TODO:** Remove/replace uploaded file

---

## 📧 **PHASE 5: NOTIFICATIONS (OPTIONAL)**

### Email Notifications
**Trigger Events:**
- ⚠️ User registration → Welcome email
- ⚠️ Document submission → "Under review" email
- ⚠️ Verification approved → "Account verified" email
- ⚠️ Verification rejected → Rejection reason email
- ⚠️ Booking created → Confirmation email
- ⚠️ Booking confirmed by staff → Confirmation email with details
- ⚠️ Delivery scheduled → Delivery info email
- ⚠️ Rental active → Reminder email
- ⚠️ Return reminder → Email 1 day before return date
- ⚠️ Booking completed → Receipt email

**Implementation:**
Use services like:
- **Nodemailer** (for SMTP)
- **SendGrid** or **Mailgun** (for production)

---

## 🔒 **PHASE 6: SECURITY & OPTIMIZATION**

### Security Enhancements
- ⚠️ **TODO:** Rate limiting on API endpoints
- ⚠️ **TODO:** File upload virus scanning
- ⚠️ **TODO:** Sanitize user inputs
- ⚠️ **TODO:** HTTPS enforcement
- ⚠️ **TODO:** CORS configuration review
- ⚠️ **TODO:** Helmet.js security headers

### Performance
- ⚠️ **TODO:** Add Redis caching for frequently accessed data
- ⚠️ **TODO:** Database query optimization
- ⚠️ **TODO:** Image optimization (compression, thumbnails)
- ⚠️ **TODO:** Implement lazy loading
- ⚠️ **TODO:** Add pagination to all lists

---

## 📊 **CURRENT SYSTEM STATUS**

### ✅ **What's Working Now:**

1. **User Management**
   - Registration & Login ✅
   - Admin user management (CRUD) ✅
   - Profile schema ready (verification fields) ✅

2. **Car Management**
   - Full CRUD operations ✅
   - Price with driver support ✅
   - Featured cars ✅
   - Search & filter ✅

3. **Basic Booking**
   - Create booking API ✅
   - List bookings (admin) ✅
   - Status updates ✅
   - Price calculation (base + driver) ✅

4. **Admin Dashboard**
   - Basic layout ✅
   - Quick stats ✅
   - Navigation ✅

5. **Database**
   - Complete schema for workflow ✅
   - User verification fields ✅
   - Booking lifecycle fields ✅
   - Additional charges fields ✅

---

## 🚀 **QUICK START IMPLEMENTATION PRIORITY**

### **Week 1: Customer Flow**
1. Update CarDetailPage with booking form
2. Create ProfilePage with document upload (mock upload for now)
3. Create MyBookingsPage

### **Week 2: Admin Verification**
4. Create AdminVerificationPage
5. Implement file upload API
6. Connect upload to ProfilePage

### **Week 3: Booking Lifecycle**
7. Enhanced AdminBookingsPage with charges
8. Status workflow implementation
9. Payment tracking

### **Week 4: Dashboard & Polish**
10. Dashboard charts with real data
11. Email notifications
12. Testing & bug fixes

---

## 🛠 **IMMEDIATE NEXT STEPS**

1. **Update CarDetailPage** - Add booking form with:
   - Driver option toggle
   - Customer info fields
   - Price calculator
   - Submit booking button

2. **Create ProfilePage** - For document upload:
   ```tsx
   // Route: /profile
   // Shows: User info, verification status, document upload
   ```

3. **Create MyBookingsPage** - Customer booking history:
   ```tsx
   // Route: /my-bookings
   // Shows: All user bookings with status tracking
   ```

4. **Create AdminVerificationPage** - Staff verification:
   ```tsx
   // Route: /admin/verification
   // Shows: Pending verifications with approve/reject
   ```

---

## 📞 **API Endpoints Available**

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - List cars (with filters)
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Create car (admin)
- `PUT /api/cars/:id` - Update car (admin)
- `DELETE /api/cars/:id` - Delete car (admin)

### Bookings
- `GET /api/bookings` - List bookings (admin)
- `GET /api/bookings/stats` - Get statistics (admin)
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking (authenticated)
- `PATCH /api/bookings/:id/status` - Update status (admin)
- `DELETE /api/bookings/:id` - Delete booking (admin)

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/stats` - Get statistics (admin)
- `GET /api/users/:id` - Get user details (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### TODO - Upload (Not yet implemented)
- `POST /api/uploads` - Upload file
- `GET /uploads/:filename` - Get uploaded file

---

## 🎯 **SUCCESS CRITERIA**

The system will be complete when:

1. ✅ Customer can browse cars
2. ⚠️ Customer can create booking with driver option
3. ⚠️ Customer can upload verification documents
4. ⚠️ Staff can review and approve/reject documents
5. ⚠️ Verified customers can proceed with booking
6. ⚠️ Staff can confirm bookings
7. ⚠️ Staff can mark delivery/return with dates
8. ⚠️ Staff can add additional charges
9. ⚠️ System tracks complete booking lifecycle
10. ⚠️ Dashboard shows real-time statistics

---

## 📚 **Resources**

### Current Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **UI:** shadcn/ui + TailwindCSS
- **Charts:** Recharts (installed but not used yet)
- **Auth:** JWT + cookies
- **Deployment:** Docker

### Database Access
```bash
# Connect to database
docker exec -it carental-db-1 psql -U postgres -d carental

# View tables
\dt

# View users
SELECT id, email, name, "verificationStatus", "isVerified" FROM "User";

# View bookings
SELECT id, "customerName", status, "totalPrice" FROM "Booking";
```

---

**System is ready for development! Start with Phase 2.1 (CarDetailPage booking form) for immediate customer-facing functionality.**
