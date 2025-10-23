# Car Rental - PERN Stack Skeleton

Full-stack application with PostgreSQL, Express, React (Vite), Node.js, TypeScript, Prisma, Zod, Tailwind, shadcn/ui.

## Features

- ✅ TypeScript everywhere
- ✅ JWT authentication (httpOnly cookies) with RBAC
- ✅ First-run setup wizard
- ✅ Docker & Portainer ready
- ✅ GitHub Container Registry (GHCR) integration
- ✅ Local dev = CI/CD parity
- ✅ shadcn/ui component library (official components only)

## Tech Stack

- **Client**: React 18, Vite, Tailwind CSS, shadcn/ui, lucide-react, React Router
- **Server**: Express 5, Prisma, Zod validation, JWT, bcrypt, Helmet, CORS
- **Database**: PostgreSQL 16
- **Linting**: ESLint, Prettier

## 📚 Documentation

- **[Features & Roadmap](FEATURES.md)** - Current features and future plans
- **[Workflow Guide](WORKFLOW.md)** - Complete workflow from setup to deployment
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - Code reuse patterns, best practices, component library
- **[Code Reference](CODE_REFERENCE.md)** - Quick lookup for all reusable code
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API endpoint reference
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## Quick Start

### 1. Local Development (Node.js)

```bash
# Copy env file
cp .env.example .env

# Install dependencies
npm install

# Start PostgreSQL (Docker)
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pern_demo \
  postgres:16

# Run migrations & seed
npm --prefix server run prisma:generate
npm --prefix server run migrate
npm --prefix server run seed

# Start dev servers (client:5173, server:4000)
npm run dev
```

### 2. Docker Development (Full Stack)

```bash
# Start all services with dev profile
docker compose -f infra/docker/docker-compose.yml --profile dev up -d

# View logs
docker compose -f infra/docker/docker-compose.yml logs -f
```

### 3. Docker Production

```bash
# Build and run production
docker compose -f infra/docker/docker-compose.yml --profile prod up -d
```

## Setup Wizard

On first run, visit `http://localhost:5173/setup` to configure:
- Application URL
- Ports (client, server)
- Database mode: Local or External PostgreSQL
- Admin account (email, password, name)

## API Endpoints

### Public
- `GET /api/health` - Health check & setup status
- `GET /api/cars` - List cars (with filters, pagination)
- `GET /api/cars/:id` - Car details
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Setup (Unauthenticated)
- `GET /api/setup` - Get setup config
- `POST /api/setup` - Save setup config
- `POST /api/setup/test-db` - Test external DB connection

### Admin Only
- `POST /api/cars` - Create car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `GET /admin/*` - Admin dashboard routes

## Ports

- Client: `5173` (configurable via `CLIENT_PORT`)
- Server: `4000` (configurable via `SERVER_PORT`)
- PostgreSQL: `5432` (configurable via `.env`)

## Docker Images

Images are pushed to GitHub Container Registry:
- `ghcr.io/zonprox/carental-server:latest`
- `ghcr.io/zonprox/carental-client:latest`

### Build & Push

```bash
# Build images
docker build -f infra/docker/server.Dockerfile -t ghcr.io/zonprox/carental-server:latest .
docker build -f infra/docker/client.Dockerfile -t ghcr.io/zonprox/carental-client:latest .

# Push to GHCR
docker push ghcr.io/zonprox/carental-server:latest
docker push ghcr.io/zonprox/carental-client:latest
```

## Linting & Formatting

```bash
# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # shadcn/ui components
│   │   ├── pages/         # Route pages
│   │   ├── lib/           # Utils, API client
│   │   └── App.tsx
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, validation
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
├── shared/                 # Shared code (env validation)
├── infra/
│   └── docker/            # Dockerfiles, compose files
└── .github/
    └── workflows/         # CI/CD
```

## Environment Variables

See `.env.example` for all required variables.

**Critical**: Change `JWT_SECRET` in production!

## License

MIT
