<template>
    <div class="receipt-wrapper">
        <!-- Nút thao tác nhanh -->
        <div class="action-buttons no-print">
            <button @click="quayLai" class="btn-action btn-back">
                <i class="fa-solid fa-chevron-left"></i> Quay Lại
            </button>
            <button @click="inVe" class="btn-action btn-print">
                <i class="fa-solid fa-print"></i> In Vé Ngay
            </button>
        </div>

        <div class="receipt-container" v-if="loaded">
            <div class="ticket">
                <!-- Phần đầu vé -->
                <div class="ticket-header">
                    <div class="brand">
                            <img src="../../../assets/images/Logo1.png" alt="Logo" class="logo" style="height:auto; width:70px">
                            <div class="brand-info">
                            <h1>IXTAL TOUR</h1>
                            <p>Trải nghiệm du lịch đích thực</p>
                        </div>
                    </div>
                    <div class="ticket-status" :class="getStatusClass(hoa_don.trang_thai)">
                        {{ getStatusText(hoa_don.trang_thai) }}
                    </div>
                </div>

                <!-- Đường cắt răng cưa trang trí -->
                <div class="stub-separator">
                    <div class="cut-line"></div>
                </div>

                <div class="ticket-body">
                    <!-- Thông tin khách hàng -->
                    <div class="info-section customer-info">
                        <div class="info-item">
                            <span class="label">KHÁCH HÀNG</span>
                            <span class="value">{{ khach_hang.ho_va_ten }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">SỐ ĐIỆN THOẠI</span>
                            <span class="value">{{ khach_hang.so_dien_thoai }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">MÃ HÓA ĐƠN</span>
                            <span class="value code">{{ hoa_don.ma_hoa_don }}</span>
                        </div>
                    </div>

                    <!-- Thông tin Tour -->
                    <div class="tour-details">
                        <h2 class="tour-title">{{ tour.ten_tour }}</h2>
                        <div class="grid-info">
                            <div class="grid-item">
                                <i class="fa-solid fa-calendar-day"></i>
                                <div class="content-block">
                                    <span class="label">KHỞI HÀNH</span>
                                    <span class="value">{{ formatDate(tour.ngay_bat_dau) }}</span>
                                </div>
                            </div>
                            <div class="grid-item">
                                <i class="fa-solid fa-location-dot"></i>
                                <div class="content-block">
                                    <span class="label">ĐIỂM ĐÓN</span>
                                    <span class="value">{{ tour.diem_don }}</span>
                                </div>
                            </div>
                            <div class="grid-item">
                                <i class="fa-solid fa-users"></i>
                                <div class="content-block">
                                    <span class="label">SỐ LƯỢNG</span>
                                    <span class="value">{{ hoa_don.so_luong_nguoi }} Khách</span>
                                </div>
                            </div>
                            <div class="grid-item">
                                <i class="fa-solid fa-credit-card"></i>
                                <div class="content-block">
                                    <span class="label">THANH TOÁN</span>
                                    <span class="value" style="text-transform: uppercase;">{{ hoa_don.phuong_thuc_thanh_toan }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Danh sách vé chi tiết -->
                    <div class="ticket-list">
                        <div v-for="(ve, index) in danh_sach_ve" :key="index" class="ve-item">
                            <div class="ve-info">
                                <span class="ve-index">VÉ #{{ index + 1 }}</span>
                                <span class="ve-price">{{ formatVND(ve.gia_ve) }}</span>
                            </div>
                            <div class="barcode-wrapper">
                                <img :src="`https://barcode.tec-it.com/barcode.ashx?data=${ve.ma_ve}&code=Code128`" alt="Barcode">
                                <p>{{ ve.ma_ve }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tổng tiền & Footer -->
                <div class="ticket-footer">
                    <div class="total-section">
                        <span>TỔNG CỘNG</span>
                        <span class="total-amount">{{ formatVND(hoa_don.tong_tien) }}</span>
                    </div>
                    <div class="footer-msg">
                        <p>Vui lòng xuất trình mã này tại quầy đón khách.</p>
                        <p class="website">https://ixtaltravel.deloydz.io.vn/</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="loading-container">
            <div class="spinner"></div>
            <p>Đang khởi tạo vé...</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import apiUrl from '../../../utils/api';

export default {
    data() {
        return {
            ma_hoa_don: this.$route.params.ma_hoa_don,
            hoa_don: {},
            khach_hang: {},
            tour: {},
            danh_sach_ve: [],
            loaded: false
        }
    },
    mounted() {
        this.getTicketData();
    },
    methods: {
        getTicketData() {
            axios.post(apiUrl("admin/hoa-don/in-ve"), { ma_hoa_don: this.ma_hoa_don }, {
                headers: { Authorization: "Bearer " + localStorage.getItem("key_admin") },
            })
            .then((res) => {
                if (res.data.status) {
                    const result = res.data.data;
                    this.hoa_don     = result.thong_tin_hoa_don;
                    this.khach_hang  = result.thong_tin_khach_hang;
                    this.tour        = result.thong_tin_tour;
                    this.danh_sach_ve = result.danh_sach_ve;
                    this.loaded      = true;
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(() => {
                this.$toast.error("Lỗi tải dữ liệu!");
            });
        },
        formatVND(n) {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
        },
        formatDate(d) {
            if (!d) return '---';
            const date = new Date(d);
            const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            return `${time} ${day}`;
        },
        getStatusText(s) {
            const texts = { 0: 'ĐÃ HỦY', 1: 'CHỜ THANH TOÁN', 2: 'ĐÃ THANH TOÁN' };
            return texts[s] || 'CHƯA XÁC ĐỊNH';
        },
        getStatusClass(s) {
            const classes = { 0: 'status-cancelled', 1: 'status-pending', 2: 'status-paid' };
            return classes[s] || '';
        },
        quayLai() { this.$router.go(-1); },
        inVe() { window.print(); }
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=JetBrains+Mono&display=swap');

.receipt-wrapper {
    min-height: 100vh;
    background: #e2e8f0;
    padding: 60px 20px;
    font-family: 'Montserrat', sans-serif;
    display: flex;
    justify-content: center;
}

.ticket {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 15px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

/* Header */
.ticket-header {
    padding: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand { display: flex; align-items: center; gap: 12px; }
.logo { width: 50px; height: 50px; }
.brand-info h1 { font-size: 20px; font-weight: 800; margin: 0; color: #1e293b; letter-spacing: 1px; }
.brand-info p { font-size: 10px; margin: 0; color: #64748b; font-weight: 600; }

.ticket-status {
    font-size: 10px;
    padding: 5px 10px;
    border-radius: 20px;
    font-weight: 700;
}
.status-paid { background: #dcfce7; color: #166534; }
.status-pending { background: #fef9c3; color: #854d0e; }
.status-cancelled { background: #fee2e2; color: #991b1b; }

/* Separator */
.stub-separator {
    height: 20px;
    background: transparent;
    position: relative;
    margin: 0 10px;
}
.stub-separator::before, .stub-separator::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #e2e8f0;
    border-radius: 50%;
    top: 0;
}
.stub-separator::before { left: -20px; }
.stub-separator::after { right: -20px; }
.cut-line {
    border-top: 2px dashed #cbd5e1;
    position: absolute;
    top: 50%;
    width: 100%;
}

/* Body */
.ticket-body { padding: 25px; }

.info-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
}
.info-item { display: flex; flex-direction: column; gap: 4px; }
.label { font-size: 9px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
.value { font-size: 13px; font-weight: 700; color: #1e293b; }
.value.code { font-family: 'JetBrains Mono', monospace; color: #6366f1; }

.tour-details {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
}
.tour-title { font-size: 16px; font-weight: 700; margin: 0 0 15px 0; color: #0f172a; line-height: 1.4; }

.grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Fixed Grid Item Fix */
.grid-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}
.grid-item i {
    color: #6366f1;
    font-size: 16px;
    margin-top: 4px;
}
.content-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

/* Barcode list */
.ticket-list { display: flex; flex-direction: column; gap: 15px; }
.ve-item {
    border: 1px solid #e2e8f0;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
}
.ve-info { display: flex; justify-content: space-between; margin-bottom: 10px; }
.ve-index { font-weight: 700; font-size: 12px; color: #64748b; }
.ve-price { font-weight: 800; font-size: 14px; color: #1e293b; }
.barcode-wrapper img { width: 100%; max-width: 300px; }
.barcode-wrapper p { font-family: 'JetBrains Mono'; font-size: 10px; margin: 5px 0 0 0; }

/* Footer */
.ticket-footer {
    padding: 25px;
    background: #1e293b;
    color: white;
}
.total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #334155;
    padding-bottom: 15px;
    margin-bottom: 15px;
}
.total-amount { font-size: 22px; font-weight: 800; color: #818cf8; }
.footer-msg { text-align: center; font-size: 10px; opacity: 0.7; }
.website { font-weight: 700; margin-top: 10px; opacity: 1; }

/* Buttons */
.action-buttons { position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; }
.btn-action {
    padding: 12px 20px; border-radius: 30px; border: none; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
.btn-back { background: white; color: #1e293b; }
.btn-print { background: #6366f1; color: white; }

/* Loading */
.loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; }
.spinner { width: 40px; height: 40px; border: 4px solid #cbd5e1; border-top: 4px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

@media print {
    .no-print { display: none !important; }
    .receipt-wrapper { padding: 0; background: white; }
    .ticket { box-shadow: none; border: 1px solid #eee; width: 100%; max-width: none; }
}
</style>