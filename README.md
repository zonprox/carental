# 🚗 CarRental - Modern Car Rental Web Application

A modern, full-stack car rental web application built with the latest technologies including **Node.js 22.20.0 LTS**, **React 19.1.1**, and **shadcn/ui 3.3.1**.

## ✨ Features

- 🏠 **Modern Homepage** - Browse available cars with beautiful UI
- 👨‍💼 **Admin Dashboard** - Comprehensive car management system
- 🔐 **JWT Authentication** - Secure admin login system
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **shadcn/ui Components** - Beautiful, accessible UI components
- 🐳 **Docker Ready** - Full containerization support
- 🚀 **CI/CD Pipeline** - GitHub Actions for automated deployment
- 📊 **Rich Sample Data** - 15+ sample cars for demo and testing
- 🏗️ **Monorepo Structure** - Modern workspace-based architecture

## 🛠️ Tech Stack

### Frontend (`apps/frontend`)
- **React 19.1.1** - Latest React with concurrent features
- **Vite 6.0.7** - Lightning-fast build tool
- **shadcn/ui 3.3.1** - Modern component library
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Router 7.1.1** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form + Zod** - Form handling and validation

### Backend (`apps/backend`)
- **Node.js 22.20.0 LTS** - Latest LTS runtime
- **Express 5.0.1** - Web application framework
- **PostgreSQL 16** - Robust relational database
- **JWT** - JSON Web Token authentication
- **Helmet** - Security middleware
- **Rate Limiting** - API protection
- **Compression** - Response compression

### DevOps & Tools
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality and formatting
- **Vitest** - Modern testing framework
- **npm Workspaces** - Monorepo management

## 🚀 Quick Start

### Prerequisites
- **Node.js 22.20.0 LTS** or higher
- **npm 10.0.0** or higher
- **PostgreSQL 16** (or use Docker)
- **Git**

### 🐳 Docker Development (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/carental.git
cd carental

# Start development environment
npm run docker:dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### 💻 Local Development

```bash
# Clone and install dependencies
git clone https://github.com/yourusername/carental.git
cd carental
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your database credentials

# Start PostgreSQL (if not using Docker)
# Create database: carental_db

# Seed the database with sample data
npm run seed

# Start development servers
npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## 📁 Project Structure

```
carental/
├── apps/
│   ├── frontend/                 # React frontend application
│   │   ├── src/
│   │   │   ├── components/       # Reusable components
│   │   │   │   └── ui/          # shadcn/ui components
│   │   │   ├── pages/           # Page components
│   │   │   ├── lib/             # Utilities and helpers
│   │   │   └── hooks/           # Custom React hooks
│   │   ├── components.json      # shadcn/ui configuration
│   │   ├── tailwind.config.js   # Tailwind CSS config
│   │   └── vite.config.js       # Vite configuration
│   │
│   └── backend/                  # Node.js backend API
│       ├── src/
│       │   └── server.js        # Main server file
│       ├── routes/              # API route handlers
│       ├── middleware/          # Express middleware
│       ├── config/              # Configuration files
│       ├── database/            # Database schema and migrations
│       ├── data/                # Sample data and fixtures
│       └── scripts/             # Utility scripts
│
├── .github/
│   └── workflows/               # GitHub Actions CI/CD
├── docker-compose.yml           # Production Docker setup
├── docker-compose.dev.yml       # Development Docker setup
├── Dockerfile                   # Production Docker image
├── Dockerfile.dev              # Development Docker image
└── package.json                # Root workspace configuration
```

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Email:** `admin@carental.com`
- **Password:** `admin123`

> ⚠️ **Security Note:** Change these credentials in production!

## 🐳 Docker Commands

```bash
# Development environment
npm run docker:dev

# Production environment
npm run docker:prod

# Build production image
npm run docker:build

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run frontend tests only
npm run test --workspace=@carental/frontend

# Run backend tests only
npm run test --workspace=@carental/backend
```

## 📊 Database Management

```bash
# Seed database with sample cars
npm run seed

# Reset database (clear and re-seed)
npm run db:reset

# Run database migrations
npm run db:migrate
```

## 🔧 Development Scripts

```bash
# Start development servers
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Clean all dependencies and build files
npm run clean
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car (Admin only)
- `PUT /api/cars/:id` - Update car (Admin only)
- `DELETE /api/cars/:id` - Delete car (Admin only)

## 🔐 Environment Variables

### Backend (`apps/backend/.env`)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carental_db
DB_USER=carental_user
DB_PASSWORD=carental_password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### Frontend (`apps/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Production Deployment with Docker

```bash
# Build and start production containers
docker-compose up -d

# Or use the npm script
npm run docker:prod
```

### Manual Deployment

```bash
# Build the frontend
npm run build:frontend

# Start the backend
npm run start
```

### GitHub Actions CI/CD

The project includes a complete CI/CD pipeline that:
- Runs tests on every push
- Builds Docker images
- Pushes to GitHub Container Registry
- Supports automatic deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆕 What's New in v2.0.0

### 🔄 Major Upgrades
- **Node.js 22.20.0 LTS** - Latest LTS with improved performance and security
- **React 19.1.1** - Latest React with concurrent features and improved SSR
- **shadcn/ui 3.3.1** - Updated component library with new components and improvements

### 🏗️ Architecture Improvements
- **Monorepo Structure** - Organized codebase with npm workspaces
- **Enhanced Database Schema** - Rich car data with categories, features, and metadata
- **15+ Sample Cars** - Comprehensive demo data for testing and development
- **Modern Docker Setup** - Multi-stage builds and optimized containers

### 🛡️ Security & Performance
- **Enhanced Security** - Helmet, rate limiting, and input validation
- **Better Performance** - Compression, optimized builds, and caching
- **Improved Testing** - Vitest integration with coverage reports
- **Code Quality** - ESLint 9, Prettier 3, and automated formatting

---

**Built with ❤️ by the CarRental Team**

For support or questions, please [open an issue](https://github.com/yourusername/carental/issues) on GitHub.