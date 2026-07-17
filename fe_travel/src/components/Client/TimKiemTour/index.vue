<template>
    <div class="container py-5 mt-4">
        <div class="row mb-4">
            <div class="col-12 text-center">
                <h2 class="fw-bold text-dark mb-3">Kết Quả Tìm Kiếm</h2>
                <p class="text-secondary fs-5">
                    Tìm thấy <b class="text-danger">{{ ds_tour.length }}</b> tour phù hợp với từ khóa "<b class="text-primary">{{ tuKhoa }}</b>"
                </p>
            </div>
        </div>

        <!-- Trạng thái loading -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <!-- Danh sách Tour -->
        <div v-else-if="ds_tour.length > 0" class="row g-4">
            <div v-for="(tour, index) in ds_tour" :key="index" class="col-lg-3 col-md-6 col-sm-12">
                <div class="card h-100 shadow-sm border-0 rounded-4 tour-card overflow-hidden cursor-pointer" @click="xemChiTiet(tour.id)">
                    <!-- Hình ảnh -->
                    <div class="position-relative">
                        <img :src="getImageUrl(getFirstImage(tour.hinh_anh))" class="card-img-top tour-image" alt="Tour Image" style="height: 220px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 rounded-start-pill mt-3 fw-bold shadow">
                            Hot
                        </div>
                    </div>
                    
                    <!-- Nội dung -->
                    <div class="card-body d-flex flex-column">
                        
                        <!-- CHỈNH SỬA GIAO DIỆN BÊN TRÁI BÊN PHẢI -->
                        <div class="d-flex justify-content-between align-items-start mb-2 gap-2" style="font-size:15px">
                            <!-- Điểm đón bên trái, cho phép rớt dòng -->
                            <span class="badge bg-primary-subtle text-primary px-2 py-1 rounded-pill text-wrap text-start" style="line-height: 1.4;">
                                <i class="fa-solid fa-map-location-dot me-1"></i> {{ tour.diem_don }}
                            </span>
                            
                            <!-- Đánh giá bên phải, không bị bóp méo -->
                            <div class="text-warning small fw-bold flex-shrink-0 text-end mt-1">
                                <i class="fa-solid fa-star"></i> {{ tour.avg_sao ? Number(tour.avg_sao).toFixed(1) : '5.0' }} 
                                <span class="text-muted fw-normal">({{ tour.so_luot_danh_gia }} đánh giá)</span>
                            </div>
                        </div>

                        <h5 class="card-title fw-bold text-dark mb-3 tour-title" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            {{ tour.ten_tour }}
                        </h5>
                        
                        <div class="mt-auto">
                            <div class="d-flex align-items-center text-muted small mb-3">
                                <i class="fa-regular fa-clock me-2"></i> Khởi hành: {{ formatDate(tour.ngay_bat_dau) }}
                            </div>
                            <div class="d-flex justify-content-between align-items-end pt-3 border-top">
                                <div>
                                    <p class="text-muted small mb-0">Giá chỉ từ</p>
                                    <h4 class="text-danger fw-bold mb-0">{{ formatVND(tour.gia) }}</h4>
                                </div>
                                <button class="btn btn-primary rounded-circle shadow-sm" style="width: 40px; height: 40px;">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Trạng thái trống (Không tìm thấy) -->
        <div v-else class="text-center py-5 bg-light rounded-4 border-dashed mt-4">
            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Not found" width="120" class="mb-3 opacity-50">
            <h4 class="text-secondary fw-bold">Ôi không! Không tìm thấy tour nào.</h4>
            <p class="text-muted">Vui lòng thử lại với từ khóa khác (ví dụ: Sapa, Đà Lạt, Biển...)</p>
            <button @click="$router.push('/')" class="btn btn-outline-primary px-4 py-2 mt-2 rounded-pill fw-bold">
                <i class="fa-solid fa-rotate-left me-2"></i> Quay lại trang chủ
            </button>
        </div>
        
        <div class="pb-5 mb-5"></div>
    </div>
</template>

<script>
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
    name: "TimKiemTour",
    data() {
        return {
            tuKhoa: "",
            ds_tour: [],
            isLoading: false
        };
    },
    mounted() {
        this.tuKhoa = this.$route.query.keyword || "";
        if (this.tuKhoa) {
            this.layDuLieuTimKiem();
        }
    },
    watch: {
        '$route.query.keyword': function (newKeyword) {
            this.tuKhoa = newKeyword || "";
            if (this.tuKhoa) {
                this.layDuLieuTimKiem();
            } else {
                this.ds_tour = [];
            }
        }
    },
    methods: {
        getFirstImage(hinh_anh) {
            if (!hinh_anh) return 'https://via.placeholder.com/400x300?text=No+Image';
            if (Array.isArray(hinh_anh)) {
                return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/400x300';
            }
            try {
                let parsed = JSON.parse(hinh_anh);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                return hinh_anh;
            }
        },
        
        getImageUrl(url) {
            if (!url) return 'https://via.placeholder.com/400x300';
            if (url.startsWith('http') || url.startsWith('data:')) return url;
            
            // Xóa các hậu tố kích thước ảnh bị cắt nhỏ (nếu có)
            url = url.replace(/-\d+x\d+/g, '');
            
            // Lấy base domain từ hàm apiUrl (có sẵn trong file)
            const baseApiUrl = apiUrl('');
            const backendDomain = baseApiUrl.replace(/\/api\/?$/, '');
            return backendDomain + (url.startsWith('/') ? '' : '/') + url;
        },
        layDuLieuTimKiem() {
            this.isLoading = true;
            // API NÀY GIỜ ĐÃ NẰM NGOÀI PUBLIC, KHÔNG CẦN TOKEN
            axios.post(apiUrl("client/tour/search"), { tu_khoa: this.tuKhoa })
                .then((res) => {
                    if (res.data.status) {
                        this.ds_tour = res.data.data;
                    }
                })
                .catch((err) => {
                    console.error("Lỗi tìm kiếm:", err);
                    this.$toast.error("Có lỗi xảy ra khi tìm kiếm");
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        formatVND(value) {
            if (!value) return "0 ₫";
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
        },
        // KHÔNG SỬ DỤNG MOMENT.JS
        formatDate(dateStr) {
            if (!dateStr) return "Đang cập nhật";
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        xemChiTiet(id) {
            this.$router.push(`/client/chi-tiet-tour/${id}`);
        }
    }
};
</script>

<style scoped>
.tour-card { transition: all 0.3s ease; }
.tour-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
.tour-image { transition: all 0.5s ease; }
.tour-card:hover .tour-image { transform: scale(1.05); }
.tour-title:hover { color: #005baa !important; }
.cursor-pointer { cursor: pointer; }
.border-dashed { border: 2px dashed #dee2e6; }
</style>