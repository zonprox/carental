# Car Rental System - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- GitHub account
- VPS/Cloud server (recommended: 2GB RAM, 2 CPU cores)
- Domain name (optional)

## 📋 Step-by-Step Deployment

### 1. Setup GitHub Repository

```bash
# If you haven't created a GitHub repository yet:
# 1. Go to https://github.com/new
# 2. Create a new repository named "car-rental-system"
# 3. Don't initialize with README (we already have files)

# Add GitHub remote and push
git remote add origin https://github.com/YOUR_USERNAME/car-rental-system.git
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Container Registry (GHCR)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `write:packages` permission
3. Save the token securely

### 3. Environment Setup

#### Production Environment Variables
Copy `.env.production` and customize for your environment:

```bash
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=carental_prod
DB_USER=carental_user
DB_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://carental_user:your_secure_password_here@postgres:5432/carental_prod

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password_here

# Security Settings
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# PostgreSQL Settings
POSTGRES_DB=carental_prod
POSTGRES_USER=carental_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432
```

### 4. Local Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Admin Panel: http://localhost:3000/admin
```

### 5. Production Deployment

#### Option A: Using Docker Compose (Recommended)

```bash
# On your production server
git clone https://github.com/YOUR_USERNAME/car-rental-system.git
cd car-rental-system

# Copy and configure environment variables
cp .env.production .env
# Edit .env with your production values

# Deploy
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

#### Option B: Using GitHub Actions + GHCR

1. **Setup GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     GHCR_TOKEN=your_github_token
     PRODUCTION_HOST=your_server_ip
     PRODUCTION_USER=your_server_user
     PRODUCTION_SSH_KEY=your_private_ssh_key
     ```

2. **Automatic Deployment:**
   - Push to `main` branch triggers CI/CD
   - Tests run automatically
   - Docker image builds and pushes to GHCR
   - Deploy to production server (if configured)

3. **Manual Deployment from GHCR:**
   ```bash
   # On production server
   docker login ghcr.io -u YOUR_USERNAME -p YOUR_GITHUB_TOKEN
   
   # Pull and run the latest image
   docker pull ghcr.io/YOUR_USERNAME/car-rental-system:latest
   
   # Using docker-compose with GHCR image
   # Update docker-compose.yml to use the GHCR image
   docker-compose up -d
   ```

### 6. Database Setup

The database will be automatically initialized with the schema when the container starts. To manually run database operations:

```bash
# Access the database container
docker-compose exec postgres psql -U carental_user -d carental_prod

# Or run initialization scripts manually
docker-compose exec app npm run init-db
docker-compose exec app npm run seed-db
```

### 7. SSL/HTTPS Setup (Recommended)

#### Using Nginx + Let's Encrypt

1. **Install Nginx and Certbot:**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/carental
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable site and get SSL:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/carental /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### 8. Monitoring & Maintenance

#### Health Checks
```bash
# Check application health
curl http://localhost:3000/health

# Check container status
docker-compose ps
docker-compose logs app
docker-compose logs postgres
```

#### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U carental_user carental_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T postgres psql -U carental_user carental_prod < backup_file.sql
```

#### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or using GHCR
docker-compose pull
docker-compose up -d
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3000
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database Connection Issues:**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Verify environment variables
   docker-compose exec app env | grep DB_
   ```

3. **Permission Issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x scripts/*.sh
   ```

4. **Memory Issues:**
   ```bash
   # Check system resources
   free -h
   df -h
   
   # Adjust Docker memory limits in docker-compose.yml
   ```

### Performance Optimization

1. **Enable Gzip Compression** (already configured in server.js)
2. **Use CDN** for static assets
3. **Database Indexing** (check schema.sql)
4. **Caching** (Redis can be added)
5. **Load Balancing** for high traffic

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] SSL certificate installed
- [ ] Monitoring setup (logs, metrics)
- [ ] Security headers enabled (helmet.js)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Admin credentials changed from defaults
- [ ] Database credentials secured
- [ ] JWT secret is strong and unique
- [ ] Firewall configured (only necessary ports open)
- [ ] Regular security updates scheduled

## 🆘 Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Review this deployment guide
3. Check GitHub Issues
4. Verify environment variables
5. Ensure all prerequisites are met

## 📈 Scaling Considerations

For high-traffic scenarios:
- Use container orchestration (Kubernetes)
- Implement horizontal scaling
- Add Redis for session management
- Use database read replicas
- Implement CDN for static assets
- Add application monitoring (APM)