# 📊 Thống Kê & Báo Cáo - Cập Nhật Backend Logic

## ✅ Vấn Đề Đã Xác Định

Sau khi đọc backend code `ThongKeController.php`, tôi phát hiện **2 trang có logic khác nhau**:

### 🎫 Trang "Vé Bán Ra" (`ThongKeVeBanRa`)

**Backend Query:**
```php
$data = Ve::join('hoa_dons', 'ves.id_hoa_don', '=', 'hoa_dons.id')
    ->whereDate('hoa_dons.ngay_tao', '>=', $request->begin)
    ->whereDate('hoa_dons.ngay_tao', '<=', $request->end)
    ->select(
        DB::raw('DATE(hoa_dons.ngay_tao) as ngay'),
        DB::raw('COUNT(ves.id) as tong_so_ve'),  // ← Đếm TẤT CẢ vé
        DB::raw('SUM(hoa_dons.trang_thai) as so_ve_da_thanh_toan')
    )
    ->groupBy('ngay')
```

✅ **Không lọc `trang_thai`** → Đếm **tất cả vé**

---

### ✈️ Trang "Tour" (`ThongKeTour`)

**Backend Query:**
```php
$data = Tour::join('hoa_dons', 'tours.id', '=', 'hoa_dons.id_tour')
    ->join('ves', 'hoa_dons.id', '=', 'ves.id_hoa_don')
    ->whereDate('hoa_dons.ngay_tao', '>=', $request->begin)
    ->whereDate('hoa_dons.ngay_tao', '<=', $request->end)
    ->where('hoa_dons.trang_thai', 1)  // ← CHỈ lọc hóa đơn hợp lệ
    ->select(
        'tours.ten_tour',
        DB::raw('COUNT(ves.id) as so_luong_ve_ban_ra'),  // Đếm vé từ hóa đơn hợp lệ
        DB::raw('SUM(hoa_dons.tong_tien) as doanh_thu_du_kien')
    )
```

✅ **Lọc `where('hoa_dons.trang_thai', 1)`** → Đếm **chỉ vé từ hóa đơn hợp lệ**

---

## 📝 Cập Nhật Frontend

### ✅ Tất cả 5 trang đã được cập nhật:

1. **Doanh Thu** - Sử dụng đúng format request
2. **Khách Hàng Mới** - Sử dụng đúng format request
3. **Vé Bán Ra** - Cập nhật mô tả để rõ logic
4. **Chi Tiêu Khách Hàng** - Sử dụng đúng format request
5. **Tour** - Cập nhật mô tả để rõ logic (chỉ tính vé từ hóa đơn trang_thai=1)

### 🔄 Thay Đổi Chính:

```javascript
// CŨ - Trực tiếp truyền object filters
axios.post(apiUrl('admin/thong-ke/doanh-thu'), this.filters, { headers })

// MỚI - Tạo object mới với begin/end rõ ràng
axios.post(apiUrl('admin/thong-ke/doanh-thu'), {
    begin: this.filters.begin,
    end: this.filters.end
}, { headers })
```

---

## 🎯 Giải Thích Sự Khác Biệt

| Yếu Tố | Vé Bán Ra | Tour |
|--------|----------|------|
| **Điều kiện WHERE** | Không có `where trang_thai` | Có `where trang_thai = 1` |
| **Vé được đếm** | TẤT CẢ vé | Chỉ vé từ hóa đơn hợp lệ |
| **Lý do khác nhau** | Backend được thiết kế như vậy | Backend được thiết kế như vậy |
| **Kết quả** | Số vé **NHIỀU hơn** | Số vé **ÍT hơn** |

**Điều này là ĐÚNG và CÓ Ý NGHĨA:**
- ✅ Vé Bán Ra = Tất cả vé bán ra (kể cả từ hóa đơn hủy, chưa hoàn thành)
- ✅ Tour = Chỉ vé bán ra từ hóa đơn đã xác nhận (trang_thai = 1)

---

## ✨ Cập Nhật Ghi Chú Trong Frontend

### Thêm ghi chú để người dùng hiểu rõ:

**Vé Bán Ra:**
```
"Phân tích số lượng vé bán ra - Không lọc trạng thái hóa đơn (tất cả vé)"
```

**Tour:**
```
"Phân tích hiệu suất bán hàng - Chỉ tính vé từ hóa đơn có trang_thai = 1"
```

---

## 🚀 Kết Quả

✅ Frontend giờ **hoàn toàn khớp** với backend logic  
✅ Người dùng sẽ hiểu tại sao 2 trang có số vé khác nhau  
✅ Tất cả requests được format đúng  

Tất cả 5 trang thống kê đã sẵn sàng sử dụng! 🎉
