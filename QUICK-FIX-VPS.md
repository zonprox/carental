# 🚨 Quick Fix cho lỗi VPS Deploy

## ⚡ Sửa nhanh trong 5 phút

### 1️⃣ Kiểm tra và xóa NODE_OPTIONS khỏi .env
```bash
# Xem có NODE_OPTIONS không
grep NODE_OPTIONS .env

# Nếu có, XÓA ngay
sed -i '/NODE_OPTIONS/d' .env
```

### 2️⃣ Pull code mới (đã fix)
```bash
git pull origin main
```

### 3️⃣ Rebuild và restart
```bash
# Dừng containers cũ
docker-compose -f docker-compose.prod.yml down

# Xóa image cũ
docker rmi carental-app:latest

# Build lại và chạy
docker-compose -f docker-compose.prod.yml up --build -d
```

### 4️⃣ Kiểm tra
```bash
# Xem logs
docker-compose -f docker-compose.prod.yml logs -f app

# Kiểm tra health
curl http://localhost:5000/api/health

# Kiểm tra memory
docker stats carental-app
```

---

## 🔍 Nếu vẫn lỗi "exited - code 9"

### VPS có < 4GB RAM?
Chỉnh `docker-compose.prod.yml`:
```yaml
# Tìm dòng này trong app service:
limits:
  memory: 512M    # Thay vì 2G
reservations:
  memory: 256M    # Thay vì 1G
```

---

## ✅ Đã fix những gì?

1. ✅ Upgrade Node 20 → Node 22
2. ✅ Tăng memory limit 1G → 2G
3. ✅ Thêm `--max-old-space-size` flag
4. ✅ Tạo file `.env.production` mẫu
5. ✅ Fix path server.js → src/server.js

---

## 📞 Cần giúp?

Chạy script kiểm tra:
```bash
chmod +x scripts/check-deployment.sh
./scripts/check-deployment.sh
```

Xem hướng dẫn chi tiết: [VPS-DEPLOYMENT-FIX.md](./VPS-DEPLOYMENT-FIX.md)

