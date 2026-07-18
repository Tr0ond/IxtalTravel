# Hướng dẫn cấu hình payOS cho IxtalTravel

Tích hợp này hiển thị QR payOS trực tiếp trong phần **Chuyển khoản ngân hàng**, không chuyển khách sang trang checkout payOS. Sau khi khách quét QR và chuyển khoản, webhook của payOS tự động cập nhật hóa đơn/vé; nút **Tôi đã thanh toán** dùng để kiểm tra lại trạng thái thật từ backend.

## 1. Chuẩn bị tài khoản payOS

1. Đăng ký hoặc đăng nhập tại <https://my.payos.vn>.
2. Xác thực tổ chức/cá nhân theo hướng dẫn của payOS.
3. Liên kết tài khoản ngân hàng nhận tiền.
4. Tạo một **Kênh thanh toán** cho IxtalTravel.
5. Mở kênh vừa tạo và sao chép ba giá trị:
   - Client ID
   - API Key
   - Checksum Key

Không đưa ba khóa này vào frontend, Git hoặc ảnh chụp màn hình công khai.

## 2. Cấu hình Laravel

Mở `be_travel/.env` và thêm:

```env
FRONTEND_URL=http://localhost:5173

PAYOS_CLIENT_ID=client_id_cua_ban
PAYOS_API_KEY=api_key_cua_ban
PAYOS_CHECKSUM_KEY=checksum_key_cua_ban
PAYOS_API_URL=https://api-merchant.payos.vn

# Không cần khai báo nếu dùng CA bundle có sẵn trong repository
# PAYOS_CA_BUNDLE=D:/duong-dan-den/cacert.pem

# Có thể để trống để hệ thống tự ghép từ FRONTEND_URL
PAYOS_RETURN_URL=
PAYOS_CANCEL_URL=

PAYOS_EXPIRE_MINUTES=15
PAYOS_TIMEOUT=20
```

Trong production, đổi `FRONTEND_URL` thành domain HTTPS của frontend, ví dụ:

```env
FRONTEND_URL=https://travel.example.com
PAYOS_RETURN_URL=https://travel.example.com/Ket-qua-thanh-toan
PAYOS_CANCEL_URL=https://travel.example.com/Ket-qua-thanh-toan
```

Sau khi thay `.env`, chạy bằng PHP 8.2 trở lên:

```powershell
cd D:\IxtalTravel\be_travel
php artisan optimize:clear
php artisan migrate
```

Migration sẽ tạo bảng `payos_transactions` để lưu payment link, trạng thái, mã tham chiếu và dữ liệu webhook.

## 3. Cấu hình webhook trên payOS

Webhook phải là URL backend public, dùng HTTPS và payOS truy cập được. URL của dự án là:

```text
https://API_DOMAIN/api/client/payos/webhook
```

Ví dụ:

```text
https://api.travel.example.com/api/client/payos/webhook
```

Trong trang quản lý Kênh thanh toán của payOS, nhập URL trên vào trường Webhook URL và xác nhận. payOS sẽ gửi một payload mẫu; endpoint của dự án đã hỗ trợ lần kiểm tra này.

Không dùng `localhost` làm webhook vì máy chủ payOS không thể truy cập máy cá nhân. Khi phát triển local, dùng một HTTPS tunnel như ngrok hoặc Cloudflare Tunnel và cấu hình URL tunnel, ví dụ:

```text
https://your-tunnel.example/api/client/payos/webhook
```

Mỗi khi URL tunnel đổi, cần cập nhật lại webhook trên payOS.

## 4. Chạy dự án và kiểm thử

Backend:

```powershell
cd D:\IxtalTravel\be_travel
php artisan serve
```

Frontend:

```powershell
cd D:\IxtalTravel\fe_travel
npm run dev
```

Luồng kiểm tra:

1. Đăng nhập bằng tài khoản khách hàng.
2. Đặt một tour để tạo hóa đơn.
3. Mở trang thanh toán và chọn **Chuyển khoản ngân hàng qua payOS**.
4. Quét QR payOS ngay trên trang bằng ứng dụng ngân hàng.
5. Hoàn tất chuyển khoản và bấm **Tôi đã thanh toán**.
6. payOS chuyển trình duyệt về trang kết quả và đồng thời gọi webhook.
7. Kiểm tra hóa đơn có `trang_thai = 2`, `phuong_thuc_thanh_toan = PAYOS` và các vé có `tinh_trang = 2`.
8. Kiểm tra bản ghi tương ứng trong `payos_transactions` có `status = PAID`.

payOS hiện không có sandbox riêng. Nên kiểm thử bằng một hóa đơn có giá trị nhỏ vì giao dịch diễn ra trên môi trường thật.

## 5. Các endpoint đã thêm

| Method | Endpoint | Xác thực | Mục đích |
|---|---|---|---|
| `POST` | `/api/client/payos/tao-thanh-toan` | Bearer token khách hàng | Tạo checkout link |
| `GET` | `/api/client/payos/check-thanh-toan` | Bearer token khách hàng | Đồng bộ/đọc trạng thái |
| `POST` | `/api/client/payos/webhook` | Chữ ký payOS | Nhận kết quả thanh toán |

Webhook là nguồn xác nhận chính. Query string ở trang `returnUrl` chỉ dùng để điều hướng giao diện; backend luôn kiểm tra lại payOS hoặc chờ webhook trước khi đánh dấu đã thanh toán.

## 6. Xử lý lỗi thường gặp

### Báo `payOS chưa được cấu hình`

Kiểm tra đủ ba biến `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`, sau đó chạy:

```powershell
php artisan optimize:clear
```

### Tạo link thất bại vì signature

Kiểm tra Checksum Key thuộc đúng Kênh thanh toán. Không thêm dấu nháy hoặc khoảng trắng ngoài ý muốn trong `.env`.

### Báo `cURL error 60`

Dự án mặc định dùng `be_travel/resources/certs/cacert.pem` để xác minh HTTPS của payOS. Sau khi cập nhật code hoặc thay CA bundle, chạy `php artisan optimize:clear` và khởi động lại Laravel. Nếu muốn dùng CA bundle riêng, đặt đường dẫn tuyệt đối bằng dấu `/`, ví dụ:

```env
PAYOS_CA_BUNDLE=D:/IxtalTravel/be_travel/resources/certs/cacert.pem
```

### Thanh toán thành công nhưng hóa đơn chưa đổi trạng thái

1. Kiểm tra Webhook URL có public và dùng HTTPS.
2. Xem `be_travel/storage/logs/laravel.log`.
3. Kiểm tra firewall/reverse proxy có cho phép `POST /api/client/payos/webhook`.
4. Kiểm tra bản ghi trong `payos_transactions` và trường `error_message`.
5. Mở lại trang kết quả; endpoint kiểm tra trạng thái sẽ đồng bộ trực tiếp với payOS nếu webhook bị chậm.

### Localhost không nhận webhook

Đây là hành vi bình thường. Dùng HTTPS tunnel hoặc triển khai backend lên một domain public trước khi thử webhook end-to-end.

## 7. Lưu ý khi đưa lên production

- Bắt buộc dùng HTTPS cho frontend, API và webhook.
- Không commit file `.env` hay các khóa payOS.
- Sau khi đổi khóa, chạy `php artisan optimize:clear`.
- Chỉ coi giao dịch thành công sau khi chữ ký webhook hợp lệ và số tiền khớp hóa đơn.
- Thiết lập sao lưu database và theo dõi log lỗi webhook.

Tài liệu chính thức:

- <https://payos.vn/docs/api/>
- <https://payos.vn/docs/du-lieu-tra-ve/webhook/>
- <https://payos.vn/docs/moi-truong-test/>
