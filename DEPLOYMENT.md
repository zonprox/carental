# Production Deployment Guide

## ✅ Production Ready Status

- ✅ All test code removed
- ✅ Lint passing (0 errors, 0 warnings)
- ✅ Build passing successfully
- ✅ Docker images automated via CI
- ✅ TypeScript strict mode compliant

## 🚀 CI/CD Pipeline

GitHub Actions automatically:
1. Builds Docker images on push to `main`
2. Pushes to GitHub Container Registry
3. Tags: `latest` and `main-<sha>`

### Docker Images

```
ghcr.io/zonprox/carental-server:latest
ghcr.io/zonprox/carental-client:latest
```

## 📦 Local Production Build

### Build locally (same as CI):

```bash
# Install dependencies
npm install

# Lint check
npm run lint

# Build all
npm run build
```

### Run with Docker Compose:

```bash
cd infra/docker
docker-compose --profile dev up -d
```

## 🌐 Production Deployment

### Option 1: Pull from GitHub Container Registry

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker pull ghcr.io/zonprox/carental-server:latest
docker pull ghcr.io/zonprox/carental-client:latest

# Run with docker-compose
docker-compose up -d
```

### Option 2: Deploy on VPS/Cloud

1. Clone repository
2. Copy `.env.example` to `.env`
3. Configure environment variables
4. Run `docker-compose up -d`

## 🔧 Environment Variables

### Required for Server:

```env
DATABASE_URL="postgresql://user:password@db:5432/carental"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=4000
```

### Required for Database:

```env
POSTGRES_USER=carental
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=carental
```

## 📊 Health Checks

- **Server**: `http://localhost:4000/api/health`
- **Client**: `http://localhost:5173`

## 🔒 Security Checklist

- ✅ JWT authentication enabled
- ✅ HTTP-only cookies
- ✅ CORS configured
- ✅ Helmet.js security headers
- ✅ Admin-only routes protected
- ✅ Password hashing with bcrypt
- ✅ File upload validation

## 📈 Monitoring

Monitor Docker containers:

```bash
docker-compose ps
docker-compose logs -f server
docker-compose logs -f client
```

## 🔄 Update Deployment

```bash
# Pull latest images
docker-compose pull

# Recreate containers
docker-compose up -d --force-recreate

# Clean up old images
docker image prune -f
```

## 💾 Database Backup

```bash
# Backup
docker exec carental-db-1 pg_dump -U carental carental > backup.sql

# Restore
cat backup.sql | docker exec -i carental-db-1 psql -U carental carental
```

## 🎯 Production URLs

After deployment, your app will be available at:
- Client: `http://your-domain.com`
- API: `http://your-domain.com/api`
- Admin: `http://your-domain.com/admin`

## 📞 Support

For issues, check:
1. Docker logs: `docker-compose logs`
2. GitHub Actions: https://github.com/zonprox/carental/actions
3. Container status: `docker-compose ps`
