# 🔧 Hướng dẫn sửa lỗi deploy trên VPS

## ❌ Các lỗi bạn đang gặp

### Lỗi 1: "node: --optimize-for-size is not allowed in NODE_OPTIONS"
**Nguyên nhân**: File `.env` có chứa biến `NODE_OPTIONS` với giá trị không được phép.

### Lỗi 2: "exited - code 9"
**Nguyên nhân**: Container bị kill do hết RAM (Out Of Memory).

### Lỗi 3: Version mismatch
**Nguyên nhân**: Dockerfile dùng Node 20 nhưng project yêu cầu Node 22.

---

## ✅ Giải pháp đã được áp dụng

### 1. Cập nhật Dockerfile.prod (✓ Hoàn thành)
- ✅ Upgrade từ Node 20-alpine lên **Node 22-alpine**
- ✅ Thêm flag `--max-old-space-size=1536` để tối ưu memory
- ✅ Path server.js đã được sửa thành `src/server.js`

### 2. Tăng giới hạn RAM trong docker-compose.prod.yml (✓ Hoàn thành)
- ✅ Memory limit: 1G → **2G**
- ✅ Memory reservation: 512M → **1G**
- ✅ CPU limit: 1.0 → **2.0**
- ✅ CPU reservation: 0.5 → **1.0**

### 3. File .env.production mẫu (✓ Hoàn thành)
- ✅ Tạo file `.env.production` với tất cả biến môi trường cần thiết
- ✅ **QUAN TRỌNG**: Không có `NODE_OPTIONS` trong file

---

## 📋 Các bước deploy lại trên VPS

### Bước 1: Kiểm tra file .env hiện tại
```bash
# Kiểm tra xem có NODE_OPTIONS không
grep NODE_OPTIONS .env

# Nếu có, XÓA dòng đó đi
sed -i '/NODE_OPTIONS/d' .env
```

### Bước 2: Tạo file .env từ template
```bash
# Backup file .env cũ nếu có
cp .env .env.backup

# Copy từ template
cp .env.production .env

# Chỉnh sửa các giá trị bắt buộc
nano .env
```

**Các giá trị BẮT BUỘC phải thay đổi:**
- `DB_PASSWORD`: Mật khẩu database mạnh
- `JWT_SECRET`: Chuỗi ngẫu nhiên ít nhất 32 ký tự
- `JWT_REFRESH_SECRET`: Chuỗi ngẫu nhiên khác, ít nhất 32 ký tự
- `SESSION_SECRET`: Chuỗi ngẫu nhiên khác, ít nhất 32 ký tự
- `ADMIN_PASSWORD`: Mật khẩu admin mạnh
- `REDIS_PASSWORD`: Mật khẩu Redis mạnh
- `DOMAIN`: Tên miền của bạn
- `FRONTEND_URL`: URL frontend của bạn
- `CORS_ORIGIN`: Origin được phép (domain của bạn)

**Cách tạo secrets mạnh:**
```bash
# Tạo JWT_SECRET
openssl rand -base64 32

# Tạo JWT_REFRESH_SECRET
openssl rand -base64 32

# Tạo SESSION_SECRET
openssl rand -base64 32
```

### Bước 3: Pull code mới và rebuild
```bash
# Pull code đã fix
git pull origin main

# Dừng các container cũ
npm run prod:down

# Hoặc dùng docker-compose trực tiếp
docker-compose -f docker-compose.prod.yml down

# Xóa images cũ để build lại từ đầu
docker rmi carental-app:latest

# Build và chạy lại
npm run prod

# Hoặc dùng docker-compose trực tiếp
docker-compose -f docker-compose.prod.yml up --build -d
```

### Bước 4: Kiểm tra logs
```bash
# Xem logs của app
docker-compose -f docker-compose.prod.yml logs -f app

# Kiểm tra health
curl http://localhost:5000/api/health

# Kiểm tra memory usage
docker stats carental-app
```

---

## 🔍 Kiểm tra VPS của bạn

### Kiểm tra RAM khả dụng
```bash
free -h
```

**Yêu cầu tối thiểu:**
- RAM tối thiểu: **4GB** (đề xuất 8GB)
- Nếu VPS < 4GB, cần giảm memory limits hoặc nâng cấp VPS

### Nếu VPS chỉ có 2GB RAM
Sửa `docker-compose.prod.yml`:
```yaml
deploy:
  resources:
    limits:
      memory: 512M  # Giảm từ 2G
    reservations:
      memory: 256M  # Giảm từ 1G
```

Và sửa `Dockerfile.prod`:
```dockerfile
CMD ["node", "--max-old-space-size=384", "src/server.js"]
```

---

## 🚨 Những điều TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM

### ❌ KHÔNG thêm vào file .env:
```bash
# ❌ SAI - Sẽ gây lỗi
NODE_OPTIONS=--optimize-for-size
NODE_OPTIONS=--max-old-space-size=512
NODE_OPTIONS=--experimental-modules
```

### ✅ Đúng - KHÔNG có NODE_OPTIONS trong .env
Memory settings đã được cấu hình sẵn trong `Dockerfile.prod` và `docker-compose.prod.yml`

---

## 🔧 Troubleshooting

### Vẫn gặp lỗi "exited - code 9"
```bash
# 1. Kiểm tra RAM
docker stats

# 2. Giảm memory nếu cần (cho VPS nhỏ)
# Sửa docker-compose.prod.yml và Dockerfile.prod như hướng dẫn ở trên

# 3. Restart Docker daemon
sudo systemctl restart docker
```

### Vẫn gặp lỗi NODE_OPTIONS
```bash
# 1. Kiểm tra tất cả env files
grep -r "NODE_OPTIONS" .

# 2. Xóa khỏi .env
sed -i '/NODE_OPTIONS/d' .env

# 3. Kiểm tra shell profile
grep NODE_OPTIONS ~/.bashrc ~/.profile /etc/environment

# 4. Unset nếu có
unset NODE_OPTIONS
```

### Container không start
```bash
# Xem logs chi tiết
docker-compose -f docker-compose.prod.yml logs app

# Xem events
docker events

# Kiểm tra disk space
df -h

# Kiểm tra ports
netstat -tulpn | grep -E '5000|5432|6379'
```

---

## 📊 Yêu cầu hệ thống đề xuất

### Cấu hình VPS tối thiểu
- **CPU**: 2 cores
- **RAM**: 4GB (đề xuất 8GB)
- **Disk**: 20GB SSD
- **OS**: Ubuntu 20.04/22.04 hoặc CentOS 8+

### Cấu hình VPS đề xuất (Production)
- **CPU**: 4 cores
- **RAM**: 8GB
- **Disk**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS

---

## 📞 Nếu vẫn gặp vấn đề

1. Chạy lệnh sau và gửi kết quả:
```bash
# System info
uname -a
free -h
df -h

# Docker info
docker --version
docker-compose --version
docker ps -a
docker stats --no-stream

# App logs
docker-compose -f docker-compose.prod.yml logs --tail=100 app
```

2. Kiểm tra file .env (ẩn thông tin nhạy cảm):
```bash
cat .env | grep -v "PASSWORD\|SECRET\|KEY"
```

---

## ✅ Checklist sau khi deploy thành công

- [ ] App đang chạy: `docker ps` hiển thị carental-app
- [ ] Health check OK: `curl http://localhost:5000/api/health`
- [ ] Database kết nối OK: Xem logs không có lỗi database
- [ ] Redis kết nối OK: Xem logs không có lỗi redis
- [ ] Nginx hoạt động: Truy cập được qua domain/IP
- [ ] Memory usage ổn định: `docker stats` < 80% của limit
- [ ] Logs không có errors: `docker-compose logs --tail=50`

---

**Lưu ý**: Sau khi deploy thành công, hãy theo dõi logs và metrics trong 24-48h đầu để đảm bảo hệ thống ổn định.

