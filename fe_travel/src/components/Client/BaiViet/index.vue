<template>
    <div style="background-color: #F2F7FA; min-height: 100vh; padding-bottom: 50px;">
        
        <div class="page-header text-center text-white mb-5">
            <h1 class="display-4 fw-bold mt-5">Bài Viết</h1>
            
        </div>

        <div class="container">
            <div v-if="isLoading" class="text-center py-2">
                <div class="spinner-border" style="color: #005baa;" role="status"></div>
                <p class="mt-2 text-muted">Đang tải danh sách bài viết...</p>
            </div>

            <div v-else-if="list_bv.length === 0" class="alert bg-white shadow-sm border-0 text-center py-5 rounded-4">
                <i class="bi bi-journal-x fs-1 text-muted"></i>
                <h5 class="mt-3 fw-bold">Chưa có bài viết nào</h5>
                <p class="text-muted">Hệ thống đang cập nhật tin tức, bạn quay lại sau nhé.</p>
            </div>

            <div class="row" v-else>
                
                <div class="col-lg-6">
                    <div class="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden bai-viet-card">
                        <router-link :to="`/client/chi-tiet-bai-viet/${list_bv[0].id}`" class="text-decoration-none text-dark">
                            <img :src="list_bv[0].hinh_anh" class="card-img-top w-100" style="height: 380px; object-fit: cover;" :alt="list_bv[0].tieu_de">
                            <div class="card-body p-4">
                                <span class="badge mb-2" style="background-color: #e74c3c;">Tiêu điểm</span>
                                <h4 class="card-title fw-bold mb-3" style="line-height: 1.4;">{{ list_bv[0].tieu_de }}</h4>
                                <p class="card-text text-secondary text-truncate-3" style="font-size: 0.95rem; line-height: 1.6;">
                                    {{ list_bv[0].mo_ta_ngan }}
                                </p>
                                <small class="text-muted"><i class="fa-regular fa-clock me-1"></i> {{ formatDate(list_bv[0].created_at) }}</small>
                            </div>
                        </router-link>
                    </div>

                    <h5 class="fw-bold border-start border-4 ps-2 mb-3" style="border-color: #005baa !important; color: #125633;">Tin Tức Khác</h5>
                    <hr class="text-muted">

                    <div class="row" v-if="list_bv.length > 1">
                        <template v-for="(v, k) in list_bv.slice(1, 3)" :key="k">
                            <div class="col-lg-6 mb-4">
                                <router-link :to="`/client/chi-tiet-bai-viet/${v.id}`" class="text-decoration-none text-dark h-100 d-block">
                                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bai-viet-card">
                                        <img :src="v.hinh_anh" class="card-img-top w-100" style="height: 180px; object-fit: cover;" :alt="v.tieu_de">
                                        <div class="card-body p-3">
                                            <h6 class="card-title fw-bold text-truncate-2" style="line-height: 1.4;">{{ v.tieu_de }}</h6>
                                            <p class="card-text small text-secondary text-truncate-2 mb-2 mt-2">
                                                {{ v.mo_ta_ngan }}
                                            </p>
                                            <small class="text-muted" style="font-size: 0.75rem;"><i class="fa-regular fa-clock me-1"></i> {{ formatDate(v.created_at) }}</small>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card p-4 shadow-sm h-100 border-0 rounded-4 bg-white">
                        <h5 class="fw-bold mb-4" style="color: #125633;">Có Thể Bạn Quan Tâm</h5>

                        <div v-if="list_bv.length <= 3" class="text-muted small text-center mt-3">
                            Chưa có thêm bài viết nào.
                        </div>

                        <template v-for="(v, k) in list_bv.slice(3)" :key="k">
                            <div class="card mb-3 border-0 bg-transparent article-list-item">
                                <router-link :to="`/client/chi-tiet-bai-viet/${v.id}`" class="text-decoration-none text-dark">
                                    <div class="row g-3 align-items-center">
                                        <div class="col-4">
                                            <div class="overflow-hidden rounded-3">
                                                <img :src="v.hinh_anh" class="img-fluid w-100" style="height: 110px; object-fit: cover; transition: transform 0.3s;" :alt="v.tieu_de">
                                            </div>
                                        </div>
                                        <div class="col-8">
                                            <div class="card-body p-0 ps-1">
                                                <h6 class="card-title fw-bold text-truncate-2 mb-2" style="line-height: 1.3; font-size: 0.95rem;">{{ v.tieu_de }}</h6>
                                                <p class="card-text small text-secondary text-truncate-2 mb-2">
                                                    {{ v.mo_ta_ngan }}
                                                </p>
                                                <small class="text-muted" style="font-size: 0.75rem;">
                                                    <i class="fa-regular fa-clock me-1"></i> {{ formatDate(v.created_at) }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                            <hr class="my-2 text-muted opacity-25" v-if="k < list_bv.slice(3).length - 1">
                        </template>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api' // Nhớ check kỹ đường dẫn này

export default {
    data() {
        return {
            isLoading: true,
            list_bv: [],
        }
    },
    mounted() {
        this.loadBaiViet();
    },
    methods: {
        async loadBaiViet() {
            this.isLoading = true;
            try {
                // Gọi API lấy dữ liệu trang chủ (API này Public không cần gửi token)
                const res = await axios.get(apiUrl('/client/trang-chu/get-data'));
                
                if (res.data.status) {
                    // FIX LỖI Ở ĐÂY: Trong TrangChuController bạn trả về 'baiViets', không phải 'data_bv'
                    this.list_bv = res.data.data.baiViets || [];
                }
            } catch (err) {
                console.error("Lỗi tải bài viết:", err);
            } finally {
                this.isLoading = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
    }
}
</script>

<style scoped>
/* CSS hỗ trợ cắt chữ nếu quá dài thêm dấu ... */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Hiệu ứng hover cho card bài viết to & vừa */
.bai-viet-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bai-viet-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}

/* Hiệu ứng hover cho list bài viết nhỏ bên phải */
.article-list-item {
    transition: all 0.2s ease;
}
.article-list-item:hover h6 {
    color: #005baa;
}
.article-list-item:hover img {
    transform: scale(1.05);
}
</style>