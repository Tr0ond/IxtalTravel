<template>
    <div class="result-wrapper">
        <div class="result-container animate__animated animate__fadeIn">
            
            <div v-if="isLoading" class="loading-box text-center">
                <div class="loader"></div>
                <h2 class="fw-bold mt-4">Đang xác thực giao dịch...</h2>
                <p class="text-muted">Hệ thống đang kiểm tra kết quả, vui lòng không thoát trang.</p>
            </div>

            <!-- Giao diện Chờ duyệt (Manual Bank Transfer) -->
            <div v-else-if="isPending" class="pending-box text-center">
                <div class="icon-circle pending-icon"><i class="fa-solid fa-clock"></i></div>
                <h2 class="fw-bold text-warning">Giao dịch đang chờ duyệt!</h2>
                <p>Bạn đã chọn phương thức <b>Chuyển khoản thủ công</b>. Vui lòng đợi Admin kiểm tra tài khoản ngân hàng và xác nhận đơn hàng của bạn.</p>

                <div class="transaction-info text-start bg-light p-3 rounded mb-4 mt-4">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Số tiền cần chuyển:</span>
                        <b class="text-danger fs-5">{{ formatVND(orderInfo.amount) }}</b>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Nội dung chuyển khoản:</span>
                        <b>{{ orderInfo.transactionId }}</b>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Ngân hàng:</span>
                        <b>{{ orderInfo.bank }}</b>
                    </div>
                </div>

                <!-- Thanh load biểu thị hệ thống đang kiểm tra ngầm -->
                <div class="d-flex align-items-center justify-content-center text-muted small mb-4">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style="color: #ffc107;"></span>
                    Hệ thống đang kiểm tra tự động...
                </div>

                <div class="action-buttons">
                    <button @click="goHome" class="btn btn-outline-secondary px-4 py-2 fw-bold w-100 me-2">Về trang chủ</button>
                    <button @click="goProfile" class="btn btn-warning text-dark px-4 py-2 fw-bold w-100">Kiểm tra lịch sử</button>
                </div>
            </div>

            <!-- Giao diện VNPAY / Hoặc Admin đã duyệt Thành Công -->
            <div v-else-if="isSuccess" class="success-box text-center">
                <div class="icon-circle success-icon">✓</div>
                <h2 class="fw-bold text-success">Thanh toán thành công!</h2>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của <b>IxtalTour</b>. Đơn hàng của bạn đã được xác nhận và cập nhật vào hệ thống.</p>

                <div class="transaction-info text-start bg-light p-3 rounded mb-4 mt-4">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Số tiền đã thanh toán:</span>
                        <b class="text-success fs-5">{{ formatVND(orderInfo.amount) }}</b>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Mã giao dịch:</span>
                        <b>{{ orderInfo.transactionId }}</b>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Cổng thanh toán:</span>
                        <b>{{ orderInfo.bank }}</b>
                    </div>
                </div>

                <div class="action-buttons">
                    <button @click="goHome" class="btn btn-outline-primary px-4 py-2 fw-bold w-100 me-2">Về trang chủ</button>
                    <button @click="goProfile" class="btn btn-primary px-4 py-2 fw-bold w-100">Xem vé của tôi</button>
                </div>
            </div>

            <!-- Giao diện Thất bại -->
            <div v-else class="error-box text-center">
                <div class="icon-circle error-icon">✗</div>
                <h2 class="fw-bold text-danger">Giao dịch không thành công</h2>
                <p class="mb-4 mt-3">{{ errorMessage }}</p>
                <div class="action-buttons text-center d-block">
                    <button @click="goHome" class="btn btn-secondary px-5 py-2 fw-bold">Quay về trang chủ</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api'; 

export default {
    name: 'KetQuaThanhToan',
    data() {
        return {
            isLoading: true,
            isSuccess: false,
            isPending: false, 
            errorMessage: '',
            orderInfo: {
                amount: 0,
                transactionId: '',
                bank: ''
            },
            hoaDonId: null,
            pollingInterval: null // Biến lưu trữ vòng lặp kiểm tra
        }
    },
    mounted() {
        this.verifyPayment();
    },
    beforeUnmount() {
        // Rất quan trọng: Phải dọn dẹp bộ đếm khi thoát khỏi trang để tránh rò rỉ bộ nhớ
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    },
    methods: {
        verifyPayment() {
            const queryParams = this.$route.query;

            // KIỂM TRA MỚI: Nếu khách hàng chọn thanh toán chuyển khoản thủ công
            if (queryParams.method === 'bank_transfer') {
                this.isLoading = false;
                this.isPending = true;
                this.orderInfo.amount = queryParams.amount || 0;
                this.orderInfo.transactionId = queryParams.txnRef || '';
                this.orderInfo.bank = 'MB Bank (Quét QR Thủ công)';

                // Lấy ID hóa đơn từ txnRef (VD: HDTOUR15 -> lấy số 15)
                if (this.orderInfo.transactionId) {
                    this.hoaDonId = this.orderInfo.transactionId.replace('HDTOUR', '');
                    this.startPolling(); // Bắt đầu vòng lặp gọi API
                }
                return;
            }

            // LOGIC CŨ: Kiểm tra kết quả trả về từ VNPAY
            if (queryParams.vnp_ResponseCode !== '00') {
                this.isLoading = false;
                this.isSuccess = false;
                this.errorMessage = 'Giao dịch đã bị hủy hoặc gặp lỗi trong quá trình thực hiện tại VNPAY.';
                return;
            }

            axios.get(apiUrl("client/vnpay/check-thanh-toan"), {
                params: queryParams,
                headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
            })
            .then(res => {
                this.isLoading = false;
                if (res.data.status) {
                    this.isSuccess = true;
                    this.orderInfo.amount = queryParams.vnp_Amount / 100;
                    this.orderInfo.transactionId = queryParams.vnp_TransactionNo;
                    this.orderInfo.bank = queryParams.vnp_BankCode || 'VNPAY';
                } else {
                    this.isSuccess = false;
                    this.errorMessage = res.data.message || 'Xác thực chữ ký thanh toán thất bại.';
                }
            })
            .catch(err => {
                this.isLoading = false;
                this.isSuccess = false;
                this.errorMessage = 'Không thể kết nối với máy chủ để xác thực giao dịch.';
                console.error(err);
            });
        },

        // HÀM GỌI API KIỂM TRA MỖI 5 GIÂY
        startPolling() {
            this.pollingInterval = setInterval(() => {
                this.checkStatusBackend();
            }, 5000); 
        },

        checkStatusBackend() {
            if (!this.hoaDonId) return;

            axios.get(apiUrl("client/hoa-don/check-trang-thai/" + this.hoaDonId), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
            })
            .then(res => {
                if (res.data.status) {
                    // Nếu admin đã bấm "Đã thanh toán"
                    if (res.data.trang_thai == 2) { 
                        clearInterval(this.pollingInterval); // Tắt vòng lặp
                        this.isPending = false;
                        this.isSuccess = true;
                        this.$toast.success("Admin đã xác nhận thanh toán thành công!");
                    } 
                    // Nếu admin bấm "Đã hủy"
                    else if (res.data.trang_thai == 0) { 
                        clearInterval(this.pollingInterval); // Tắt vòng lặp
                        this.isPending = false;
                        this.isSuccess = false;
                        this.errorMessage = 'Hóa đơn của bạn đã bị hủy bởi Quản trị viên.';
                        this.$toast.error("Hóa đơn đã bị hủy.");
                    }
                }
            })
            .catch(err => console.log("Lỗi check trạng thái ngầm:", err));
        },

        goHome() { this.$router.push('/'); },
        goProfile() { this.$router.push('/client/lich-su-dat-tour'); },
        formatVND(value) {
            if (!value) return "0 ₫";
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    }
}
</script>

<style scoped>
.action-buttons {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    width: 100%; 
    margin-top: 20px;
}
.result-wrapper {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
}
.result-container {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    max-width: 550px;
    width: 100%;
}
.icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 35px;
    color: white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.success-icon { background: #28a745; }
.error-icon { background: #dc3545; }
.pending-icon { background: #ffc107; font-size: 30px;}

.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #005baa;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>