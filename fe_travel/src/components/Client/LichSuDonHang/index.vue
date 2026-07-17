<template>
    <div class="container my-5">
        <div class="header-section mb-4">
            <h1 class="fw-bold text-dark">Lịch sử đặt tour</h1>
            <p class="text-secondary">Quản lý và xem lại những hành trình tuyệt vời bạn đã trải qua cùng Ixtal Tour.</p>
        </div>

        <div class="filter-bar mb-4 d-flex justify-content-start gap-2">
            <button class="filter-pill" :class="{ active: filter_status === 'all' }" @click="filter_status = 'all'">
                <i class="fa-solid fa-list-ul me-1"></i> Tất cả
            </button>
            <button class="filter-pill paid" :class="{ active: filter_status === 'paid' }" @click="filter_status = 'paid'">
                <i class="fa-solid fa-circle-check me-1"></i> Thành công
            </button>
            <button class="filter-pill pending" :class="{ active: filter_status === 'pending' }" @click="filter_status = 'pending'">
                <i class="fa-solid fa-hourglass-half me-1"></i> Chờ thanh toán
            </button>
            <button class="filter-pill cancelled" :class="{ active: filter_status === 'cancelled' }" @click="filter_status = 'cancelled'">
                <i class="fa-solid fa-circle-xmark me-1"></i> Đã hủy
            </button>
        </div>

        <div v-if="getFilteredHoaDon().length > 0">
            <div v-for="(item, index) in getFilteredHoaDon()" :key="index" class="card mb-4 shadow-sm border-0 tour-card">
                <div class="card-body p-0">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-3">
                            <img :src="getImageUrl(getFirstImage(item.tour.hinh_anh))" 
                                class="img-fluid rounded-start h-100 tour-img"
                                style="object-fit: cover;"
                                alt="tour image">
                        </div>

                        <div class="col-md-6 p-4 border-end">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h4 class="fw-bold mb-0 text-dark">{{ item.tour.ten_tour }}</h4>
                                <span v-if="item.trang_thai == 2"
                                    class="badge rounded-pill bg-success-subtle text-success px-3 ms-2">
                                    <i class="fa-solid fa-circle-check me-1"></i> Đã thanh toán
                                </span>
                                <span v-else-if="item.trang_thai == 1"
                                    class="badge rounded-pill bg-warning-subtle text-warning px-3 ms-2">
                                    <i class="fa-solid fa-clock me-1"></i> Chưa thanh toán
                                </span>
                                <!-- Đã thêm dấu X cho trạng thái hủy -->
                                <span v-else class="badge rounded-pill bg-danger-subtle text-danger px-3 ms-2">
                                    <i class="fa-solid fa-circle-xmark me-1"></i> Đã hủy
                                </span>
                            </div>

                            <div class="tour-info mt-3">
                                <div class="mb-2 text-muted">
                                    <i class="fa-solid fa-calendar-check me-2"></i>
                                    Đặt ngày: <span class="fw-medium text-dark">{{ formatDate(item.ngay_dat) }}</span>
                                </div>
                                <div class="text-muted">
                                    <i class="fa-solid fa-plane-departure me-2"></i>
                                    Khởi hành: <span class="fw-medium text-dark">{{ formatDate(item.tour.ngay_bat_dau) }} - {{ formatDate(item.tour.ngay_ket_thuc) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-3 p-4 text-center">
                            <div class="price-section mb-3">
                                <span class="small text-muted text-uppercase d-block mb-1 fw-bold">Tổng cộng</span>
                                <h3 class="fw-bold text-primary mb-0">{{ formatVND(item.tong_tien) }}</h3>
                            </div>
                            <button @click="xemChiTiet(item)"
                                class="btn btn-primary px-4 py-2 w-100 rounded-pill shadow-sm fw-bold">
                                Xem chi tiết <i class="fa-solid fa-chevron-right ms-2 small"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-5 bg-light rounded-4 border-dashed">
            <i class="fa-solid fa-folder-open fs-1 text-muted mb-3"></i>
            <h4 class="text-secondary">Bạn chưa có chuyến đi nào.</h4>
            <router-link to="/" class="btn btn-primary mt-3 px-4">Khám phá tour ngay</router-link>
        </div>

        <div style="height: 70px;"></div>
    </div>
    
    <!-- MODAL CHI TIẾT HÓA ĐƠN -->
    <div v-if="is_show_detail" class="modal-overlay" @click.self="is_show_detail = false">
        <div class="modal-detail-content animate__animated animate__zoomIn">
            <div class="modal-header d-flex justify-content-between align-items-center border-bottom-0">
                <div>
                    <!-- Đã tô màu đỏ mã hóa đơn -->
                    <h4 class="fw-bold mb-0">Chi tiết đơn hàng #<span class="text-danger">{{ chi_tiet.ma_hoa_don }}</span></h4>
                    <small class="text-muted">Đặt ngày: {{ formatDate(chi_tiet.ngay_dat) }}</small>
                </div>
                <button type="button" class="btn-close" @click="is_show_detail = false"></button>
            </div>

            <div class="modal-body">
                <div class="tour-summary-box d-flex align-items-center p-3 mb-4 rounded-3 border">
                    <img :src="getImageUrl(getFirstImage(chi_tiet.tour ? chi_tiet.tour.hinh_anh : null))" class="rounded me-3"
                        style="width: 100px; height: 70px; object-fit: cover;" alt="tour image">
                    <div>
                        <h6 class="fw-bold mb-1">{{ chi_tiet.tour.ten_tour }}</h6>
                        <div class="small text-muted">
                            <i class="fa-solid fa-calendar-days me-1"></i> Khởi hành: <span
                                class="text-primary fw-bold">{{ formatDate(chi_tiet.tour.ngay_bat_dau) }}</span>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-6">
                        <h6 class="fw-bold mb-3"><i class="fa-solid fa-users me-2"></i>Số lượng hành khách</h6>
                        <div class="p-2 border rounded mb-4 bg-light d-flex justify-content-between">
                            {{ chi_tiet.so_luong_nguoi }} người
                        </div>

                        <h6 class="fw-bold mb-3"><i class="fa-solid fa-ticket me-2"></i>Danh sách vé</h6>
                        <div v-if="chi_tiet.ve && chi_tiet.ve.length > 0">
                            <div v-for="(ve, k) in chi_tiet.ve" :key="k"
                                class="p-2 border rounded mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-primary me-2">{{ k + 1 }}</span>
                                </div>
                                <span class="small text-muted font-monospace">{{ ve.ma_ve }}</span>
                            </div>
                        </div>
                        <div v-else class="text-center p-3 border border-dashed rounded text-muted small">
                            Đang cập nhật thông tin vé...
                        </div>
                    </div>

                    <div class="col-6">
                        <h6 class="fw-bold mb-3"><i class="fa-solid fa-credit-card me-2"></i>Thông tin thanh toán</h6>
                        <div class="p-3 border rounded mb-4">
                            <div class="d-flex justify-content-between mb-2 small">
                                <span>Phương thức</span>
                                <span class="fw-bold">
                                    <i class="fa-solid fa-wallet me-1"></i>
                                    {{ chi_tiet.phuong_thuc_thanh_toan || 'Chuyển khoản' }}
                                </span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="small">Trạng thái</span>
                                <span v-if="chi_tiet.trang_thai == 2" class="badge bg-success-subtle text-success px-3"><i class="fa-solid fa-circle-check me-1"></i>Đã thanh toán</span>
                                <span v-else-if="chi_tiet.trang_thai == 1" class="badge bg-warning-subtle text-warning px-3"><i class="fa-solid fa-clock me-1"></i>Chờ thanh toán</span>
                                <!-- Đã thêm dấu X cho trạng thái hủy -->
                                <span v-else class="badge bg-danger-subtle text-danger px-3"><i class="fa-solid fa-circle-xmark me-1"></i>Đã hủy</span>
                            </div>
                        </div>

                        <h6 class="fw-bold mb-3"><i class="fa-solid fa-note-sticky me-2"></i>Ghi chú đơn hàng</h6>
                        <div class="p-3 border rounded bg-light">
                            <div v-if="chi_tiet.ghi_chu" class="small text-dark text-break" style="white-space: pre-line;">
                                {{ chi_tiet.ghi_chu }}
                            </div>
                            <div v-else class="small text-muted italic">
                                Không có ghi chú nào cho đơn hàng này.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-4 mt-3 d-flex justify-content-center">
                    <!-- Bọc trong 1 container giới hạn chiều rộng để không bị quá dài -->
                    <div class="col-lg-12 col-md-12">
                        <!-- Header -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0">
                                <i class="fa-solid fa-star me-2 text-warning"></i>Đánh giá của tôi
                            </h6>
                            <span v-if="review_data_loaded" class="badge bg-success-subtle text-success border border-success-subtle">
                                <i class="fa-solid fa-check me-1"></i>Đã đánh giá
                            </span>
                            <span v-else class="badge bg-light text-muted border">Chưa có đánh giá</span>
                        </div>

                        <!-- Nội dung card -->
                        <div class="review-card p-4 rounded-4 border shadow-sm bg-white">
                            <div v-if="review_data_loaded" class="row align-items-center">
                                <!-- Cột trái: Thông tin khách hàng (Căn giữa icon) -->
                                <div class="col-md-3 col-sm-4 text-center border-md-end mb-3 mb-md-0">
                                    <img :src="review_data_loaded.avatar || 'https://via.placeholder.com/40x40'" 
                                        class="rounded-circle mb-2 shadow-sm border border-2 border-white" 
                                        width="60" height="60" alt="avatar" style="object-fit: cover;">
                                    <div class="fw-bold text-dark">{{ review_data_loaded.ho_va_ten || 'Khách hàng ẩn danh' }}</div>
                                    <small class="text-muted d-block">{{ new Date(review_data_loaded.created_at).toLocaleDateString('vi-VN') }}</small>
                                </div>
                                
                                <!-- Cột phải: Nội dung đánh giá -->
                                <div class="col-md-9 col-sm-8 ps-md-4">
                                    <div class="review-stars-row mb-2 d-flex align-items-center">
                                        <span class="review-stars text-warning me-2" v-html="renderStars(review_data_loaded.sao_danh_gia || 0)"></span>
                                        <span class="review-score fw-bold text-dark">{{ (review_data_loaded.sao_danh_gia || 0).toFixed(1) }} / 5.0</span>
                                    </div>
                                    <div class="text-secondary small fst-italic" style="line-height: 1.7;">
                                        "{{ review_data_loaded.noi_dung || 'Không có nội dung đánh giá.' }}"
                                    </div>
                                </div>
                            </div>
                            
                            <div v-else class="small text-muted text-center py-4">
                                <i class="fa-solid fa-comment-slash fs-4 mb-2 text-secondary"></i><br>
                                Bạn chưa đánh giá tour này. Hãy cho chúng tôi biết cảm nhận của bạn nhé!
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <div class="price-detail">
                    <h6 class="fw-bold mb-3"><i class="fa-solid fa-receipt me-2"></i>Chi tiết giá</h6>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Giá cơ bản</span>
                        <span>{{ formatVND(chi_tiet.tong_tien) }}</span>
                    </div>
                    <div class="d-flex justify-content-between fs-4 fw-bold mt-3 pt-3 border-top">
                        <span>Tổng cộng</span>
                        <span class="text-primary">{{ formatVND(chi_tiet.tong_tien) }}</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer border-top p-4 d-flex justify-content-between align-items-center">
                <button class="btn btn-light px-4 fw-bold shadow-sm" @click="is_show_detail = false">
                    <i class="fa-solid fa-xmark me-2"></i>Đóng
                </button>

                <div class="d-flex gap-2">
                    <button class="btn btn-outline-info px-4 fw-bold shadow-sm" @click="taiHoaDonPDF(chi_tiet)">
                        <i class="fa-solid fa-download me-2"></i>Tải PDF
                    </button>

                    <button v-if="chi_tiet.trang_thai == 2" class="btn btn-rating px-4 fw-bold text-white shadow-sm"
                        @click="danhGiaTour(chi_tiet)">
                        <i class="fa-solid fa-star me-2"></i>Đánh giá tour
                    </button>

                    <!-- NÚT HỦY ĐƠN HÀNG KHI CHƯA THANH TOÁN -->
                    <button v-if="chi_tiet.trang_thai == 1" class="btn btn-outline-danger px-4 fw-bold shadow-sm"
                        @click="huyDonHang(chi_tiet)">
                        <i class="fa-solid fa-trash-can me-2"></i> Hủy đơn
                    </button>

                    <button v-if="chi_tiet.trang_thai == 1" class="btn btn-payment px-4 fw-bold text-white shadow-sm"
                        @click="moModalThanhToan(chi_tiet)">
                        <i class="fa-solid fa-credit-card me-2"></i> Thanh toán ngay
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL ĐÁNH GIÁ -->
    <div v-if="is_show_danh_gia" class="modal-overlay" @click.self="is_show_danh_gia = false">
        <div class="modal-detail-content animate__animated animate__fadeInUp" style="width: 500px;">
            <div class="modal-header border-bottom-0">
                <h4 class="fw-bold mb-0 mb-3 mt-3">Đánh giá dịch vụ</h4>
                <button type="button" class="btn-close" @click="is_show_danh_gia = false"></button>
            </div>
            <div class="modal-body text-center">
                <h5 class="mb-3">{{ chi_tiet.tour.ten_tour }}</h5>
                <div class="star-rating mb-4">
                    <i v-for="star in 5" :key="star" class="fa-star fs-2 cursor-pointer px-1"
                        :class="star <= data_danh_gia.sao_danh_gia ? 'fa-solid text-warning' : 'fa-regular text-secondary'"
                        @click="data_danh_gia.sao_danh_gia = star">
                    </i>
                </div>
                <div class="text-start">
                    <label class="fw-bold mb-2">Chia sẻ trải nghiệm của bạn:</label>
                    <textarea class="form-control" rows="4" v-model="data_danh_gia.noi_dung"
                        placeholder="Tour này có gì tuyệt vời? Hãy chia sẻ cho mọi người cùng biết nhé..."></textarea>
                </div>
            </div>
            <div class="modal-footer border-top-0 p-4">
                <button class="btn btn-secondary px-4 me-3" @click="is_show_danh_gia = false">Hủy bỏ</button>
                <button class="btn btn-warning px-4 fw-bold text-white" @click="guiDanhGia()" :disabled="data_danh_gia.sao_danh_gia === 0">
                    Gửi đánh giá ngay
                </button>
            </div>
        </div>
    </div>

    <div class="printable-invoice">
        <div class="invoice-print-card">
            <div class="invoice-print-header">
                <div>
                    <h3 class="fw-bold mb-1">HÓA ĐƠN DU LỊCH</h3>
                    <p class="mb-0 text-muted">Mã hóa đơn: #{{ chi_tiet.ma_hoa_don || chi_tiet.id_hoa_don || '---' }}</p>
                </div>
                <div class="text-end">
                    <span class="invoice-status-badge">{{ getStatusLabel(chi_tiet.trang_thai) }}</span>
                </div>
            </div>

            <div class="invoice-print-body">
                <div class="row g-3">
                    <div class="col-6">
                        <p class="mb-1 text-muted small">Khách hàng</p>
                        <p class="fw-bold mb-0">{{ chi_tiet.ten_khach_hang || 'Khách hàng Ixtal Tour' }}</p>
                    </div>
                    <div class="col-6">
                        <p class="mb-1 text-muted small">Ngày đặt</p>
                        <p class="fw-bold mb-0">{{ chi_tiet.ngay_dat || '---' }}</p>
                    </div>
                    <div class="col-12">
                        <p class="mb-1 text-muted small">Tour</p>
                        <p class="fw-bold mb-0">{{ chi_tiet.tour ? chi_tiet.tour.ten_tour : '---' }}</p>
                    </div>
                    <div class="col-6">
                        <p class="mb-1 text-muted small">Số lượng khách</p>
                        <p class="fw-bold mb-0">{{ chi_tiet.so_luong_nguoi || 0 }} người</p>
                    </div>
                    <div class="col-6">
                        <p class="mb-1 text-muted small">Phương thức thanh toán</p>
                        <p class="fw-bold mb-0">{{ chi_tiet.phuong_thuc_thanh_toan || 'Chuyển khoản' }}</p>
                    </div>
                </div>

                <hr>

                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Giá trị đơn hàng</span>
                    <span>{{ formatVND(chi_tiet.tong_tien) }}</span>
                </div>
                <div class="d-flex justify-content-between fs-5 fw-bold mt-3 pt-3 border-top">
                    <span>Tổng cộng</span>
                    <span class="text-primary">{{ formatVND(chi_tiet.tong_tien) }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- BẢNG CHỌN PHƯƠNG THỨC THANH TOÁN (DRAWER MỚI) -->
    <div v-if="is_show_payment_modal" class="modal-payment-drawer" @click.self="is_show_payment_modal = false">
        <div class="drawer-content animate__animated animate__slideInRight">
            <div class="drawer-header bg-white">
                <h5 class="fw-bold mb-0 text-dark">PHƯƠNG THỨC THANH TOÁN</h5>
                <button type="button" class="btn-close" @click="is_show_payment_modal = false"></button>
            </div>

            <div class="drawer-body">
                <p class="text-muted small mb-4">Vui lòng chọn phương thức thanh toán phù hợp cho đơn hàng của bạn.</p>
                
                <div class="payment-item" :class="{ 'active': method === 1 }" @click="method = 1">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <div class="icon-box me-3"><i class="fa-solid fa-wallet"></i></div>
                            <span class="fw-bold">Ví điện tử (VNPAY / MoMo)</span>
                        </div>
                        <i v-if="method === 1" class="fa-solid fa-circle-check text-primary fs-5"></i>
                    </div>
                    
                    <div v-if="method === 1" class="method-details mt-3 pt-3 border-top">
                        <div class="d-flex gap-4 ms-4">
                            <div class="form-check d-flex align-items-center p-0 m-0">
                                <input class="form-check-input mt-0 me-2" type="radio" name="walletRadio" id="radioVnpay2" value="vnpay" v-model="selectedWallet" style="cursor: pointer;">
                                <label class="form-check-label bg-white border p-2 rounded-3 shadow-sm" for="radioVnpay2" style="cursor: pointer;" :class="{'border-primary': selectedWallet === 'vnpay'}">
                                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" height="30" alt="VNPAY">
                                </label>
                            </div>
                            <div class="form-check d-flex align-items-center p-0 m-0 ms-3">
                                <input class="form-check-input mt-0 me-2" type="radio" name="walletRadio" id="radioMomo2" value="momo" v-model="selectedWallet" style="cursor: pointer;">
                                <label class="form-check-label bg-white border p-2 rounded-3 shadow-sm" for="radioMomo2" style="cursor: pointer;" :class="{'border-primary': selectedWallet === 'momo'}">
                                    <img src="https://homepage.momocdn.net/img/logo-momo.png" height="30" alt="MoMo">
                                </label>
                            </div>
                        </div>
                        <div class="alert alert-info mt-3 mb-0 py-2 small">
                            <i class="fa-solid fa-circle-info me-1"></i> Bạn sẽ được chuyển hướng sang cổng thanh toán an toàn.
                        </div>
                    </div>
                </div>

                <div class="payment-item mt-3" :class="{ 'active': method === 2 }" @click="method = 2">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <div class="icon-box me-3"><i class="fa-solid fa-qrcode"></i></div>
                            <span class="fw-bold">Chuyển khoản Ngân hàng</span>
                        </div>
                        <i v-if="method === 2" class="fa-solid fa-circle-check text-primary fs-5"></i>
                    </div>
                    <div v-if="method === 2" class="method-details mt-3 pt-3 border-top text-center">
                        <p class="small text-muted mb-3">Mở ứng dụng ngân hàng và quét mã QR bên dưới để thanh toán.</p>
                        <img v-if="payment_hoa_don && payment_hoa_don.thanh_toan && payment_hoa_don.thanh_toan.link_qr_code" 
                             :src="payment_hoa_don.thanh_toan.link_qr_code" alt="QR Code"
                            style="width: 220px; height: 220px; object-fit: contain; border-radius: 10px;"
                            class="shadow-sm border p-2 bg-white">
                        <p class="text-danger small mt-2" v-else>Đang tạo mã QR, vui lòng đợi...</p>
                    </div>
                </div>
            </div>

            <div class="drawer-footer">
                <div class="d-flex justify-content-between mb-3 align-items-end">
                    <span class="text-secondary fw-semibold">Tổng thanh toán:</span>
                    <span class="fw-bold text-danger fs-3">{{ formatVND(payment_hoa_don?.tong_tien) }}</span>
                </div>
                
                <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center fs-6" 
                        @click="xacNhanThanhToanLai" 
                        :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN THANH TOÁN' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import apiUrl from '../../../utils/api'

export default {
    data() {
        return {
            is_show_detail: false,
            chi_tiet: { tour: {}, ve: [] },
            ds_hoa_don: [],
            isLoading: true,
            
            is_show_danh_gia: false,
            data_danh_gia: {
                id_tour: null,
                sao_danh_gia: 0,
                noi_dung: ''
            },
            
            is_show_payment_modal: false,
            method: 1, 
            selectedWallet: 'vnpay',
            payment_hoa_don: null,
            filter_status: 'all',
            review_data_loaded: null
        }
    },
    mounted() {
        this.getLichSu();
    },
    methods: {
        // Thay thế hàm formatDate cũ bằng hàm này
        formatDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            
            // Lấy ngày, tháng, năm và thêm số 0 ở trước nếu nhỏ hơn 10
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            
            // Kiểm tra xem dữ liệu truyền vào có chứa giờ giấc không (thường chứa chữ 'T' hoặc dấu ':')
            if (dateStr.includes('T') || dateStr.includes(':')) {
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                
                // Trả về định dạng: Giờ:Phút - Ngày/Tháng/Năm (Dành cho thời gian đặt tour)
                return `${hours}:${minutes} - ${day}/${month}/${year}`;
            }
            
            // Trả về định dạng: Ngày/Tháng/Năm (Dành cho ngày khởi hành/kết thúc tour)
            return `${day}/${month}/${year}`;
        },
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
        danhGiaTour(item) {
            this.is_show_detail = false; 
            this.is_show_danh_gia = true; 
            this.data_danh_gia.id_tour = item.tour.id_tour; 
            this.data_danh_gia.sao_danh_gia = 0;
            this.data_danh_gia.noi_dung = '';
        },
        guiDanhGia() {
            axios.post(apiUrl('/client/danh-gia/gui-danh-gia'), this.data_danh_gia, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
            })
            .then((res) => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.is_show_danh_gia = false;
                    
                    // Tải lại dữ liệu đánh giá vừa gửi
                    this.$nextTick(() => {
                        if (this.chi_tiet && this.chi_tiet.tour && this.chi_tiet.tour.id_tour) {
                            this.loadReviewData(this.chi_tiet.tour.id_tour);
                        }
                    });
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch((err) => {
                this.$toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            });
        },
        
        moModalThanhToan(item) {
            this.is_show_detail = false; 
            this.payment_hoa_don = item; 
            this.method = 1;             
            this.selectedWallet = 'vnpay';
            this.is_show_payment_modal = true; 
        },

        getFilteredHoaDon() {
            if (!this.ds_hoa_don) return [];
            switch (this.filter_status) {
                case 'paid':
                    return this.ds_hoa_don.filter(item => item.trang_thai == 2);
                case 'pending':
                    return this.ds_hoa_don.filter(item => item.trang_thai == 1);
                case 'cancelled':
                    return this.ds_hoa_don.filter(item => item.trang_thai != 1 && item.trang_thai != 2);
                default:
                    return this.ds_hoa_don;
            }
        },
        getStatusLabel(status) {
            if (status == 2) return 'Đã thanh toán';
            if (status == 1) return 'Chờ thanh toán';
            return 'Đã hủy';
        },
        getReviewData(item) {
            if (this.review_data_loaded) {
                return this.review_data_loaded;
            }
            if (!item) return null;
            return item.danh_gia || item.danhGia || item.review || item.review_info || null;
        },
        loadReviewData(tour_id) {
            this.review_data_loaded = null;
            
            if (!tour_id) return;
            
            // Gọi API để lấy dữ liệu đánh giá của khách hàng hiện tại
            axios.get(apiUrl('/client/danh-gia/get-danh-gia-cua-toi/' + tour_id), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
            })
            .then(res => {
                if (res.data.status && res.data.data) {
                    this.review_data_loaded = res.data.data;
                } else {
                    this.review_data_loaded = null;
                }
            })
            .catch(err => {
                console.log('Không có đánh giá của bạn cho tour này');
                this.review_data_loaded = null;
            });
        },
        renderStars(rating) {
            const score = Number(rating || 0);
            const fullStars = Math.floor(score);
            const hasHalfStar = score - fullStars >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            let html = '';

            for (let i = 0; i < fullStars; i++) {
                html += '<i class="fa-solid fa-star"></i>';
            }

            if (hasHalfStar) {
                html += '<i class="fa-solid fa-star-half-stroke"></i>';
            }

            for (let i = 0; i < emptyStars; i++) {
                html += '<i class="fa-regular fa-star"></i>';
            }

            return html;
        },
        taiHoaDonPDF(item) {
            this.chi_tiet = item || this.chi_tiet;
            this.$nextTick(() => {
                window.print();
            });
        },

        xacNhanThanhToanLai() {
            const item = this.payment_hoa_don;
            this.isLoading = true;

            if (this.method === 1) { 
                if(this.selectedWallet === 'momo') {
                    this.$toast.info("Tính năng thanh toán MoMo đang được bảo trì. Vui lòng chọn VNPay!");
                    this.isLoading = false;
                    return;
                }

                const idGuiDi = item.id || item.id_hoa_don || item.ma_hoa_don;
                axios.post(apiUrl('/client/vnpay/tao-thanh-toan'), {
                    id_hoa_don: idGuiDi
                }, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
                })
                .then(response => {
                    if (response.data.status) {
                        this.$toast.success("Đang kết nối cổng thanh toán VNPAY...");
                        window.location.href = response.data.data;
                    } else {
                        this.$toast.error(response.data.message || 'Không thể tạo liên kết thanh toán.');
                        this.isLoading = false;
                    }
                })
                .catch(error => {
                    this.$toast.error('Không thể kết nối cổng thanh toán. Vui lòng thử lại sau!');
                    this.isLoading = false;
                });
            } else if (this.method === 2) { 
                setTimeout(() => {
                    this.isLoading = false;
                    this.is_show_payment_modal = false;
                    this.$router.push({
                        path: '/Ket-qua-thanh-toan',
                        query: {
                            method: 'bank_transfer',
                            amount: item.tong_tien,
                            txnRef: 'HDTOUR' + item.id 
                        }
                    });
                }, 800); 
            }
        },

        // CHỨC NĂNG HỦY ĐƠN HÀNG
        huyDonHang(item) {
            if(confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.')) {
                axios.post(apiUrl('client/hoa-don/huy'), { 
                    ma_hoa_don: item.ma_hoa_don 
                }, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
                })
                .then(res => {
                    if(res.data.status) {
                        this.$toast.success(res.data.message);
                        this.is_show_detail = false; // Đóng modal
                        this.getLichSu(); // Tải lại danh sách cập nhật trạng thái
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(err => {
                    this.$toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
                });
            }
        },

        xemChiTiet(item) {
            this.chi_tiet = item;
            this.review_data_loaded = null;
            this.is_show_detail = true;
            if (item && item.tour && item.tour.id_tour) {
                this.$nextTick(() => {
                    this.loadReviewData(item.tour.id_tour);
                });
            }
        },
        getLichSu() {
            this.isLoading = true;
            axios.get(apiUrl('client/hoa-don/danh-sach'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
            })
            .then((res) => {
                this.ds_hoa_don = res.data.data.map(hd => {
                    if (hd.tour && hd.tour.hinh_anh) {
                        // 1. Chuyển thành mảng
                        let arrAnh = [];
                        if (typeof hd.tour.hinh_anh === 'string') {
                            try {
                                arrAnh = JSON.parse(hd.tour.hinh_anh);
                            } catch(e) {
                                arrAnh = [hd.tour.hinh_anh];
                            }
                        } else if (Array.isArray(hd.tour.hinh_anh)) {
                            arrAnh = hd.tour.hinh_anh;
                        }
                        
                        // 2. Làm sạch link (xóa đuôi size)
                        hd.tour.hinh_anh = arrAnh.map(url => url.replace(/-\d+x\d+/g, ''));
                    }
                    return hd;
                });
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                this.isLoading = false; // Nên thêm finally để tắt loading
            });
        },
        formatVND(value) {
            if (!value) return "0 ₫";
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    }
}
</script>

<style scoped>
.btn-light { background-color: #f8f9fa; border: 1px solid #dee2e6; color: #6c757d; }
.btn-light:hover { background-color: #e2e6ea; color: #343a40; }
.btn-rating { background: linear-gradient(45deg, #ff9800, #ffc107); border: none; transition: all 0.3s ease; }
.btn-rating:hover { background: linear-gradient(45deg, #f57c00, #ff9800); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3) !important; }
.btn-payment { background: linear-gradient(45deg, #d32f2f, #f44336); border: none; transition: all 0.3s ease; }
.btn-payment:hover { background: linear-gradient(45deg, #b71c1c, #d32f2f); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3) !important; }
.btn-outline-info { border: 2px solid #0dcaf0; color: #0dcaf0; background-color: transparent; }
.btn-outline-info:hover { background-color: #0dcaf0; color: white; }
.btn-outline-danger { border: 2px solid #dc3545; color: #dc3545; background-color: transparent; transition: all 0.3s ease; }
.btn-outline-danger:hover { background-color: #dc3545; color: white; }

.modal-footer button { border-radius: 14px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; }
.btn-close { border-radius: 50% !important; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background-color: #f0f2f5 !important; transition: all 0.3s ease; }
.btn-close:hover { background-color: #e9ecef !important; transform: rotate(90deg); }
.modal-header { padding: 24px 28px; background: linear-gradient(135deg, #f8fbff, #eef7ff); border-bottom: 1px solid #e1f0ff; }
.modal-header h4 { font-size: 1.4rem; letter-spacing: -0.5px; }
.modal-body { padding: 28px; }
.modal-footer { padding: 20px 28px; background: #f8f9fa; }
.tour-card { transition: transform 0.2s, box-shadow 0.2s; border-radius: 16px !important; overflow: hidden; }
.tour-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important; }
.tour-img { object-fit: cover; min-height: 200px; width: 100%; }
.badge { font-size: 0.85rem; font-weight: 600; letter-spacing: 1px;}
.btn-primary { background-color: #005baa; border: none; transition: all 0.3s ease; }
.btn-primary:hover { background-color: #004a8d; transform: scale(1.02); }
.cursor-pointer { cursor: pointer; }
.star-rating i { transition: transform 0.2s ease-in-out; }
.star-rating i:hover { transform: scale(1.2); }
.border-dashed { border: 2px dashed #dee2e6 !important; }
.text-primary { color: #005baa !important; }

.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center;
    align-items: center; z-index: 1050;
}
.modal-detail-content {
    background: white; width: 750px; max-width: 90vw; border-radius: 24px;
    max-height: 90vh; overflow-y: auto; overflow-x: hidden; padding: 0; animation-duration: 0.4s;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.tour-summary-box { background-color: #f8fbff; border-color: #e1f0ff !important; border-width: 2px; }
.tour-summary-box h6 { font-size: 1.05rem; font-weight: 600; letter-spacing: -0.3px; }
.bg-success-subtle { background-color: #d1e7dd !important; }
.bg-warning-subtle { background-color: #fff3cd !important; }
.bg-danger-subtle { background-color: #f8d7da !important; color: #dc3545 !important; }
.price-detail { margin-top: 20px; }
.price-detail h6 { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px; margin-bottom: 18px; }
.price-detail .d-flex { font-size: 0.95rem; font-weight: 500; color: #495057; }
.price-detail .fs-4 { font-size: 1.35rem !important; }

/* FILTER */
.filter-bar {
    padding: 10px;
    border-radius: 50px;
    display: inline-flex;
    margin: 0 auto;
}

.filter-pill {
    padding: 10px 22px;
    border-radius: 40px;
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.9rem;
    color: #64748b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.filter-pill:hover {
    background: #e2e8f0;
    color: #1e293b;
}

/* Hiệu ứng Active cho từng loại */
.filter-pill.active {
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Màu riêng cho từng trạng thái khi Active */
.filter-pill.active.paid { background: linear-gradient(135deg, #10b981, #059669); }
.filter-pill.active.pending { background: linear-gradient(135deg, #f59e0b, #d97706); }
.filter-pill.active.cancelled { background: linear-gradient(135deg, #ef4444, #dc2626); }
.filter-pill.active:not(.paid):not(.pending):not(.cancelled) { background: #125633; }

.review-card {
    background: linear-gradient(135deg, #fffaf0, #fff8e1); border-color: #ffe7b3 !important; border-width: 2px;
}
.review-card h6 { font-size: 1.1rem; letter-spacing: -0.3px; }
.review-card .fw-bold { color: #1a1a1a; }
.review-stars-row {
    display: flex; align-items: center; gap: 8px;
}
.review-stars {
    color: #fbbf24; font-size: 0.9rem; letter-spacing: 1px;
}
.review-score {
    font-size: 0.8rem; color: #b45309; font-weight: 600;
}
.invoice-card {
    background: linear-gradient(135deg, #f8fbff, #eef7ff); border-color: #dcefff !important; border-width: 2px;
}
.invoice-card h6 { font-size: 1.05rem; font-weight: 600; letter-spacing: -0.3px; }
.printable-invoice {
    display: none;
}
.invoice-print-card {
    background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; max-width: 760px; margin: 0 auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}
.invoice-print-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;
}
.invoice-status-badge {
    background: #005baa; color: white; padding: 8px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.5px;
}

/* DRAWER STYLE */
.modal-payment-drawer {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; justify-content: flex-end;
}
.drawer-content { background: white; width: 450px; height: 100%; display: flex; flex-direction: column; box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2); }
.drawer-header { padding: 20px 25px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.drawer-body { padding: 25px; flex: 1; overflow-y: auto; background-color: #fdfdfd; }
.drawer-footer { padding: 20px 25px; border-top: 1px solid #f0f0f0; background: #ffffff; box-shadow: 0 -4px 15px rgba(0,0,0,0.03); }
.payment-item { border: 2px solid #eef0f2; border-radius: 12px; padding: 18px; cursor: pointer; background-color: #fff; transition: all 0.2s ease; }
.payment-item:hover { border-color: #d1d5db; }
.payment-item.active { border-color: #005baa; background-color: #f8fbff; box-shadow: 0 4px 15px rgba(0, 91, 186, 0.1); }
.icon-box { width: 45px; height: 45px; background: #f0f2f5; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #6c757d; transition: all 0.2s ease; }
.payment-item.active .icon-box { background: #005baa; color: white; }
.form-check-input { width: 1.3em; height: 1.3em; }
.form-check-input:checked { background-color: #005baa; border-color: #005baa; }
.review-card {
    transition: all 0.3s ease;
    background: #fff;
}
.review-card:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
}

/* Hiệu ứng cho sao */
.review-stars {
    font-size: 1rem;
    letter-spacing: 2px;
}

/* Đảm bảo hình ảnh tròn đẹp */
.rounded-circle {
    box-shadow: 0 0 0 4px #f8f9fa;
}

/* Căn lề giữa cho responsive */
@media (max-width: 768px) {
    .border-md-end {
        border-right: none !important;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
    }
}
</style>