# Quy định Package Lock File

## Tổng quan
Dự án CarRental tuân thủ nghiêm ngặt quy định về package lock file để đảm bảo tính nhất quán và ổn định của dependencies.

## Quy định bắt buộc

### 1. Package Lock File
- **BẮT BUỘC** commit `package-lock.json` vào hệ thống quản lý phiên bản (Git)
- **KHÔNG** được thêm `package-lock.json` vào `.gitignore`
- **BẮT BUỘC** sử dụng `npm ci` trong môi trường production và CI/CD

### 2. Cấu trúc Monorepo
```
carental/
├── package.json (root)
├── package-lock.json (root)
└── apps/
    ├── backend/
    │   ├── package.json
    │   └── package-lock.json
    └── frontend/
        ├── package.json
        └── package-lock.json
```

### 3. Lệnh được phép sử dụng

#### Development (Local)
```bash
# Cài đặt dependencies mới
npm install

# Cài đặt cho workspace cụ thể
npm install --workspace=carental-server
npm install --workspace=carental-client
```

#### Production/CI
```bash
# Sử dụng trong Dockerfile và CI/CD
npm ci

# Hoặc với NODE_ENV=production
npm install --production
```

### 4. Workflow bắt buộc

#### Khi thêm/cập nhật dependencies:
1. Chạy `npm install` để cập nhật `package-lock.json`
2. Commit cả `package.json` và `package-lock.json`
3. Push lên repository

#### Khi clone project:
```bash
git clone <repository>
cd carental
npm ci  # Sử dụng npm ci thay vì npm install
```

### 5. Docker Configuration
- Dockerfile sử dụng `npm install --production` cho production builds
- Dockerfile.dev sử dụng `npm ci` cho development builds
- Luôn copy `package*.json` trước khi chạy npm commands

### 6. CI/CD Pipeline
- GitHub Actions sử dụng `npm ci` để đảm bảo reproducible builds
- Cache npm dependencies dựa trên `package-lock.json`
- Fail build nếu `package-lock.json` không sync với `package.json`

## Lý do thực thi quy định

### Tại sao bắt buộc commit package-lock.json?
1. **Reproducible builds**: Đảm bảo mọi người có cùng phiên bản dependencies
2. **Security**: Tránh supply chain attacks thông qua dependency confusion
3. **Stability**: Ngăn chặn breaking changes từ minor/patch updates
4. **Performance**: `npm ci` nhanh hơn `npm install` trong CI/CD

### Tại sao sử dụng npm ci?
1. **Faster**: Nhanh hơn 2-10x so với `npm install`
2. **Reliable**: Chỉ install exact versions từ lock file
3. **Clean**: Xóa `node_modules` trước khi install
4. **Strict**: Fail nếu `package.json` và `package-lock.json` không sync

## Xử lý lỗi thường gặp

### EUSAGE: npm ci requires package-lock.json
```bash
# Tạo package-lock.json
npm install --package-lock-only

# Hoặc
npm install
```

### Package-lock.json out of sync
```bash
# Xóa và tạo lại
rm package-lock.json node_modules -rf
npm install
```

### Workspace issues
```bash
# Install cho specific workspace
npm install --workspace=carental-server --package-lock-only
```

## Kiểm tra tuân thủ

### Pre-commit hooks (khuyến nghị)
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm audit && npm ci"
    }
  }
}
```

### CI checks
- Verify `package-lock.json` exists
- Run `npm ci` to validate lock file
- Run `npm audit` for security vulnerabilities

## Liên hệ
Mọi thắc mắc về quy định lockfile, vui lòng liên hệ team DevOps hoặc tạo issue trên GitHub.