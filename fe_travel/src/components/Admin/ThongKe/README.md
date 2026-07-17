# Thống Kê & Báo Cáo - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Hệ thống thống kê bao gồm 6 trang chính:

1. **Trang Chính (Dashboard Hub)** - `ThongKe/index.vue`
   - Điểm vào chính của hệ thống thống kê
   - Hiển thị các thẻ điều hướng đến từng trang thống kê cụ thể
   - Hướng dẫn sử dụng nhanh

2. **Thống Kê Doanh Thu** - `ThongKe/ThongKeDanhThu/index.vue`
   - Phân tích doanh thu theo ngày
   - Tổng doanh thu, số đơn hàng, giá trị trung bình
   - Biểu đồ dạng đường (line chart)

3. **Thống Kê Khách Hàng Mới** - `ThongKe/ThongKeKhachHangMoi/index.vue`
   - Theo dõi số lượng khách hàng mới đăng ký
   - Tổng khách hàng, trung bình/ngày, ngày cao nhất
   - Biểu đồ dạng cột (bar chart)

4. **Thống Kê Vé Bán Ra** - `ThongKe/ThongKeVeBanRa/index.vue`
   - Phân tích vé bán ra và thanh toán
   - Tổng vé, vé thanh toán, tỷ lệ thanh toán
   - Biểu đồ dạng cột (bar chart)

5. **Thống Kê Chi Tiêu Khách Hàng** - `ThongKe/ThongKeChiTieuKhachHang/index.vue`
   - Phân tích chi tiêu từng khách hàng
   - Tổng chi tiêu, số khách hàng, chi tiêu trung bình
   - Biểu đồ dạng bánh (doughnut chart) - Top 10 khách hàng

6. **Thống Kê Hiệu Suất Tour** - `ThongKe/ThongKeTour/index.vue`
   - Phân tích hiệu suất bán tour
   - Tổng tour, vé bán ra, doanh thu dự kiến
   - Biểu đồ dạng cột nằm (horizontal bar chart)

## 🔧 Cài Đặt Router

Thêm các route sau vào `src/router/index.js`:

```javascript
// Thống Kê
{
    path: 'thong-ke',
    meta: { requiresAuth: true },
    component: () => import('../components/Admin/ThongKe/index.vue'),
    name: 'thong-ke'
},
{
    path: 'thong-ke/doanh-thu',
    meta: { requiresAuth: true },
    component: () => import('../components/Admin/ThongKe/ThongKeDanhThu/index.vue'),
    name: 'thong-ke-doanh-thu'
},
{
    path: 'thong-ke/khach-hang-moi',
    meta: { requiresAuth: true },
    component: () => import('../components/Admin/ThongKe/ThongKeKhachHangMoi/index.vue'),
    name: 'thong-ke-khach-hang-moi'
},
{
    path: 'thong-ke/ve-ban-ra',
    meta: { requiresAuth: true },
    component: () => import('../components/Admin/ThongKe/ThongKeVeBanRa/index.vue'),
    name: 'thong-ke-ve-ban-ra'
},
{
    path: 'thong-ke/chi-tieu-khach-hang',
    meta: { requiresAuth: true },
    component: () => import('../components/Admin/ThongKe/ThongKeChiTieuKhachHang/index.vue'),
    name: 'thong-ke-chi-tieu-khach-hang'
},
{
    path: 'thong-ke/tour',
    meta: { requiresAuth: true },
    component: () => import('../components/Admin/ThongKe/ThongKeTour/index.vue'),
    name: 'thong-ke-tour'
}
```

## 📡 API Endpoints

Các trang thống kê sử dụng các endpoint sau:

- `POST /admin/thong-ke/doanh-thu` - Doanh thu theo ngày
- `POST /admin/thong-ke/khach-hang-moi` - Khách hàng mới theo ngày
- `POST /admin/thong-ke/ve-ban-ra` - Vé bán ra theo ngày
- `POST /admin/thong-ke/chi-tieu-khach-hang` - Chi tiêu khách hàng
- `POST /admin/thong-ke/tour` - Hiệu suất tour

**Request Body (cho tất cả endpoints):**
```json
{
    "begin": "2024-01-01",
    "end": "2024-01-31"
}
```

**Headers:**
```javascript
{
    "Authorization": "Bearer " + localStorage.getItem('key_admin')
}
```

## 🎨 Tính Năng Chính

### Bộ Lọc Ngày
- Chọn "Từ Ngày" và "Đến Ngày"
- Nhấn "Cập Nhật" để tải dữ liệu mới

### Thẻ Tóm Tắt (Summary Cards)
- Hiển thị các chỉ số chính
- Cập nhật tự động khi load dữ liệu

### Biểu Đồ (Charts)
- Sử dụng Chart.js
- Tự động điều chỉnh theo kích thước màn hình
- Hỗ trợ nhiều loại biểu đồ

### Bảng Dữ Liệu (Data Tables)
- Liệt kê chi tiết dữ liệu
- Hover để tô nền hàng
- Định dạng tiền tệ VND

## 📊 Loại Biểu Đồ Sử Dụng

- **Line Chart** (Đường): Doanh thu theo ngày
- **Bar Chart** (Cột): Khách hàng mới, vé bán ra
- **Doughnut Chart** (Bánh): Chi tiêu khách hàng (Top 10)
- **Horizontal Bar Chart** (Cột nằm): Hiệu suất tour

## 🔐 Quyền Truy Cập

- Tất cả các trang thống kê yêu cầu quyền `id_chuc_nang = 4`
- Backend sẽ kiểm tra quyền thông qua `PhanQuyen` model
- Nếu không có quyền, API sẽ trả về lỗi

## 🎯 Chức Năng Bổ Sung

### Toast Notifications
- Hiển thị thông báo thành công/lỗi
- Sử dụng `this.$toast.success()` và `this.$toast.error()`

### Loading Overlay
- Hiển thị overlay khi đang tải dữ liệu
- Ngăn người dùng tương tác khi đang xử lý

### Định Dạng Dữ Liệu
- Định dạng tiền: `formatVND()`
- Định dạng ngày: `formatDate()`
- Tính toán tỷ lệ: `getConversionRate()`

## 🚀 Cách Sử Dụng

1. **Truy cập trang chính:** `/admin/thong-ke`
2. **Chọn thống kê cần xem** bằng cách nhấp vào thẻ
3. **Chọn khoảng thời gian** bằng bộ lọc ngày
4. **Nhấn "Cập Nhật"** để tải dữ liệu
5. **Xem biểu đồ và bảng dữ liệu** để phân tích

## 📝 Lưu Ý

- Mặc định, các trang sẽ tải dữ liệu 30 ngày gần nhất
- Tất cả dữ liệu phải được xác thực qua token lưu trong localStorage
- Token key: `key_admin`
- Dữ liệu được lấy từ các bảng: `khach_hangs`, `hoa_dons`, `ves`, `tours`

## 🐛 Troubleshooting

**Lỗi: "Bạn không có quyền thực hiện chức năng này!"**
- Kiểm tra quyền người dùng trong bảng `phan_quyen`
- Đảm bảo `id_chuc_nang = 4` được gán cho vai trò người dùng

**Lỗi: Biểu đồ không hiển thị**
- Kiểm tra xem Chart.js đã được import đúng
- Kiểm tra xem canvas element có ID đúng không
- Kiểm tra dữ liệu API response

**Lỗi: API Response là 0**
- Đảm bảo token đã lưu trong localStorage
- Kiểm tra kết nối đến backend API
- Kiểm tra khoảng thời gian có dữ liệu không
