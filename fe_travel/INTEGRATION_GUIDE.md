# 🚀 Hướng Dẫn Tích Hợp Nhanh - Thống Kê & Báo Cáo

## ✅ Những Gì Đã Được Hoàn Thành

Tất cả 5 trang thống kê đã được tạo và sẵn sàng sử dụng:

1. ✅ **Trang Chính** - `/admin/thong-ke`
2. ✅ **Thống Kê Doanh Thu** - `/admin/thong-ke/doanh-thu`
3. ✅ **Thống Kê Khách Hàng Mới** - `/admin/thong-ke/khach-hang-moi`
4. ✅ **Thống Kê Vé Bán Ra** - `/admin/thong-ke/ve-ban-ra`
5. ✅ **Thống Kê Chi Tiêu Khách Hàng** - `/admin/thong-ke/chi-tieu-khach-hang`
6. ✅ **Thống Kê Hiệu Suất Tour** - `/admin/thong-ke/tour`

## 📋 Điều Kiện Tiên Quyết

Kiểm tra xem các package sau đã được cài:

```bash
# Chart.js
npm list chart.js

# Axios
npm list axios

# Vue Router
npm list vue-router

# Toast (nếu có)
npm list vue-toastification
```

Nếu thiếu bất kỳ package nào, cài đặt:

```bash
npm install chart.js@3 axios vue-router@4 vue-toastification@next
```

## 🔧 Bước Tích Hợp (3 Bước Đơn Giản)

### Bước 1️⃣: Verify Router Configuration

Kiểm tra `src/router/index.js` - các routes dưới đây **đã được thêm**:

```javascript
// Thống Kê Routes
{
    path: "/admin/thong-ke",
    component: () => import("../components/Admin/ThongKe/index.vue"),
    beforeEnter: checkAdmin,
},
{
    path: "/admin/thong-ke/doanh-thu",
    component: () => import("../components/Admin/ThongKe/ThongKeDanhThu/index.vue"),
    beforeEnter: checkAdmin,
    name: "thong-ke-doanh-thu",
},
// ... (và các routes khác)
```

✅ **Đã được tự động cập nhật**

### Bước 2️⃣: Verify Backend API

Kiểm tra các endpoint dưới đây trên backend:

```
POST /api/admin/thong-ke/doanh-thu
POST /api/admin/thong-ke/khach-hang-moi
POST /api/admin/thong-ke/ve-ban-ra
POST /api/admin/thong-ke/chi-tieu-khach-hang
POST /api/admin/thong-ke/tour
```

Mỗi endpoint nhận:
```json
{
    "begin": "2024-01-01",
    "end": "2024-01-31"
}
```

Và trả về:
```json
{
    "status": true,
    "data": [...],
    "labels": [...],
    "datasets": [...]
}
```

### Bước 3️⃣: Verify Quyền Truy Cập

Đảm bảo người dùng admin có:
- ✅ Token `key_admin` lưu trong localStorage
- ✅ Quyền `id_chuc_nang = 4` trong bảng `phan_quyen`

## 🧪 Kiểm Tra Cài Đặt

### Test Local Development:

```bash
# 1. Start dev server
npm run dev

# 2. Truy cập: http://localhost:5173/admin/thong-ke
# 3. Đăng nhập admin
# 4. Chọn một thống kê để xem
```

### Browser DevTools:

```javascript
// F12 → Console
// Kiểm tra token
localStorage.getItem('key_admin')

// Kiểm tra router
this.$router.getRoutes()
```

## 📊 Test API Calls

### Sử dụng Postman hoặc cURL:

```bash
curl -X POST http://127.0.0.1:8000/api/admin/thong-ke/doanh-thu \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"begin":"2024-01-01","end":"2024-01-31"}'
```

### Expected Response:

```json
{
    "status": true,
    "data": [
        {
            "ngay": "2024-01-01",
            "tong_don_hang": 5,
            "tong_tien": 5000000
        }
    ],
    "labels": ["2024-01-01", "2024-01-02", ...],
    "datasets": [
        {
            "label": "Tổng Tiền Thực Nhận",
            "data": [5000000, 3500000, ...],
            "backgroundColor": ["#667eea", "#764ba2", ...]
        }
    ]
}
```

## 🎯 Workflow Sử Dụng

```
1. Truy cập /admin/thong-ke
   ↓
2. Chọn một thống kê (bấm vào thẻ)
   ↓
3. Trang tải với dữ liệu 30 ngày gần nhất
   ↓
4. Tùy chỉnh khoảng thời gian (nếu cần)
   ↓
5. Nhấn "Cập Nhật" để tải dữ liệu mới
   ↓
6. Xem biểu đồ và bảng chi tiết
```

## ⚙️ Cấu Hình Bổ Sung (Optional)

### Thay Đổi Màu Sắc

Mở `src/components/Admin/ThongKe/*/index.vue`, tìm:

```javascript
// Thay đổi màu primary
style="color: #667eea;"  // Sửa thành màu khác

// Thay đổi gradient
style="background: linear-gradient(135deg, #667eea, #764ba2);"
```

### Thay Đổi Khoảng Thời Gian Mặc Định

Tìm hàm `getDateRange()`:

```javascript
getDateRange() {
    const end = new Date();
    const begin = new Date();
    begin.setDate(begin.getDate() - 30); // Sửa 30 thành số ngày khác
    return { ... };
}
```

### Thay Đổi Loại Biểu Đồ

Tìm `renderChart()`, sửa `type`:

```javascript
this.chart = new Chart(ctx, {
    type: 'bar',    // 'line', 'bar', 'doughnut', 'pie', 'area'
    data: { ... }
});
```

## 📱 Test Responsive

```
Desktop: 1920px → ✅
Laptop:  1366px → ✅
Tablet:  768px  → ✅
Mobile:  375px  → ✅
```

Tất cả trang đều responsive.

## 🔍 Troubleshooting Quick Fix

| Vấn Đề | Giải Pháp |
|--------|----------|
| Không thấy dữ liệu | Kiểm tra token `key_admin` |
| API 401 Unauthorized | Đăng nhập lại |
| API 403 Forbidden | Kiểm tra quyền `id_chuc_nang = 4` |
| Biểu đồ trống | Kiểm tra response data từ API |
| Toast không hiển thị | Kiểm tra `vue-toastification` |
| Route không hoạt động | Kiểm tra `src/router/index.js` |

## 🚀 Production Deployment

```bash
# Build
npm run build

# Check dist folder
ls dist/

# Deploy dist/ folder
# Đảm bảo backend API khả dụng
# Đảm bảo CORS được cấu hình
```

## 📞 Support

Kiểm tra các file:
- `src/components/Admin/ThongKe/README.md` - Tài liệu chi tiết
- `THONG_KE_SUMMARY.md` - Tóm tắt cấu trúc
- `src/router/index.js` - Routes configuration

## ✨ Tính Năng Sắp Tới (Optional)

- [ ] Export dữ liệu sang Excel
- [ ] In báo cáo PDF
- [ ] Chia sẻ dữ liệu qua email
- [ ] Real-time updates
- [ ] Custom date range picker
- [ ] Multiple chart types per page

---

**Status:** ✅ Ready to Use  
**Test Date:** 2024  
**Version:** 1.0  
**Last Updated:** Today

Mọi thắc mắc, hãy kiểm tra README.md trong thư mục ThongKe! 📚
