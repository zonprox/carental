# Hướng dẫn Deployment - CarRental

## Cấu hình Port

### Development
- **Frontend**: Port 3000 (http://localhost:3000)
- **Backend**: Port 5000 (http://localhost:5000)
- **Database**: Port 5432

### Production
- **Application**: Port 5000 (backend + frontend static files)
- **Database**: Port 5432

## Cấu hình Domain linh hoạt

### Development
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Production - Domain cố định
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Production - Cho phép mọi domain
```env
NODE_ENV=production
# Để trống hoặc không set FRONTEND_URL để cho phép mọi domain
# FRONTEND_URL=
```

## Deployment Commands

### Docker Compose (Production)
```bash
# Build và chạy
docker-compose up -d

# Với custom domain
FRONTEND_URL=https://yourdomain.com docker-compose up -d

# Cho phép mọi domain (không set FRONTEND_URL)
docker-compose up -d
```

### Docker Compose (Development)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

## Environment Variables quan trọng

- `NODE_ENV`: development/production
- `PORT`: 5000 (backend port)
- `FRONTEND_URL`: URL của frontend (để trống trong production để cho phép mọi domain)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Cấu hình database
- `JWT_SECRET`: Secret key cho JWT

## CORS Configuration

Backend tự động cấu hình CORS dựa trên `NODE_ENV`:
- **Development**: Chỉ cho phép `http://localhost:3000` và `http://127.0.0.1:3000`
- **Production**: 
  - Nếu có `FRONTEND_URL`: Chỉ cho phép domain đó
  - Nếu không có `FRONTEND_URL`: Cho phép mọi domain (`origin: true`)

## Health Check

Application có health check endpoint tại `/api/health` để kiểm tra trạng thái.