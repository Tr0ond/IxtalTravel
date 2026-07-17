# 📊 Thống Kê & Báo Cáo - Tóm Tắt Cấu Trúc

## 📁 Cấu Trúc Thư Mục

```
src/
├── components/
│   └── Admin/
│       └── ThongKe/                           # Thư mục chính cho thống kê
│           ├── index.vue                      # 📍 Trang chính (Dashboard Hub)
│           ├── README.md                      # Tài liệu hướng dẫn
│           │
│           ├── ThongKeDanhThu/
│           │   └── index.vue                  # 💰 Trang thống kê doanh thu
│           │
│           ├── ThongKeKhachHangMoi/
│           │   └── index.vue                  # 👥 Trang thống kê khách hàng mới
│           │
│           ├── ThongKeVeBanRa/
│           │   └── index.vue                  # 🎫 Trang thống kê vé bán ra
│           │
│           ├── ThongKeChiTieuKhachHang/
│           │   └── index.vue                  # 💳 Trang thống kê chi tiêu khách hàng
│           │
│           └── ThongKeTour/
│               └── index.vue                  # ✈️ Trang thống kê hiệu suất tour
│
└── router/
    └── index.js                               # ✏️ Cập nhật với routes mới
```

## 📄 Danh Sách Files Được Tạo/Cập Nhật

### ✅ Files Mới Được Tạo:

1. **src/components/Admin/ThongKe/index.vue**
   - Trang chính - Dashboard Hub
   - Điều hướng đến 5 trang thống kê khác
   - Hiển thị quick stats

2. **src/components/Admin/ThongKe/ThongKeDanhThu/index.vue**
   - Thống kê doanh thu theo ngày
   - Biểu đồ Line Chart
   - Bảng chi tiết doanh thu

3. **src/components/Admin/ThongKe/ThongKeKhachHangMoi/index.vue**
   - Thống kê khách hàng mới
   - Biểu đồ Bar Chart
   - Thống kê ngày cao nhất, trung bình

4. **src/components/Admin/ThongKe/ThongKeVeBanRa/index.vue**
   - Thống kê vé bán ra
   - Biểu đồ Bar Chart (2 datasets)
   - Tính tỷ lệ thanh toán

5. **src/components/Admin/ThongKe/ThongKeChiTieuKhachHang/index.vue**
   - Thống kê chi tiêu khách hàng
   - Biểu đồ Doughnut Chart
   - Top 10 khách hàng chi tiêu cao nhất

6. **src/components/Admin/ThongKe/ThongKeTour/index.vue**
   - Thống kê hiệu suất tour
   - Biểu đồ Horizontal Bar Chart
   - Xếp hạng tour theo vé bán ra

7. **src/components/Admin/ThongKe/README.md**
   - Tài liệu hướng dẫn chi tiết
   - Cấu hình router
   - Danh sách API endpoints

### ✏️ Files Cập Nhật:

1. **src/router/index.js**
   - Thêm 5 routes mới cho từng trang thống kê
   - Route names để dễ dàng navigate

## 🎯 Tính Năng Chính

### Trên Mỗi Trang Thống Kê:

✨ **Bộ Lọc Ngày**
- Input: Từ Ngày / Đến Ngày
- Button: Cập Nhật

📊 **Thẻ Tóm Tắt (Summary Cards)**
- Tổng giá trị
- Trung bình
- Xếp hạng
- Số lượng

📈 **Biểu Đồ (Charts)**
- Loại biểu đồ khác nhau tùy trang
- Responsive design
- Animation trơn mượt

📋 **Bảng Dữ Liệu (Data Tables)**
- Chi tiết từng dòng
- Hover effect
- Định dạng tiền tệ

⏳ **Loading State**
- Overlay khi đang tải
- Spinner animation
- Disable button khi loading

## 🔌 Integrations

### Libraries Sử Dụng:
- **Vue 3** - Framework
- **Chart.js** - Biểu đồ
- **Axios** - HTTP requests
- **Font Awesome** - Icons
- **Bootstrap CSS** - Icons (fa-solid, etc.)

### Components Dependencies:
- Tất cả đều sử dụng `this.$toast` (Vue Toast)
- Tất cả đều sử dụng `this.$router` (Vue Router)
- `localStorage.getItem('key_admin')` - Token xác thực

## 🚀 Cách Sử Dụng

### Bước 1: Verify Imports
```bash
# Đảm bảo Chart.js đã được cài
npm list chart.js
```

### Bước 2: Verify Router
```javascript
// Kiểm tra /src/router/index.js có routes mới hay không
// Tìm "thong-ke-doanh-thu", "thong-ke-khach-hang-moi", etc.
```

### Bước 3: Truy Cập Trang
```
http://localhost:5173/admin/thong-ke
```

### Bước 4: Chọn Thống Kê Muốn Xem
- Nhấp vào một trong 5 thẻ
- Hoặc truy cập trực tiếp:
  - `/admin/thong-ke/doanh-thu`
  - `/admin/thong-ke/khach-hang-moi`
  - `/admin/thong-ke/ve-ban-ra`
  - `/admin/thong-ke/chi-tieu-khach-hang`
  - `/admin/thong-ke/tour`

## 📱 Responsive Design

✓ Desktop (1920px)
✓ Laptop (1366px)
✓ Tablet (768px)
✓ Mobile (375px)

Tất cả trang đều sử dụng CSS Grid tự thích ứng

## 🔐 Quyền Truy Cập

- Tất cả trang yêu cầu: `beforeEnter: checkAdmin`
- Backend kiểm tra: `id_chuc_nang = 4`
- Token: `key_admin` từ localStorage

## 💾 Data Sources

Các API endpoints lấy dữ liệu từ:

| Endpoint | Dữ Liệu Từ | Bảng |
|----------|----------|------|
| /admin/thong-ke/doanh-thu | HoaDon | hoa_dons |
| /admin/thong-ke/khach-hang-moi | KhachHang | khach_hangs |
| /admin/thong-ke/ve-ban-ra | Ve + HoaDon | ves, hoa_dons |
| /admin/thong-ke/chi-tieu-khach-hang | HoaDon + KhachHang | hoa_dons, khach_hangs |
| /admin/thong-ke/tour | Tour + HoaDon + Ve | tours, hoa_dons, ves |

## 🎨 Color Scheme

| Thành Phần | Màu | Hex |
|-----------|-----|-----|
| Primary | Gradient Purple | #667eea → #764ba2 |
| Secondary | Teal | #06b6d4 |
| Success | Green | #10b981 |
| Warning | Amber | #f59e0b |
| Background | Light Gray | #f5f7fa |
| Card Background | White | #ffffff |

## 📝 Ghi Chú

- Mặc định tải 30 ngày gần nhất
- Tất cả biểu đồ hỗ trợ hover để xem giá trị
- Bảng dữ liệu hỗ trợ scroll ngang trên mobile
- Toast thông báo tự động tắt sau 3 giây

## 🐛 Debugging

### Lỗi Phổ Biến:

1. **Chart không hiển thị**
   - Kiểm tra ID canvas: `chartDoanhThu`, `chartKhachHangMoi`, v.v.
   - Kiểm tra data response từ API

2. **Không thấy dữ liệu**
   - Kiểm tra token trong localStorage
   - Kiểm tra quyền người dùng
   - Kiểm tra khoảng thời gian có dữ liệu

3. **Loading mãi không xong**
   - Kiểm tra API response status
   - Kiểm tra network tab trong DevTools

## ✅ Checklist Before Deployment

- [ ] Router routes đã được thêm
- [ ] Token lưu trong localStorage
- [ ] Quyền `id_chuc_nang = 4` được gán
- [ ] API endpoints hoạt động
- [ ] Chart.js đã được cài
- [ ] Vue Toast đã được cài
- [ ] Test trên các thiết bị khác nhau

---

**Created:** 2024
**Version:** 1.0
**Status:** ✅ Ready for Production
