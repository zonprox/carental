# CarRental - Internal Car Rental Management System

## 🏢 Project Overview

**Project Name**: CarRental Internal System  
**Type**: Internal Application (Non-open source)  
**Repository**: https://github.com/zonprox/carental  
**Docker Image**: ghcr.io/zonprox/carental:latest  
**Primary Language**: Vietnamese  
**Status**: Active Development

---

## 🎯 Purpose

Internal car rental management system designed for Vietnamese market with:
- Modern web-based interface
- **Full dark mode support** (Light/Dark/System)
- Full Vietnamese localization
- Admin panel for vehicle management
- User portal for car rentals
- Real-time availability tracking

---

## 🛠️ Technology Stack

### Frontend (`apps/frontend`)
- **React** 19.1.1 - Latest React with concurrent features
- **Vite** 6.0.7 - Lightning-fast build tool
- **shadcn/ui** 3.3.1 - Modern component library
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Lucide React** 0.544.0 - Icon library
- **React Router** 7.1.1 - Client-side routing
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation

### Backend (`apps/backend`)
- **Node.js** 22.20.0 LTS - Latest LTS runtime
- **Express** 5.0.1 - Web framework
- **PostgreSQL** 16 - Database
- **JWT** - Authentication
- **Helmet** - Security middleware
- **Rate Limiting** - API protection
- **Compression** - Response optimization

### DevOps & Tools
- **Docker** & Docker Compose - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint** 9 - Code linting
- **Prettier** 3 - Code formatting
- **Vitest** - Testing framework
- **npm Workspaces** - Monorepo management

---

## 📁 Project Structure

```
carental/
├── apps/
│   ├── frontend/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/          # React components
│   │   │   │   ├── admin/           # Admin components
│   │   │   │   │   ├── UserMenu.jsx # User menu popup
│   │   │   │   │   ├── Sidebar.jsx  # Admin sidebar
│   │   │   │   │   └── AdminLayout.jsx
│   │   │   │   └── ui/              # shadcn/ui components
│   │   │   ├── pages/               # Page components
│   │   │   │   ├── admin/           # Admin pages
│   │   │   │   ├── auth/            # Auth pages
│   │   │   │   └── user/            # User pages
│   │   │   ├── locales/             # i18n translations
│   │   │   │   ├── vi.js            # Vietnamese
│   │   │   │   ├── en.js            # English
│   │   │   │   └── index.js
│   │   │   ├── lib/                 # Utilities
│   │   │   └── main.jsx             # Entry point
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── backend/                     # Node.js backend
│       ├── src/
│       │   └── server.js            # Main server
│       ├── routes/                  # API routes
│       │   ├── auth.js              # Authentication
│       │   └── cars.js              # Car management
│       ├── middleware/              # Express middleware
│       │   └── auth.js
│       ├── config/                  # Configuration
│       │   └── database.js
│       ├── database/                # Database schema
│       │   └── schema.sql
│       ├── scripts/                 # Utility scripts
│       │   ├── init-db.js
│       │   └── seedDatabase.js
│       └── package.json
│
├── .github/
│   └── workflows/                   # CI/CD workflows
├── .node-version                    # Node.js version (22.20.0)
├── docker-compose.yml               # Production Docker
├── docker-compose.dev.yml           # Development Docker
├── Dockerfile                       # Production image
├── Dockerfile.dev                   # Development image
├── package.json                     # Root package
├── README.md                        # Project README
├── USERMENU_DESIGN.md              # UserMenu documentation
├── USERMENU_VIETNAMESE.md          # Vietnamese guide
├── UPDATES_SUMMARY.md              # Updates tracking
└── PROJECT_INFO.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 22.20.0
npm >= 10.0.0
Docker & Docker Compose
PostgreSQL 15+
```

### Installation

**1. Clone repository:**
```bash
git clone https://github.com/zonprox/carental.git
cd carental
```

**2. Install dependencies:**
```bash
npm install
```

**3. Environment setup:**
```bash
cp .env.example .env.production
cp apps/backend/.env.example apps/backend/.env
```

**4. Start development:**
```bash
# Using npm
npm run dev

# Using Docker
npm run docker:dev
```

**5. Access application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔐 Access Credentials

### Development Environment
```
Admin Account:
- Email: admin@carental.com
- Password: admin123

Test User:
- Email: user@carental.com
- Password: user123
```

⚠️ **Security Note**: Production uses different secure credentials.

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/login          # User/Admin login
POST   /api/auth/register       # User registration
POST   /api/auth/verify         # JWT verification
```

### Cars Management
```
GET    /api/cars                # List all cars
GET    /api/cars/:id            # Get car details
POST   /api/cars                # Create car (Admin)
PUT    /api/cars/:id            # Update car (Admin)
DELETE /api/cars/:id            # Delete car (Admin)
```

### Users Management (Admin)
```
GET    /api/users               # List users
GET    /api/users/:id           # Get user details
POST   /api/users               # Create user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

---

## 🐳 Docker Deployment

### Build Production Image
```bash
docker build -t ghcr.io/zonprox/carental:latest .
```

### Push to Registry
```bash
docker push ghcr.io/zonprox/carental:latest
```

### Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -p 5000:5000 \
  -e DATABASE_URL=postgresql://... \
  ghcr.io/zonprox/carental:latest
```

### Using Docker Compose
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

---

## 🧪 Testing

### Run Tests
```bash
# All tests
npm run test

# Frontend only
npm run test:frontend

# Backend only
npm run test:backend

# With coverage
npm run test:coverage
```

### Test Results
```
Backend Tests: 6 passed
Frontend Tests: (Add when implemented)
Total Coverage: (Add when measured)
```

---

## 🎨 UI Components

### UserMenu Component
Redesigned Vietnamese localized user menu with:
- 👤 Hồ sơ cá nhân (Profile)
- ⚙️ Cài đặt (Settings)
- 🔔 Thông báo (Notifications)
- 🎨 Giao diện (Appearance - Light/Dark/System)
- 🆘 Hỗ trợ (Support)
- 🚪 Đăng xuất (Logout)

**Documentation**: See `USERMENU_DESIGN.md` and `USERMENU_VIETNAMESE.md`

---

## 🌍 Localization

### Supported Languages
- 🇻🇳 Vietnamese (Primary)
- 🇬🇧 English (Secondary)

### Translation Files
- `apps/frontend/src/locales/vi.js` - Vietnamese translations
- `apps/frontend/src/locales/en.js` - English translations

### Usage
```jsx
import { t } from '@/locales'

// In components
<span>{t('userMenu.profile')}</span>
// Output: "Hồ sơ cá nhân"
```

---

## 📊 Database Schema

### Main Tables
```sql
- users          # User accounts
- cars           # Vehicle inventory
- bookings       # Rental bookings
- transactions   # Payment records
- reviews        # Customer reviews
```

### Sample Data
- 15+ sample cars
- Admin and test users
- Demo bookings

---

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Build
npm run build            # Build production
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Code Quality
npm run lint             # Lint all code
npm run lint:fix         # Fix linting issues
npm run format           # Format with Prettier

# Database
npm run seed             # Seed database
npm run db:reset         # Reset database

# Docker
npm run docker:dev       # Docker development
npm run docker:prod      # Docker production
npm run docker:build     # Build Docker image
npm run docker:down      # Stop containers

# Utilities
npm run clean            # Clean dependencies
```

---

## 📦 Dependencies

### Frontend Key Dependencies
```json
{
  "react": "^19.1.1",
  "react-router-dom": "^7.1.1",
  "lucide-react": "^0.544.0",
  "tailwindcss": "^3.4.17",
  "vite": "^6.0.7"
}
```

### Backend Key Dependencies
```json
{
  "express": "^5.0.1",
  "pg": "^8.13.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "helmet": "^8.0.0"
}
```

---

## 🔒 Security

### Implemented Security Features
- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Helmet.js security headers
- ✅ Rate limiting on API endpoints
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ Environment variable protection

### Security Best Practices
- Change default credentials in production
- Use strong JWT secrets
- Regular dependency updates
- HTTPS in production
- Database connection encryption

---

## 📈 Performance

### Build Output
```
Frontend Build (Vite):
- HTML: 0.72 kB (gzip: 0.39 kB)
- CSS: 40.95 kB (gzip: 7.48 kB)
- JS: 339.48 kB (gzip: 102.60 kB)
- Build Time: ~5.35s
```

### Optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Compression middleware
- ✅ Caching strategies

---

## 🐛 Troubleshooting

### Common Issues

**PowerShell Execution Policy Error:**
```bash
# Solution: Use Command Prompt instead
cmd /c "npm run dev"
```

**Port Already in Use:**
```bash
# Kill process on port 3000 or 5000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database Connection Error:**
```bash
# Verify PostgreSQL is running
docker-compose up -d postgres

# Check connection string in .env
```

---

## 📞 Support

### Internal Support Channels
- **Repository Issues**: https://github.com/zonprox/carental/issues
- **Team Lead**: @zonprox
- **Documentation**: See `/docs` folder

### Reporting Issues
1. Check existing issues first
2. Provide detailed description
3. Include error logs
4. Specify environment (dev/prod)

---

## 📝 License

**Internal Project** - Not open source  
Copyright © 2025 CarRental Team  
All rights reserved

---

## 👥 Team

**Project Owner**: zonprox  
**Development Team**: Internal  
**Maintained By**: CarRental Development Team

---

## 📅 Version History

### Version 2.1.0 (Current)
- ✅ **Dark mode implementation** with ThemeProvider
- ✅ Real-time theme switching (Light/Dark/System)
- ✅ Theme persistence in localStorage
- ✅ System preference auto-detection
- ✅ All components dark mode compatible

### Version 2.0.0
- ✅ Node.js 22.20.0 LTS upgrade
- ✅ React 19.1.1 upgrade
- ✅ Lucide React v0.544.0
- ✅ UserMenu Vietnamese localization
- ✅ Simplified menu structure
- ✅ Modern shadcn/ui design

### Version 1.0.0
- Initial release
- Basic car rental functionality
- Admin panel
- User authentication

---

**Last Updated**: October 1, 2025  
**Document Version**: 2.1  
**Maintained By**: @zonprox

---

## 🌙 Dark Mode

Full dark mode implementation with:
- ✅ Light, Dark, and System modes
- ✅ Real-time switching via UserMenu
- ✅ localStorage persistence
- ✅ All components support dark mode

**Documentation**: See `DARK_MODE_GUIDE.md` for complete guide

