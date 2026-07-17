<template>
    <div class="container-fluid bg-light" style="min-height: 100vh; font-family: 'Inter', sans-serif;">
        <div class="container-xl py-4 py-md-5">
            <div class="row g-4">
                
                <div class="col-12 col-lg-4">
                    <div class="card border-0 premium-shadow h-100 scan-card">
                        <div class="card-body p-4 p-md-5">
                            <div class="mb-4">
                                <h2 class="fw-bold mb-2 text-dark-slate">Quét Mã Vé Tour</h2>
                                <p class="text-muted-custom mb-0" style="font-size: 13px; line-height: 1.6;">
                                    Nhập mã vé hoặc quét mã vạch để tra cứu thông tin hành trình khách đi tour
                                </p>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-semibold mb-2" style="font-size: 12px; color: #374151;">Mã vé hành khách</label>
                                <input ref="scannerInput" type="text" class="form-control custom-input"
                                    placeholder="Ví dụ: VE-ABC123XYZ..." v-model="ma_ve_input"
                                    @keyup.enter="scanTicket" autofocus>
                            </div>
                            
                            <button class="btn btn-dark-custom w-100 mb-3" @click="scanTicket">
                                <i class="bi bi-search me-2"></i> Tra cứu nhanh
                            </button>

                            <button class="btn btn-outline-custom w-100" @click="resetScan">
                                <i class="bi bi-arrow-clockwise me-2"></i> Đổi vé khác
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-8">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                        <i class="bi bi-upc-scan" style="color: #1d5c3a; font-size: 1.2rem;"></i>
                        <h2 class="m-0 fw-bold text-dark-slate" style="font-size: 16px;">Chi tiết dữ liệu vé hành khách</h2>
                    </div>

                    <div v-if="!hasSearched && !ticket_info" class="card border-0 premium-shadow empty-state">
                        <i class="bi bi-upc-scan empty-icon"></i>
                        <p class="empty-title">Chưa có vé nào được tải</p>
                        <p class="empty-subtitle">Nhập hoặc quét mã vé bên trái để xem chi tiết.</p>
                    </div>

                    <div v-else-if="hasSearched && !ticket_info" class="card border-0 premium-shadow empty-state error-state">
                        <p class="empty-title text-danger">Không tìm thấy vé</p>
                        <p class="empty-subtitle">Mã vé không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                    </div>

                    <div v-else-if="ticket_info" class="card border-0 premium-shadow d-flex flex-column flex-md-row overflow-hidden" style="min-height: 420px;">
                        
                        <div class="poster-container position-relative">
                            <span class="poster-badge">Ảnh chuyến đi</span>
                            <img :src="getImageUrl(getFirstImage(ticket_info.hinh_anh))"
                                 class="poster-img" 
                                 alt="Hình ảnh Tour"
                                 @error="$event.target.src='https://placehold.co/600x800?text=No+Image+Tour'">
                            <div class="poster-gradient"></div>
                            <div class="poster-text">
                                <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ ticket_info.ten_tour }}
                            </div>
                        </div>

                        <div class="details-container d-flex flex-column p-4 p-md-5 w-100">
                            
                            <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                <i v-if="ticket_info.tinh_trang === 2" class="bi bi-check-circle-fill status-icon text-success"></i>
                                <i v-else-if="ticket_info.tinh_trang === 1" class="bi bi-exclamation-triangle-fill status-icon text-warning"></i>
                                <i v-else class="bi bi-x-circle-fill status-icon text-danger"></i>
                                <div>
                                    <small class="text-muted-custom d-block mb-1">Trạng thái thanh toán của vé</small>
                                    <h4 v-if="ticket_info.tinh_trang === 2" class="mb-0 fw-bold text-success status-text">Đã Thanh Toán (Hợp lệ)</h4>
                                    <h4 v-else-if="ticket_info.tinh_trang === 1" class="mb-0 fw-bold text-warning status-text">Chưa Thanh Toán</h4>
                                    <h4 v-else class="mb-0 fw-bold text-danger status-text">Vé Đã Hủy / Vô Hiệu Lực</h4>
                                </div>
                            </div>

                            <div class="mb-4">
                                <small class="text-muted-custom d-block mb-1 fw-medium">Tên Tour dịch vụ</small>
                                <p class="fw-bold mb-0 text-dark-slate" style="font-size: 15px; line-height: 1.4;">{{ ticket_info.ten_tour }}</p>
                            </div>

                            <div class="row g-3 mb-4">
                                <div class="col-6">
                                    <small class="text-muted-custom d-block mb-1 fw-medium">Mã số vé</small>
                                    <p class="mb-0 fw-bold text-success" style="font-size: 14px;">{{ ticket_info.ma_ve }}</p>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted-custom d-block mb-1 fw-medium">Mã hóa đơn</small>
                                    <p class="mb-0 fw-bold text-dark-slate" style="font-size: 14px;">{{ ticket_info.ma_hoa_don }}</p>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted-custom d-block mb-1 fw-medium">Đơn giá vé khách</small>
                                    <p class="mb-0 fw-bold text-success" style="font-size: 14px;">{{ formatVND(ticket_info.gia_ve) }}</p>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted-custom d-block mb-1 fw-medium">Thời điểm đặt mua</small>
                                    <p class="mb-0 fw-bold text-dark-slate" style="font-size: 14px;">{{ ticket_info.created_at }}</p>
                                </div>
                            </div>

                            <hr class="my-0 mb-3" style="opacity: 0.08;">

                            <div class="mb-4">
                                <small class="text-muted-custom d-block mb-1 fw-medium">Họ và tên hành khách đi tour</small>
                                <p class="fw-bold mb-0 text-dark-slate" style="font-size: 16px;">{{ ticket_info.ten_khach_hang }}</p>
                            </div>

                            <div class="mt-auto">
                                
                                <div v-if="ticket_info.is_check_in === 1 && justCheckedIn" class="alert-box alert-success-custom">
                                    <i class="bi bi-check-circle-fill"></i>
                                    <div>
                                        <strong>Xác nhận lên xe thành công</strong>
                                        <p>Hành khách đã được điểm danh vào danh sách đoàn xe.</p>
                                    </div>
                                </div>

                                <div v-else-if="ticket_info.is_check_in === 1 && !justCheckedIn" class="alert-box alert-warning-custom">
                                    <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                                    <div>
                                        <strong class="text-danger">Vé đã xác nhận từ trước!</strong>
                                        <p class="text-danger">Hành khách mang mã vé này đã check-in rồi. Cẩn thận quét trùng mã.</p>
                                    </div>
                                </div>

                                <div v-else>
                                    <div class="alert-box alert-warning-custom" :style="{ marginBottom: ticket_info.tinh_trang === 2 ? '12px' : '0' }">
                                        <i class="bi bi-clock-history"></i>
                                        <div>
                                            <strong>Chưa xác nhận lên xe</strong>
                                            <p v-if="ticket_info.tinh_trang === 2">Vé hợp lệ, vui lòng nhấn xác nhận đón khách.</p>
                                            <p v-else-if="ticket_info.tinh_trang === 1">Hành khách chưa thanh toán đủ chi phí.</p>
                                            <p v-else>Tuyệt đối không đón khách có vé đã bị hủy.</p>
                                        </div>
                                    </div>
                                    
                                    <button v-if="ticket_info.tinh_trang === 2" 
                                        class="btn btn-dark-custom w-100 d-flex justify-content-center align-items-center gap-2"
                                        @click="checkInTicket" style="padding: 14px 0; font-size: 14px;">
                                        <i class="bi bi-check2-square" style="font-size: 18px;"></i> XÁC NHẬN CHO KHÁCH LÊN XE
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';

export default {
    data() {
        return {
            ma_ve_input: '',
            ticket_info: null,
            hasSearched: false, 
            justCheckedIn: false, // Biến mới: Theo dõi việc khách vừa mới check in thành công
        }
    },
    methods: {
        // Hàm lấy ảnh đầu tiên an toàn từ mảng hoặc chuỗi
        getFirstImage(hinh_anh) {
            if (!hinh_anh) return 'https://via.placeholder.com/400x300?text=No+Image';

            // Nếu là mảng
            if (Array.isArray(hinh_anh)) {
                return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/400x300';
            }

            // Nếu là chuỗi JSON
            try {
                let parsed = JSON.parse(hinh_anh);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                return hinh_anh; // Trả về nguyên bản nếu là chuỗi URL thường
            }
        },
        // Hàm lấy URL ảnh sắc nét
        getImageUrl(url) {
            if (!url) return 'https://via.placeholder.com/400x300';
            return url.replace(/-\d+x\d+/g, '');
        },
        scanTicket() {
            if(!this.ma_ve_input.trim()) return;

            this.hasSearched = true;
            this.justCheckedIn = false; // Reset lại mỗi lần quét mã mới

            axios.post(apiUrl("admin/ve/in-ve"), { noi_dung: this.ma_ve_input }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("key_admin")
                }
            })
                .then((res) => {
                    if (res.data.status === 1) {
                        this.ticket_info = res.data.data;

                        // Trường hợp quét trúng vé đã lên xe từ trước
                        if (this.ticket_info.is_check_in === 1) {
                            this.$toast.warning("⚠️ Vé này đã được xác nhận từ trước. Vui lòng kiểm tra lại!");
                        } 
                        // Trường hợp vé hợp lệ và chưa đi -> Tự Check-in
                        else if (this.ticket_info.is_check_in === 0 && this.ticket_info.tinh_trang === 2) {
                            setTimeout(() => {
                                this.checkInTicket();
                            }, 400);
                        } 
                        // Báo lỗi đỏ nếu chưa TT / Hủy
                        else {
                            this.$toast.error("❌ Vé không đủ điều kiện lên xe!");
                        }

                    } else {
                        this.$toast.error(res.data.message);
                        this.ticket_info = null;
                    }
                })
                .catch((res) => {
                    if (res.response && res.response.data.message) {
                        this.$toast.error(res.response.data.message);
                    }
                    this.ticket_info = null;
                })
                .finally(() => {
                    setTimeout(() => {
                        this.ma_ve_input = '';
                        this.$refs.scannerInput.focus();
                    }, 200);
                });
        },

        checkInTicket() {
            axios.post(apiUrl("admin/ve/check-in"), {
                ma_ve: this.ticket_info.ma_ve
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("key_admin")
                }
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.$toast.success(res.data.message);
                        
                        // Cập nhật trạng thái hiển thị
                        this.ticket_info.is_check_in = 1; 
                        this.justCheckedIn = true; // Đánh dấu là VỪA MỚI CHECK IN để hiện màu xanh
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((res) => {
                    if (res.response && res.response.data.message) {
                        this.$toast.error(res.response.data.message);
                    }
                })
                .finally(() => {
                    this.$refs.scannerInput.focus();
                });
        },

        resetScan() {
            this.ticket_info = null;
            this.ma_ve_input = '';
            this.hasSearched = false;
            this.justCheckedIn = false;
            this.$refs.scannerInput.focus();
        },

        formatVND(number) {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(number);
        },
    },
    mounted() {
        this.$refs.scannerInput.focus();
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* --- CÁC THÀNH PHẦN CHUNG --- */
.text-dark-slate { color: #1a2332; }
.text-muted-custom { color: #6b7a8d; }

.premium-shadow {
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02);
}

/* --- CỘT BÊN TRÁI --- */
.scan-card {
    background: #ffffff;
}

.custom-input {
    border: 1.5px solid rgba(0,0,0,0.12);
    border-radius: 10px;
    background: #f8f9fa;
    padding: 12px 14px;
    font-size: 13.5px;
    color: #1a2332;
    box-shadow: none;
    transition: all 0.2s;
}
.custom-input:focus {
    border-color: #1d5c3a;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(29, 92, 58, 0.1);
}

.btn-dark-custom {
    background: #111827;
    color: #ffffff;
    border-radius: 10px;
    padding: 12px 0;
    font-size: 13.5px;
    font-weight: 600;
    border: none;
    transition: background 0.2s;
}
.btn-dark-custom:hover { background: #1f2937; }

.btn-outline-custom {
    background: transparent;
    color: #374151;
    border: 1.5px solid rgba(0,0,0,0.15);
    border-radius: 10px;
    padding: 11px 0;
    font-size: 13.5px;
    font-weight: 500;
}
.btn-outline-custom:hover { background: #f3f4f6; }


/* --- CỘT BÊN PHẢI --- */
.empty-state {
    min-height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(0,0,0,0.08) !important;
    background: #ffffff;
}
.empty-state.error-state {
    border-color: #fecaca !important;
    background: #fffafa;
}
.empty-icon { font-size: 44px; color: #d1d9e0; }
.empty-title { font-size: 15px; font-weight: 600; color: #9aa5b4; margin-top: 14px; margin-bottom: 5px;}
.empty-subtitle { font-size: 12.5px; color: #b0bac6; margin-bottom: 0;}

/* Khu vực Poster */
.poster-container {
    width: 100%;
    height: 240px; /* Chiều cao cố định trên mobile */
    background: #f1f3f5;
    flex-shrink: 0;
}
@media (min-width: 768px) {
    .poster-container {
        width: 260px; /* Rộng 260px trên Desktop */
        height: auto; /* Tự kéo dài theo thẻ cha */
    }
}
.poster-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    z-index: 2;
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}
.poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.poster-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%);
    pointer-events: none;
}
.poster-text {
    position: absolute;
    bottom: 20px;
    left: 16px;
    right: 16px;
    z-index: 2;
    font-size: 12.5px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.45;
}

/* Các Alert boxes */
.alert-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-radius: 12px;
    padding: 14px 18px;
}
.alert-box i { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.alert-box strong { font-size: 13px; margin-bottom: 2px; display: block; }
.alert-box p { font-size: 12px; margin-bottom: 0; }

.alert-success-custom {
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
}
.alert-success-custom i { color: #059669; }
.alert-success-custom strong { color: #065f46; }
.alert-success-custom p { color: #047857; }

.alert-warning-custom {
    background: #fffbeb;
    border: 1.5px solid #fde68a;
}
.alert-warning-custom i { color: #d97706; }
.alert-warning-custom strong { color: #b45309; }
.alert-warning-custom p { color: #b45309; }

.status-icon { font-size: 24px; }
.status-text { font-size: 17px; }
</style>