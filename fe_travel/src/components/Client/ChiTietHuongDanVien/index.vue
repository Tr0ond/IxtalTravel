<template>
  <div style="background-color: #F8F9FA; min-height: 100vh; padding-bottom: 60px;">
    <div class="bg-dark" style="height: 100px;"></div>

    <div class="container" style="margin-top: -50px; position: relative; z-index: 10;">
        <div v-if="isLoading" class="text-center py-5 bg-white rounded-4 shadow-sm">
            <div class="spinner-border" style="color: #005baa;" role="status"></div>
            <p class="mt-2 text-muted">Đang tải hồ sơ hướng dẫn viên...</p>
        </div>

        <div v-else-if="!hdv" class="alert alert-danger shadow-sm rounded-4 text-center py-5">
            <i class="fa-solid fa-user-slash fs-1 mb-3"></i>
            <h4>Không tìm thấy thông tin Hướng dẫn viên</h4>
            <button @click="$router.push('/client/huong-dan-vien')" class="btn btn-outline-danger mt-3 rounded-pill">Quay lại danh sách</button>
        </div>

        <div v-else>
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
                <div class="row g-0">
                    <div class="col-md-4 text-center p-5 text-white position-relative" style="background: linear-gradient(135deg, #00004d 0%, #005baa 100%);">
                        <div class="position-absolute top-0 end-0 mt-3 me-3">
                            <i class="fa-solid fa-check-circle text-success fs-4 bg-white rounded-circle" title="Xác thực"></i>
                        </div>
                        
                        <!-- ĐÃ CẬP NHẬT LOGIC AVATAR -->
                        <img :src="hdv.avatar ? hdv.avatar : `https://ui-avatars.com/api/?name=${hdv.ho_va_ten}&background=random&color=fff&size=200&font-size=0.3`" 
                             class="rounded-circle shadow-lg border border-4 border-white mb-4 bg-light" 
                             style="width: 160px; height: 160px; object-fit: cover;">
                             
                        <h3 class="fw-bold mb-1 text-white">{{ hdv.ho_va_ten }}</h3>
                        <p class="text-warning fw-semibold mb-4">Tour Guide Professional</p>
                        
                        <div class="d-flex justify-content-center gap-3">
                            <a :href="`mailto:${hdv.email}`" class="btn btn-light rounded-circle text-primary shadow" style="width: 45px; height: 45px; line-height: 33px;">
                                <i class="fa-solid fa-envelope"></i>
                            </a>
                            <a :href="`tel:${hdv.so_dien_thoai}`" class="btn btn-light rounded-circle text-success shadow" style="width: 45px; height: 45px; line-height: 33px;">
                                <i class="fa-solid fa-phone"></i>
                            </a>
                        </div>
                    </div>

                    <div class="col-md-8 p-5 bg-white">
                        <h4 class="fw-bold text-dark border-bottom pb-3 mb-4">Thông Tin Hồ Sơ</h4>
                        <div class="row g-4 mb-4">
                            <div class="col-sm-6">
                                <div class="d-flex align-items-start">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded p-3 me-3">
                                        <i class="fa-solid fa-at fs-5"></i>
                                    </div>
                                    <div>
                                        <small class="text-muted fw-semibold">Email liên hệ</small>
                                        <div class="text-dark fw-bold">{{ hdv.email }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="d-flex align-items-start">
                                    <div class="bg-success bg-opacity-10 text-success rounded p-3 me-3">
                                        <i class="fa-solid fa-mobile-screen fs-5"></i>
                                    </div>
                                    <div>
                                        <small class="text-muted fw-semibold">Số điện thoại</small>
                                        <div class="text-dark fw-bold">{{ hdv.so_dien_thoai || 'Đang cập nhật' }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="d-flex align-items-start">
                                    <div class="bg-warning bg-opacity-10 text-warning rounded p-3 me-3">
                                        <i class="fa-solid fa-language fs-5"></i>
                                    </div>
                                    <div>
                                        <small class="text-muted fw-semibold">Ngôn ngữ giao tiếp</small>
                                        <div class="mt-1 d-flex gap-2 flex-wrap">
                                            <span v-for="(lang, i) in (hdv.ngon_ngu || '').split(',')" :key="i" class="badge bg-dark text-white px-3 py-2 rounded-pill">
                                                {{ lang.trim() }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-light p-4 rounded-4 border-start border-4 border-warning">
                            <p class="mb-0 fst-italic text-secondary">
                                "Sự tận tâm và am hiểu sâu sắc về văn hóa, lịch sử tại mỗi điểm đến là kim chỉ nam trong nghề của tôi. Rất hân hạnh được đồng hành cùng quý khách."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex align-items-center mb-4 mt-5">
                <h3 class="fw-bold text-dark mb-0 me-3">Các Tour Đang Phụ Trách</h3>
                <span class="badge bg-primary rounded-pill fs-6">{{ tours.length }} Tour</span>
                <div class="flex-grow-1 ms-3" style="height: 2px; background-color: #e9ecef;"></div>
            </div>

            <div v-if="tours.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486831.png" width="100" class="opacity-50 mb-3">
                <h5 class="text-muted fw-semibold">Hướng dẫn viên này hiện chưa được phân công dẫn tour nào.</h5>
            </div>

            <div class="row g-4" v-else>
                <div class="col-12" v-for="(tour, index) in tours" :key="index">
                    <div class="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
                        <div class="row g-0 h-100">
                            <div class="col-md-4 position-relative">
                                <img :src="getImageUrl(getFirstImage(tour.hinh_anh))" alt="Tour Image" class="img-fluid h-100 w-100" style="object-fit: cover; min-height: 250px;">
                                <div class="position-absolute bottom-0 start-0 m-3">
                                    <span class="badge bg-danger px-3 py-2 fs-6 shadow">{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.gia) }}</span>
                                </div>
                            </div>
                            
                            <div class="col-md-8">
                                <div class="card-body p-4 p-md-5 d-flex flex-column h-100">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <h4 class="fw-bold text-dark mb-0">{{ tour.ten_tour }}</h4>
                                        <button class="btn btn-outline-primary btn-sm rounded-pill px-3" @click="$router.push(`/client/chi-tiet-tour/${tour.id}`)">
                                            Xem Tour
                                        </button>
                                    </div>
                                    
                                    <div class="d-flex gap-4 mb-4 mt-2 text-secondary small">
                                        <span><i class="bi bi-calendar-check text-success me-1"></i> {{ formatDate(tour.ngay_bat_dau) }}</span>
                                        <span><i class="bi bi-clock-history text-warning me-1"></i> {{ calculateDays(tour.ngay_bat_dau, tour.ngay_ket_thuc) }} Ngày</span>
                                        <span><i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ tour.diem_tra }}</span>
                                    </div>

                                    <h6 class="fw-bold text-dark mt-3 mb-3 border-bottom pb-2">Lịch trình & Điểm đến nổi bật:</h6>
                                    <div v-if="tour.chi_tiet_lich_trinh && tour.chi_tiet_lich_trinh.length > 0" class="timeline-container">
                                        <div class="timeline-item d-flex mb-3" v-for="(lt, idx) in tour.chi_tiet_lich_trinh" :key="idx">
                                            <div class="timeline-icon mt-1 me-3 text-primary">
                                                <i class="fa-solid fa-location-dot"></i>
                                            </div>
                                            <div class="timeline-content bg-light p-3 rounded-3 flex-grow-1">
                                                <div class="d-flex align-items-center mb-1">
                                                    <img v-if="lt.anh_diem_den" :src="getImageUrl(getFirstImage(lt.anh_diem_den))" class="rounded me-2" width="30" height="30" style="object-fit: cover;">
                                                    <h6 class="fw-bold mb-0 text-dark">{{ lt.ten_diem_den || 'Điểm đến tự do' }}</h6>
                                                </div>
                                                <p class="mb-0 small text-secondary">{{ lt.tieu_de_hoat_dong }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-muted small fst-italic">
                                        Chưa có chi tiết lịch trình cụ thể.
                                    </div>

                                </div>
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
            isLoading: true,
            id_hdv: this.$route.params.id_huong_dan_vien,
            hdv: null,
            tours: []
        }
    },
    mounted() {
        this.fetchChiTietHDV();
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
        async fetchChiTietHDV() {
            try {
                const res = await axios.get(apiUrl(`client/huong-dan-vien/chi-tiet/${this.id_hdv}`));
                if (res.data.status) {
                    this.hdv = res.data.data.thong_tin_hdv;
                    this.tours = res.data.data.danh_sach_tour;
                } else {
                    this.$toast.error(res.data.message);
                }
            } catch (error) {
                console.error(error);
                this.$toast.error("Không thể lấy dữ liệu Hướng dẫn viên");
            } finally {
                this.isLoading = false;
            }
        },
        calculateDays(start, end) {
            if (!start || !end) return 1;
            return Math.ceil(Math.abs(new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1; 
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const d = new Date(dateString);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        },
    }
}
</script>

<style scoped>
.timeline-item {
    position: relative;
}
.timeline-icon {
    font-size: 1.2rem;
}
.timeline-content {
    border-left: 3px solid #005baa;
}
</style>