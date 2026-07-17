<template>
    <div class="container py-4 py-md-5" style="min-height: 100vh;">
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border" style="color: #005baa;" role="status"></div>
            <p class="mt-2 text-muted">Đang tải bài viết...</p>
        </div>

        <div v-else class="row g-4">
            <div class="col-lg-12">
                <div class="bg-white rounded shadow-sm p-3 p-md-4 mb-4 border-0">
                    
                    <h1 class="fs-2 fs-md-1 fw-bold text-dark mb-3">
                        {{ chi_tiet_bai_viet.tieu_de }}
                    </h1>
                    
                    <div class="d-flex flex-wrap align-items-center gap-3 pb-3 mb-4 border-bottom text-secondary small">
                        <span><i class="bi bi-calendar3 text-danger me-1"></i> Đăng lúc: {{ formatDate(chi_tiet_bai_viet.created_at) }}</span>
                        
                        <div class="ms-auto mt-2 mt-sm-0 d-flex align-items-center">
                            <span class="me-2 fw-bold text-dark">Chia sẻ:</span>
                            <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle text-white me-2" style="width: 32px; height: 32px; background-color: #1877f2;">
                                <i class="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle text-white me-2" style="width: 32px; height: 32px; background-color: #1da1f2;">
                                <i class="fa-brands fa-twitter"></i>
                            </a>
                            <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle text-white" style="width: 32px; height: 32px; background-color: #ea4335;">
                                <i class="fa-solid fa-envelope"></i>
                            </a>
                        </div>
                    </div>

                    <div class="mb-4 rounded overflow-hidden text-center" style="max-height: 500px; border-radius: 12px;">
                        <img :src="chi_tiet_bai_viet.hinh_anh" :alt="chi_tiet_bai_viet.tieu_de" class="w-100 h-100" style="object-fit: cover; object-position: center" />
                    </div>
                    
                    <div class="lh-lg text-dark article-content">
                        <div v-html="(chi_tiet_bai_viet.noi_dung || '').replace(/<img /g, '<img style=\'max-width:100%;height:auto;display:block;margin:15px auto;border-radius:8px\' ')">
                        </div>
                    </div>
                    
                    <div class="mt-5 pt-3 border-top" v-if="chi_tiet_bai_viet.tag">
                        <span class="fw-semibold text-dark me-2"><i class="fa-solid fa-tags text-success me-1"></i> Chủ đề:</span>
                        <a href="javascript:void(0)" v-for="(tag, index) in chi_tiet_bai_viet.tag.split(',')" :key="index"
                            class="badge rounded-pill text-decoration-none me-2 mb-2 py-2 px-3 tag-badge">
                            {{ tag.trim() }}
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-12" v-if="bai_viet_lien_quan.length > 0">
                <div class="bg-white rounded shadow-sm p-3 p-md-4 mb-4 border-0">
                    <h4 class="mb-4 fw-bold" style="color: #005baa;">Có Thể Bạn Quan Tâm</h4>
                    <div class="row">
                        <div v-for="(bai_viet, index) in bai_viet_lien_quan" :key="index" class="col-lg-4 col-md-6 d-flex mb-3">
                            <router-link :to="`/client/chi-tiet-bai-viet/${bai_viet.id}`" class="text-decoration-none text-dark d-flex w-100">
                                <div class="card w-100 d-flex flex-column border-0 shadow-sm related-card rounded-4 overflow-hidden">
                                    <div class="card-img-top" style="height: 200px; overflow: hidden">
                                        <img :src="bai_viet.hinh_anh" class="w-100 h-100" style="object-fit: cover; transition: transform 0.3s;" />
                                    </div>
                                    <div class="card-body d-flex flex-column flex-grow-1 p-3">
                                        <h6 class="card-title fw-bold text-truncate-2" style="line-height: 1.4;">{{ bai_viet.tieu_de }}</h6>
                                        <p class="card-text flex-grow-1 text-secondary mt-2 text-truncate-2" style="font-size: 0.9rem;">
                                            {{ bai_viet.mo_ta_ngan }}
                                        </p>
                                        <small class="text-muted mt-2"><i class="fa-regular fa-clock me-1"></i> {{ formatDate(bai_viet.created_at) }}</small>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
    data() {
        return {
            isLoading: true,
            id_bai_viet: this.$route.params.id_bai_viet,
            chi_tiet_bai_viet: {},
            bai_viet_lien_quan: [],
        };
    },
    mounted() {
        this.loadChiTietBaiViet();
    },
    watch: {
        $route(to, from) {
            // Cập nhật khi click sang bài viết liên quan
            if (to.params.id_bai_viet !== from.params.id_bai_viet) {
                this.id_bai_viet = to.params.id_bai_viet;
                this.loadChiTietBaiViet();
                window.scrollTo(0, 0); // Tự động cuộn lên đầu trang
            }
        },
    },
    methods: {
        async loadChiTietBaiViet() {
            this.isLoading = true;
            try {
                const payload = { id: this.id_bai_viet };
                // Gọi API Public (Không cần token để ai cũng đọc được tin tức)
                const res = await axios.post(apiUrl("client/chi-tiet-bai-viet/get-data"), payload);
                
                if (res.data.status) {
                    this.chi_tiet_bai_viet = res.data.data;
                    this.bai_viet_lien_quan = res.data.data_bai_viet_khac;
                    document.title = this.chi_tiet_bai_viet.tieu_de; // Đổi title tab trình duyệt
                } else {
                    this.$toast.error(res.data.message);
                    this.$router.push("/");
                }
            } catch (error) {
                console.error("Lỗi khi load chi tiết bài viết:", error);
                this.$toast.error("Không thể kết nối đến server");
                this.$router.push("/");
            } finally {
                this.isLoading = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes} - ${day}/${month}/${year}`;
        },
    },
};
</script>

<style scoped>
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-content {
    font-size: 1.1rem;
}

.tag-badge {
    background-color: #f1f3f5;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    font-weight: 500;
    transition: all 0.2s;
}

.tag-badge:hover {
    background-color: #005baa;
    color: white;
    border-color: #005baa;
}

.related-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.related-card:hover img {
    transform: scale(1.05);
}
</style>